import { CartItem } from "@/components/Cart";
import { IconButton } from "@/components/IconButton";
import { useInventory } from "@/components/InventoryProvider";
import { getShoppingList } from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  SlideOutLeft,
} from "react-native-reanimated";

export default function Cart() {
  const inventoryContext = useInventory();

  return (
    <>
      <View style={sharedStyles.page}>
        <ScrollView>
          {getShoppingList(inventoryContext.inventory)
            .filter((item) => item.inCartCount > 0)
            .map((item) => (
              <Animated.View
                layout={LinearTransition}
                exiting={SlideOutLeft}
                key={item.id}
              >
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
            ))}
        </ScrollView>
      </View>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <IconButton
              icon="cart-arrow-up"
              size={30}
              onPress={inventoryContext.addAllCartItemsToInventory}
              style={{ marginRight: 10 }}
            />
          ),
        }}
      />
    </>
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
