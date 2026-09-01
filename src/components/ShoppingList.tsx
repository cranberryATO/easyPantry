import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { memo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "./IconButton";

export const ShoppingListItem = memo(function ShoppingListItem({
  itemId,
  itemName,
  countInList,
  countInCart,
  isFromInventory,
  onAddToCart,
  onRemoveFromList,
}: {
  itemId: string;
  itemName: string;
  countInList: number;
  countInCart: number;
  isFromInventory: boolean;
  onAddToCart: (itemId: string, count: number) => void;
  onRemoveFromList: (itemId: string) => void;
}) {
  const [displayedCount, setDisplayedCount] = useState<number>(countInList);
  return (
    <View>
      <View style={sharedStyles.itemContainer}>
        <Text style={sharedStyles.itemNameText} numberOfLines={1}>
          {itemName}
        </Text>
        <View style={styles.buttonsContainer}>
          <IconButton
            icon="cart-minus"
            onPress={() => onAddToCart(itemId, -1)}
          />
          <View style={styles.cartContainer}>
            <MaterialCommunityIcons
              name="cart"
              size={Theme.ICON_BUTTON_SIZE}
              color={Theme.COLOR_GRAY_20}
            />
            <Text style={styles.cartText}>{countInCart}</Text>
          </View>
          <IconButton icon="cart-plus" onPress={() => onAddToCart(itemId, 1)} />
          <Text style={sharedStyles.countText}>{displayedCount}</Text>
          <IconButton
            icon="cart-check"
            onPress={() => onAddToCart(itemId, displayedCount)}
          />
        </View>
      </View>
      {countInCart >= countInList && <View style={styles.strikeThrough} />}
    </View>
  );
});

const styles = StyleSheet.create({
  buttonsContainer: {
    width: 150,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cartText: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
    color: Theme.COLOR_GRAY_80,
    fontWeight: "bold",
  },
  strikeThrough: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Theme.COLOR_GRAY_80,
  },
});
