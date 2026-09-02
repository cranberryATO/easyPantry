import { useInventory } from "@/components/InventoryProvider";
import { ShoppingListItem } from "@/components/ShoppingList";
import { getShoppingList } from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import { ScrollView, View } from "react-native";
import Animated, {
  LinearTransition,
  SlideOutDown,
} from "react-native-reanimated";

export default function ShoppingList() {
  const inventoryContext = useInventory();

  return (
    <View style={sharedStyles.page}>
      <ScrollView>
        {getShoppingList(inventoryContext.inventory)
          .filter(
            (item) => item.desiredCount > item.currentCount + item.inCartCount,
          )
          .map((item) => (
            <Animated.View
              layout={LinearTransition}
              exiting={SlideOutDown}
              key={item.id}
            >
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
          ))}
      </ScrollView>
    </View>
  );
}
