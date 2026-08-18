import React, { createContext, useContext, useEffect, useState } from "react";

import { DEFAULT_INVENTORY } from "@/data/default_inventory";
import * as Inventory from "@/services/inventory";

type InventoryContextValue = {
  inventory: Inventory.Inventory;
  updateItemCount: (
    sectionIndex: number,
    itemIndex: number,
    field: "desiredCount" | "currentCount",
    newCount: number,
  ) => void;
  renameItem: (
    sectionIndex: number,
    itemIndex: number,
    newName: string,
  ) => void;
  moveItem: (
    sectionIndex: number,
    itemIndex: number,
    direction: "up" | "down",
  ) => void;
  removeItem: (sectionIndex: number, itemIndex: number) => void;
  addNewItem: (
    sectionIndex: number,
    itemIndex: number,
    itemName: string,
  ) => void;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [inventory, setInventory] = useState<Inventory.Inventory>({
    hasSeeded: false,
    sections: [],
  });

  // Load inventory from AsyncStorage on component mount
  useEffect(() => {
    (async () => {
      const stored = await Inventory.loadInventory();
      console.log("Loaded inventory:", stored);
      if (!stored.hasSeeded) {
        setInventory(DEFAULT_INVENTORY);
      } else {
        setInventory(stored);
      }
      setHasLoaded(true);
    })();
  }, []);

  // Save inventory to AsyncStorage whenever it changes
  useEffect(() => {
    (async () => {
      if (hasLoaded) {
        await Inventory.saveInventory(inventory);
      }
    })();
  }, [inventory, hasLoaded]);

  // Create new inventory with updated value and set inventory
  // Warning : all the functions below completely clone the inventory.
  // This means re-rendering the whole tree each time we change a value.
  // Not a big deal for a small list but not a pattern to copy
  // for projects managing long lists

  function updateItemCount(
    sectionIndex: number,
    itemIndex: number,
    field: "desiredCount" | "currentCount",
    newCount: number,
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      Inventory.updateItemCount(
        newInventory,
        sectionIndex,
        itemIndex,
        field,
        newCount,
      );
      return newInventory;
    });
  }

  function renameItem(
    sectionIndex: number,
    itemIndex: number,
    newName: string,
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      Inventory.renameItem(newInventory, sectionIndex, itemIndex, newName);
      return newInventory;
    });
  }

  function moveItem(
    sectionIndex: number,
    itemIndex: number,
    direction: "up" | "down",
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      Inventory.moveItem(newInventory, sectionIndex, itemIndex, direction);
      return newInventory;
    });
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      Inventory.removeItem(newInventory, sectionIndex, itemIndex);
      return newInventory;
    });
  }

  function addNewItem(
    sectionIndex: number,
    itemIndex: number,
    itemName: string,
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      Inventory.addNewItem(newInventory, sectionIndex, itemIndex, itemName);
      return newInventory;
    });
  }

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        updateItemCount,
        renameItem,
        moveItem,
        removeItem,
        addNewItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
