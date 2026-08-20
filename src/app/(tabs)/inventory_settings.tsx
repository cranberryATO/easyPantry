import { useInventory } from "@/components/InventoryProvider";
import {
  InventorySettingsItem,
  InventorySettingsSectionHeader,
} from "@/components/InventorySettings";
import { InventoryRow } from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import { useCallback } from "react";
import { FlatList } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
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

  const keyExtractor = useCallback((row: InventoryRow) => row.id, []);

  const renderItem = useCallback(
    ({ item: row }: { item: InventoryRow }) =>
      row.type === "section" ? (
        <Animated.View
          style={sharedStyles.sectionTitleContainer}
          layout={LinearTransition}
        >
          <InventorySettingsSectionHeader
            id={row.id}
            name={row.name}
            onAddNewItem={handleAddNewItemToSection}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={sharedStyles.itemContainer}
          layout={LinearTransition}
        >
          <InventorySettingsItem
            itemId={row.id}
            itemName={row.name}
            itemCount={row.desiredCount}
            onChangeItemCount={handleItemCountChanged}
            onChangeItemName={handleItemNameChanged}
            onMove={handleMoveItem}
            onRemove={handleRemoveItem}
          />
        </Animated.View>
      ),
    [],
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: InventoryRow[] }) => inventoryContext.replaceRows(data),
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page}>
      <FlatList
        data={inventoryContext.inventory.rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}
