import { CartItem } from "@/components/Cart";
import { useInventory } from "@/components/InventoryProvider";
import { SectionHeader } from "@/components/SectionHeader";
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

export default function Cart() {
  const inventoryContext = useInventory();

  const keyExtractor = useCallback((row: InventoryRow) => row.id, []);

  const renderItem = useCallback(
    ({ item }: { item: InventoryItem }) => (
      <Animated.View layout={LinearTransition}>
        <CartItem
          itemId={item.id}
          itemName={item.name}
          countInCart={item.inCartCount}
          isFromInventory={true}
          onAddToCart={(itemId, count) => {
            inventoryContext.updateItemCount(
              itemId,
              "inCartCount",
              item.inCartCount + count,
            );
          }}
        />
      </Animated.View>
    ),
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page}>
      <SectionHeader name="🛒 Mon caddie" />
      <FlatList
        data={getShoppingList(inventoryContext.inventory).filter(
          (item) => item.inCartCount > 0,
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
    alignItems: "center",
  },
};
