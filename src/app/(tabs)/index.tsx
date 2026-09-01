import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { FlatList, View } from "react-native";

import { CurrentInventoryItem } from "@/components/CurrentInventory";
import { SectionHeader } from "@/components/SectionHeader";
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
        <SectionHeader name={item.name} />
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
    <View style={sharedStyles.page}>
      <FlatList
        data={inventoryContext.inventory.rows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
}
