import { useInventory } from "@/components/InventoryProvider";
import { SectionHeader } from "@/components/SectionHeader";
import { ShoppingListItem } from "@/components/ShoppingList";
import {
  getShoppingList,
  InventoryItem,
  InventoryRow,
} from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import { useCallback } from "react";
import { FlatList } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingList() {
  const inventoryContext = useInventory();

  const keyExtractor = useCallback((row: InventoryRow) => row.id, []);

  const renderItem = useCallback(
    ({ item }: { item: InventoryItem }) => (
      <Animated.View layout={LinearTransition}>
        <ShoppingListItem
          itemId={item.id}
          itemName={item.name}
          countInList={item.desiredCount - item.currentCount}
          countInCart={item.inCartCount}
          isFromInventory={true}
          onAddToCart={(itemId, count) => {
            inventoryContext.updateItemCount(
              itemId,
              "inCartCount",
              item.inCartCount + count,
            );
          }}
          onRemoveFromList={() => {}}
        />
      </Animated.View>
    ),
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page} edges={["right", "top", "left"]}>
      <SectionHeader name="📃Ma liste de courses" />

      <FlatList
        data={getShoppingList(inventoryContext.inventory).filter(
          (item) => item.desiredCount > item.currentCount + item.inCartCount,
        )}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = {
  buttonsContainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};
