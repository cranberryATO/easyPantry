import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const INVENTORY_KEY = "inventory";
const ITEMS_MAX = 99;

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

export function compareInventoryItems(a: InventoryItem, b: InventoryItem) {
  return a.orderInSection - b.orderInSection;
}

export async function loadInventory(): Promise<Inventory> {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  if (raw === null) {
    return { hasSeeded: false, sections: [] };
  }
  // On load, normalize the order values
  const inventory = JSON.parse(raw);
  inventory.sections.sort(
    (a: InventorySection, b: InventorySection) =>
      a.sectionOrder - b.sectionOrder,
  );
  inventory.sections.forEach(
    (section: InventorySection, sectionIndex: number) => {
      section.sectionOrder = sectionIndex;
      section.items.sort(compareInventoryItems);
      section.items.forEach((item: InventoryItem, itemIndex: number) => {
        item.orderInSection = itemIndex;
      });
    },
  );
  return inventory;
}

export async function saveInventory(items: Inventory): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

function findItemIndex(
  inventory: Inventory,
  itemId: string,
): { sectionIndex: number; itemIndex: number } {
  for (const [sectionIndex, section] of inventory.sections.entries()) {
    const itemIndex = section.items.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      return { sectionIndex, itemIndex };
    }
  }
  return { sectionIndex: -1, itemIndex: -1 };
}

function findItem(
  inventory: Inventory,
  itemId: string,
): { section: InventorySection | null; item: InventoryItem | null } {
  for (const section of inventory.sections) {
    const item = section.items.find((item) => item.id === itemId);
    if (item != null) {
      return { section, item };
    }
  }
  return { section: null, item: null };
}

function sectionMaxOrder(section: InventorySection): number {
  return section.items.length === 0
    ? 0
    : section.items.reduce(
        (maxOrder, item) => Math.max(maxOrder, item.orderInSection),
        -Infinity,
      );
}

function sectionMinOrder(section: InventorySection): number {
  return section.items.length === 0
    ? 0
    : section.items.reduce(
        (minOrder, item) => Math.min(minOrder, item.orderInSection),
        Infinity,
      );
}

// Modify inventory IN PLACE
export function updateItemCount(
  inventory: Inventory,
  itemId: string,
  field: "desiredCount" | "currentCount",
  newCount: number,
) {
  const { item } = findItem(inventory, itemId);
  if (item !== null) {
    item[field] = Math.min(ITEMS_MAX, Math.max(0, newCount));
  }
}

export function renameItem(
  inventory: Inventory,
  itemId: string,
  newName: string,
) {
  const { item } = findItem(inventory, itemId);
  if (item !== null) {
    item.itemName = newName;
  }
}

export function moveItem(
  inventory: Inventory,
  itemId: string,
  direction: "up" | "down",
) {
  // Items are not sorted in the inventory, they are sorted at render.
  // So to move an item up, 2 cases :
  // 1st in section by order : put it at the end of previous section
  // 2nd in section by order : order becomes order of first in section minus 1
  // 3rd or more in section : order becomes the middle of the two items before it.
  const { sectionIndex, itemIndex } = findItemIndex(inventory, itemId);
  if (sectionIndex === -1) {
    return;
  }
  const section = inventory.sections[sectionIndex];
  const item = section.items[itemIndex];
  const sortedSections = inventory.sections.toSorted(
    (a: InventorySection, b: InventorySection) =>
      a.sectionOrder - b.sectionOrder,
  );
  const sectionSortedIndex = sortedSections.findIndex(
    (_section) => _section.id === section.id,
  );
  const sortedItems = section.items.toSorted(compareInventoryItems);
  const itemSortedIndex = sortedItems.findIndex((_item) => _item.id === itemId);
  if (direction === "up") {
    if (itemSortedIndex === 0) {
      // Move at the end of previous section
      // Unless first section then do nothing.
      if (sectionSortedIndex > 0) {
        // remove from current section
        section.items.splice(itemIndex, 1);
        // add to other section, and set order at the max of that section + 1
        const newSection = sortedSections[sectionSortedIndex - 1];
        item.orderInSection = sectionMaxOrder(newSection) + 1;
        newSection.items.push(item);
      }
    } else if (itemSortedIndex === 1) {
      // Becomes the smallest order in section
      item.orderInSection = sortedItems[0].orderInSection - 1;
    } else {
      // Becomes the mean of two previous items
      item.orderInSection =
        (sortedItems[itemSortedIndex - 1].orderInSection +
          sortedItems[itemSortedIndex - 2].orderInSection) /
        2;
    }
  } else if (direction === "down") {
    if (itemSortedIndex === sortedItems.length - 1) {
      // Move at the beginning of next section
      // Unless last section then do nothing.
      if (sectionSortedIndex < inventory.sections.length - 1) {
        // remove from current section
        section.items.splice(itemIndex, 1);
        // add to other section, and set order at the min of that section - 1
        const newSection = sortedSections[sectionSortedIndex + 1];
        item.orderInSection = sectionMinOrder(newSection) - 1;
        newSection.items.push(item);
      }
    } else if (itemSortedIndex === sortedItems.length - 2) {
      // Becomes the highest order in section
      item.orderInSection = sortedItems[itemSortedIndex + 1].orderInSection + 1;
    } else {
      // Becomes the mean of two next items
      item.orderInSection =
        (sortedItems[itemSortedIndex + 1].orderInSection +
          sortedItems[itemSortedIndex + 2].orderInSection) /
        2;
    }
  }
}

export function removeItem(inventory: Inventory, itemId: string) {
  const { sectionIndex, itemIndex } = findItemIndex(inventory, itemId);
  if (sectionIndex === -1) {
    return;
  }
  inventory.sections[sectionIndex].items.splice(itemIndex, 1);
}

// Add new item at the beginning of section
export function addNewItem(
  inventory: Inventory,
  sectionId: string,
  itemName: string,
) {
  // find section
  const section = inventory.sections.find(
    (section) => section.id === sectionId,
  );
  if (section == null) {
    return;
  }
  section.items.push({
    itemName: itemName,
    id: Crypto.randomUUID(),
    desiredCount: 1,
    currentCount: 0,
    orderInSection: sectionMinOrder(section) - 1,
  });
}
