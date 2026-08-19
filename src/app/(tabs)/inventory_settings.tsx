import { useInventory } from "@/components/InventoryProvider";
import { InventorySettingsSection } from "@/components/InventorySettings";
import { sharedStyles } from "@/theme/styles";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventorySettings() {
  const inventoryContext = useInventory();

  const handleAddNewItemToSection = useCallback((sectionId: string) => {
    inventoryContext.addNewItem(sectionId, "");
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    inventoryContext.removeItem(itemId);
  }, []);

  const handleMoveItem = useCallback(
    (itemId: string, direction: "up" | "down") => {
      inventoryContext.moveItem(itemId, direction);
    },
    [],
  );

  const handleItemNameChanged = useCallback(
    (itemId: string, itemName: string) => {
      inventoryContext.renameItem(itemId, itemName);
    },
    [],
  );

  const handleItemCountChanged = useCallback(
    (itemId: string, itemCount: number) => {
      inventoryContext.updateItemCount(itemId, "desiredCount", itemCount);
    },
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page}>
      <FlatList data=>
        {inventoryContext.inventory.sections.map((section) => (

          <InventorySettingsSection
            key={section.id}
            sectionId={section.id}
            sectionName={section.sectionName}
            items={section.items}
            onAddNewItem={handleAddNewItemToSection}
            onChangeItemCount={handleItemCountChanged}
            onChangeItemName={handleItemNameChanged}
            onMove={handleMoveItem}
            onRemove={handleRemoveItem}
          />
        ))}
      </FlatList>
    </SafeAreaView>
  );
}
