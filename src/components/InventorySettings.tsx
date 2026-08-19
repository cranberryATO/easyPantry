import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { InventoryItem, compareInventoryItems } from "@/services/inventory";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export const InventorySettingsSection = React.memo(
  function InventorySettingsSection({
    sectionId,
    sectionName,
    items,
    onAddNewItem,
    onChangeItemName,
    onChangeItemCount,
    onMove,
    onRemove,
  }: {
    sectionId: string;
    sectionName: string;
    items: InventoryItem[];
    onAddNewItem: (sectionId: string) => void;
    onChangeItemName: (itemId: string, newName: string) => void;
    onChangeItemCount: (itemId: string, newCount: number) => void;
    onMove: (itemId: string, direction: "up" | "down") => void;
    onRemove: (itemId: string) => void;
  }) {
    return (
      <View style={sharedStyles.section}>
        <View style={sharedStyles.sectionTitleContainer}>
          <Text style={sharedStyles.sectionTitle}>{sectionName}</Text>
          <IconButton
            icon={Theme.ICON_COUNTER_PLUS}
            onPress={() => {
              onAddNewItem(sectionId);
            }}
          />
        </View>
        {items.toSorted(compareInventoryItems).map((item) => (
          <Animated.View
            key={item.id}
            style={sharedStyles.itemContainer}
            exiting={FadeOut}
            entering={FadeIn}
            layout={LinearTransition}
          >
            <InventorySettingsRow
              itemId={item.id}
              itemName={item.itemName}
              onChangeItemName={onChangeItemName}
              itemCount={item.desiredCount}
              onChangeItemCount={onChangeItemCount}
              onMove={onMove}
              onRemove={onRemove}
            />
          </Animated.View>
        ))}
      </View>
    );
  },
);

export const InventorySettingsRow = React.memo(function InventorySettingsRow({
  itemId,
  itemName,
  itemCount,
  onChangeItemName,
  onChangeItemCount,
  onMove,
  onRemove,
}: {
  itemId: string;
  itemName: string;
  itemCount: number;
  onChangeItemName: (itemId: string, newName: string) => void;
  onChangeItemCount: (itemId: string, newCount: number) => void;
  onMove: (itemId: string, direction: "up" | "down") => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <>
      <TextInput
        style={styles.itemNameTextInput}
        value={itemName}
        onChangeText={(value) => {
          onChangeItemName(itemId, value);
        }}
        placeholder="Nouvel article"
      />
      <View style={styles.buttonsContainer}>
        <EasyCounter
          count={itemCount}
          onChange={(value) => {
            onChangeItemCount(itemId, value);
          }}
        />
        <IconButton
          onPress={() => {
            onMove(itemId, "down");
          }}
          icon={"arrow-down-bold"}
        />
        <IconButton
          onPress={() => {
            onMove(itemId, "up");
          }}
          icon={"arrow-up-bold"}
        />
        <IconButton
          onPress={() => {
            onRemove(itemId);
          }}
          icon="trash-can"
        />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  itemNameTextInput: {
    paddingHorizontal: 0,
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    borderWidth: 0,
    justifyContent: "center",
    paddingVertical: 0,
  },
  buttonsContainer: {
    width: 180,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    textAlign: "center",
  },
});
