import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  CurrentInventoryItem,
  CurrentInventorySectionHeader,
} from "@/components/CurrentInventory";
import { InventoryRow } from "@/services/inventory";
import { useCallback } from "react";

export default function CurrentInventory() {
  const inventoryContext = useInventory();

  const handleItemCountChanged = useCallback(
    (itemId: string, itemCount: number) => {
      inventoryContext.updateItemCount(itemId, "currentCount", itemCount);
    },
    [],
  );

  const keyExtractor = useCallback((row: InventoryRow) => row.id, []);

  const renderItem = useCallback(
    ({ item }: { item: InventoryRow }) =>
      item.type === "section" ? (
        <CurrentInventorySectionHeader id={item.id} name={item.name} />
      ) : (
        <CurrentInventoryItem
          itemId={item.id}
          itemName={item.name}
          currentCount={item.currentCount}
          desiredCount={item.desiredCount}
          onChangeItemCount={handleItemCountChanged}
        />
      ),
    [handleItemCountChanged],
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
