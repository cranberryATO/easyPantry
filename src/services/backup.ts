import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { z } from "zod";
import { ITEMS_MAX, type Inventory, type InventoryRow } from "./inventory";

const count = z.number().int().min(0).max(ITEMS_MAX);

const sectionSchema = z.object({
  type: z.literal("section"),
  id: z.string().min(1),
  name: z.string(),
});

const itemSchema = z.object({
  type: z.literal("item"),
  id: z.string().min(1),
  name: z.string(),
  desiredCount: count,
  currentCount: count,
  inCartCount: count,
  orderInShoppingList: z.number().int(),
});

const rowSchema = z.discriminatedUnion("type", [
  sectionSchema,
  itemSchema,
]) satisfies z.ZodType<InventoryRow>;

const inventorySchema = z.object({
  hasSeeded: z.boolean(),
  rows: z.array(rowSchema),
}) satisfies z.ZodType<Inventory>;

const BACKUP_VERSION = 1;

type Backup = {
  app: "easyPantry";
  version: number;
  exportedAt: string;
  inventory: Inventory;
};

const backupSchema = z.object({
  app: z.literal("easyPantry"),
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  inventory: inventorySchema.superRefine((inv, ctx) => {
    const ids = new Set<string>();
    // Check ids are unique
    for (const row of inv.rows) {
      if (ids.has(row.id)) {
        ctx.addIssue({
          code: "custom",
          message: `Identifiant en double : ${row.id}`,
        });
      }
      ids.add(row.id);
    }
    // Check first row is a section
    if (inv.rows.length > 0 && inv.rows[0].type !== "section") {
      ctx.addIssue({
        code: "custom",
        message: "L'inventaire doit commencer par une section.",
      });
    }
  }),
}) satisfies z.ZodType<Backup>;

export async function exportInventory(inventory: Inventory): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Le partage n'est pas disponible sur cet appareil.");
  }

  const backup: Backup = {
    app: "easyPantry",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    inventory,
  };

  const stamp = new Date().toISOString().slice(0, 10);
  const file = new File(Paths.cache, `mon-stock-${stamp}.json`);

  file.create({ overwrite: true });
  file.write(JSON.stringify(backup, null, 2));

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    UTI: "public.json",
    dialogTitle: "Exporter mon inventaire",
  });
}

export async function importInventory(): Promise<Inventory | null> {
  const picked = await File.pickFileAsync({ mimeTypes: "application/json" });
  if (picked.canceled) {
    return null;
  }

  const raw = await picked.result.text();

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Fichier illisible : ce n'est pas du JSON.");
  }

  const result = backupSchema.safeParse(data);
  if (!result.success) {
    console.warn("Import error :", result.error.issues);
    throw new Error(result.error.issues[0]?.message ?? "Sauvegarde invalide.");
  }

  return { ...result.data.inventory, hasSeeded: true };
}
