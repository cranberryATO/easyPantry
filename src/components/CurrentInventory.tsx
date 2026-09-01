import { EasyCounter } from "@/components/EasyCounter";
import { InventoryItem, compareInventoryItems } from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const CurrentInventorySection = React.memo(
  function CurrentInventorySection({
    sectionId,
    sectionName,
    items,
    onChangeItemCount,
  }: {
    sectionId: string;
    sectionName: string;
    items: InventoryItem[];
    onChangeItemCount: (itemId: string, newCount: number) => void;
  }) {
    return (
      <View key={sectionId} style={sharedStyles.section}>
        <View style={sharedStyles.sectionTitleContainer}>
          <Text style={sharedStyles.sectionTitle}>{sectionName}</Text>
        </View>
        {items.toSorted(compareInventoryItems).map((item, itemIndex) => (
          <CurrentInventoryRow
            key={item.id}
            itemId={item.id}
            itemName={item.itemName}
            currentCount={item.currentCount}
            desiredCount={item.desiredCount}
            onChangeItemCount={onChangeItemCount}
          />
        ))}
      </View>
    );
  },
);

export function CurrentInventorySectionHeader({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <View style={sharedStyles.sectionTitleContainer}>
      <Text style={sharedStyles.sectionTitle}>{name}</Text>
    </View>
  );
}

export const CurrentInventoryItem = React.memo(function CurrentInventoryItem({
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
