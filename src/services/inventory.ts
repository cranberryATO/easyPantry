import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const INVENTORY_KEY = "inventory";
const ITEMS_MAX = 99;

export type InventorySection = {
  type: "section";
  id: string;
  name: string;
};

export type InventoryItem = {
  type: "item";
  id: string;
  name: string;
  desiredCount: number;
  currentCount: number;
};

export type InventoryRow = InventorySection | InventoryItem;

export type Inventory = {
  hasSeeded: boolean;
  rows: InventoryRow[];
};

export async function loadInventory(): Promise<Inventory> {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  if (raw === null) {
    return { hasSeeded: false, rows: [] };
  }
  const inventory = JSON.parse(raw);
  return inventory;
}

export async function saveInventory(items: Inventory): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

function findRowIndex(inventory: Inventory, id: string): number {
  return inventory.rows.findIndex((row) => row.id === id);
}

function findRow(inventory: Inventory, id: string): InventoryRow | undefined {
  return inventory.rows.find((row) => row.id === id);
}

function findItem(inventory: Inventory, id: string): InventoryItem | undefined {
  const row = inventory.rows.find((row) => row.id === id);
  return row == undefined || row?.type !== "item" ? undefined : row;
}

function findItemIndex(inventory: Inventory, id: string): number {
  return inventory.rows.findIndex(
    (row) => row.id === id && row.type === "item",
  );
}

// Modify inventory IN PLACE
export function updateItemCount(
  inventory: Inventory,
  id: string,
  field: "desiredCount" | "currentCount",
  newCount: number,
) {
  const item = findItem(inventory, id);
  if (item != null) {
    item[field] = Math.min(ITEMS_MAX, Math.max(0, newCount));
  }
}

export function renameRow(inventory: Inventory, id: string, newName: string) {
  const row = findRow(inventory, id);
  if (row != null) {
    row.name = newName;
  }
}

export function moveItemByIndex(
  inventory: Inventory,
  itemIndex: number,
  afterIndex: number,
) {
  if (
    itemIndex < 1 ||
    itemIndex > inventory.rows.length - 1 ||
    afterIndex < 1 ||
    afterIndex > inventory.rows.length - 1 ||
    itemIndex == afterIndex
  ) {
    return;
  }
  console.log("move from " + itemIndex + " to " + afterIndex);
  inventory.rows.splice(afterIndex, 0, inventory.rows.splice(itemIndex, 1)[0]);
}

export function moveItem(
  inventory: Inventory,
  itemId: string,
  direction: "up" | "down",
) {
  const index = findItemIndex(inventory, itemId);
  if (index === -1) {
    return;
  }
  const row = inventory.rows[index];
  if (row.type === "item") {
    const item = row;

    if (direction === "up") {
      if (index > 1) {
        // can't move higher than first section header
        [inventory.rows[index], inventory.rows[index - 1]] = [
          inventory.rows[index - 1],
          inventory.rows[index],
        ];
      }
    } else if (direction === "down") {
      if (index < inventory.rows.length - 1) {
        [inventory.rows[index], inventory.rows[index + 1]] = [
          inventory.rows[index + 1],
          inventory.rows[index],
        ];
      }
    }
  }
}

export function removeItem(inventory: Inventory, itemId: string) {
  const index = findItemIndex(inventory, itemId);
  if (index !== -1) {
    inventory.rows.splice(index, 1);
  }
}

export function addNewItem(
  inventory: Inventory,
  afterId: string,
  itemName: string,
) {
  const index = findRowIndex(inventory, afterId);
  if (index !== -1) {
    console.log("add item");
    inventory.rows.splice(index + 1, 0, {
      type: "item",
      name: itemName,
      id: Crypto.randomUUID(),
      desiredCount: 1,
      currentCount: 0,
    });
  }
}

export function replaceRows(inventory: Inventory, rows: InventoryRow[]) {
  inventory.rows = rows;
}
