import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { DEFAULT_INVENTORY } from "@/data/default_inventory";
import * as Inventory from "@/services/inventory";
import { produce } from "immer";

type InventoryContextValue = {
  inventory: Inventory.Inventory;
  updateItemCount: (
    itemId: string,
    field: "desiredCount" | "currentCount",
    newCount: number,
  ) => void;
  renameItem: (itemId: string, newName: string) => void;
  moveItem: (itemId: string, direction: "up" | "down") => void;
  removeItem: (itemId: string) => void;
  addNewItem: (itemId: string, itemName: string) => void;
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
  // The inventory service changes inventory in-place ;
  // React needs a new inventory each time, shallow copy of
  // the previous one, but new references on changed paths.
  // StructuredClone() would re-render anything that references an
  // inventory item ; shallow copy would not trigger render
  // on mutated items.
  // Immer.produce() makesit easy to produce the required copy  :
  // it takes the inventory, creates a
  // draft copy where we can make the  in-place changes, and then compares
  // both and create the shallow copy with new references only on the touched
  // paths.

  const updateItemCount = useCallback(
    (
      itemId: string,
      field: "desiredCount" | "currentCount",
      newCount: number,
    ) => {
      setInventory((prev) =>
        produce(prev, (draft) => {
          Inventory.updateItemCount(draft, itemId, field, newCount);
        }),
      );
    },
    [],
  );

  const renameItem = useCallback((itemId: string, newName: string) => {
    setInventory((prev) =>
      produce(prev, (draft) => {
        Inventory.renameItem(draft, itemId, newName);
      }),
    );
  }, []);

  const moveItem = useCallback((itemId: string, direction: "up" | "down") => {
    setInventory((prev) =>
      produce(prev, (draft) => {
        Inventory.moveItem(draft, itemId, direction);
      }),
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setInventory((prev) =>
      produce(prev, (draft) => {
        Inventory.removeItem(draft, itemId);
      }),
    );
  }, []);

  const addNewItem = useCallback((sectionId: string, itemName: string) => {
    setInventory((prev) =>
      produce(prev, (draft) => {
        Inventory.addNewItem(draft, sectionId, itemName);
      }),
    );
  }, []);

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
