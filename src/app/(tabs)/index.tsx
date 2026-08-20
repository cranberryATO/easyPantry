import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { FlatList } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  CurrentInventoryItem,
  CurrentInventorySectionHeader,
} from "@/components/CurrentInventory";
import { useCallback } from "react";

export default function CurrentInventory() {
  const inventoryContext = useInventory();

  const handleItemCountChanged = useCallback(
    (itemId: string, itemCount: number) => {
      inventoryContext.updateItemCount(itemId, "currentCount", itemCount);
    },
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page}>
      <FlatList
        data={inventoryContext.inventory.rows}
        keyExtractor={(row) => row.id}
        renderItem={({ item }) =>
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
          )
        }
      />
    </SafeAreaView>
  );
}
