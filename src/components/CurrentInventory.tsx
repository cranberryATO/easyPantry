import { EasyCounter } from "@/components/EasyCounter";
import { sharedStyles } from "@/theme/styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const CurrentInventoryRow = React.memo(function CurrentInventoryRow({
  itemId,
  itemName,
  currentCount,
  desiredCount,
  onChangeItemCount,
}: {
  itemId: string;
  itemName: string;
  currentCount: number;
  desiredCount: number;
  onChangeItemCount: (itemId: string, newCount: number) => void;
}) {
  return (
    <View>
      <View style={sharedStyles.itemContainer}>
        <Text style={sharedStyles.itemNameText} numberOfLines={1}>
          {itemName}
        </Text>
        <View style={styles.buttonsContainer}>
          <EasyCounter
            count={currentCount}
            onChange={(newCount) => onChangeItemCount(itemId, newCount)}
            total={desiredCount}
            reverse={true}
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonsContainer: {
    width: 90,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
