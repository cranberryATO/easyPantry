import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const INVENTORY_KEY = "inventory";

export type InventorySection = {
  sectionName: string;
  sectionOrder: number;
  items: InventoryItem[];
  id: string;
};

export type InventoryItem = {
  itemName: string;
  desiredCount: number;
  currentCount: number;
  orderInSection: number;
  id: string;
};

export type Inventory = {
  hasSeeded: boolean;
  sections: InventorySection[];
};

export async function loadInventory(): Promise<Inventory> {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  return raw ? JSON.parse(raw) : { hasSeeded: false, sections: [] };
}

export async function saveInventory(items: Inventory): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

// Modify inventory IN PLACE
export function updateItemCount(
  inventory: Inventory,
  sectionIndex: number,
  itemIndex: number,
  field: "desiredCount" | "currentCount",
  newCount: number,
) {
  console.log(
    `Updating ${field} for item at section ${sectionIndex}, item ${itemIndex} to ${newCount}`,
  );
  inventory.sections[sectionIndex].items[itemIndex][field] = Math.max(
    0,
    newCount,
  );
}

export function renameItem(
  inventory: Inventory,
  sectionIndex: number,
  itemIndex: number,
  newName: string,
) {
  inventory.sections[sectionIndex].items[itemIndex].itemName = newName;
}

export function moveItem(
  inventory: Inventory,
  sectionIndex: number,
  itemIndex: number,
  direction: "up" | "down",
) {
  const items = inventory.sections[sectionIndex].items;
  let newItemIndex = itemIndex;
  let newSectionIndex = sectionIndex;
  if (direction === "up") {
    if (itemIndex > 0) {
      [items[itemIndex - 1], items[itemIndex]] = [
        items[itemIndex],
        items[itemIndex - 1],
      ];
      newItemIndex = itemIndex - 1;
    } else {
      // moving item to previous section if it exists
      if (sectionIndex > 0) {
        const prevSectionItems = inventory.sections[sectionIndex - 1].items;
        const itemToMove = items[itemIndex];
        // Remove from current section
        items.splice(itemIndex, 1);
        // Add to previous section at the end
        newItemIndex = prevSectionItems.length;
        prevSectionItems.push(itemToMove);
        newSectionIndex = sectionIndex - 1;
      }
    }
  } else if (direction === "down") {
    if (itemIndex < items.length - 1) {
      [items[itemIndex + 1], items[itemIndex]] = [
        items[itemIndex],
        items[itemIndex + 1],
      ];
      newItemIndex = itemIndex + 1;
    } else {
      // moving item to next section if it exists
      if (sectionIndex < inventory.sections.length - 1) {
        const nextSectionItems = inventory.sections[sectionIndex + 1].items;
        const itemToMove = items[itemIndex];
        // Remove from current section
        items.splice(itemIndex, 1);
        // Add to next section at the beginning
        nextSectionItems.unshift(itemToMove);
        newSectionIndex = sectionIndex + 1;
        newItemIndex = 0;
      }
    }
  }
  console.log(
    `Moved item from section ${sectionIndex}, item ${itemIndex} to section ${newSectionIndex}, item ${newItemIndex}`,
  );
}

export function removeItem(
  inventory: Inventory,
  sectionIndex: number,
  itemIndex: number,
) {
  inventory.sections[sectionIndex].items.splice(itemIndex, 1);
  console.log(`Removed item at section ${sectionIndex}, item ${itemIndex}`);
}

export function addNewItem(
  inventory: Inventory,
  sectionIndex: number,
  itemIndex: number,
  itemName: string,
) {
  inventory.sections[sectionIndex].items.splice(itemIndex, 0, {
    itemName: itemName,
    id: Crypto.randomUUID(),
    desiredCount: 0,
    currentCount: 0,
    orderInSection: 0,
  });
}
