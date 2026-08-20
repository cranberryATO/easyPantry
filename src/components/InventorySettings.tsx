import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
export const InventorySettingsSectionHeader = React.memo(
  function InventorySettingsSectionHeader({
    id,
    name,
    onAddNewItem,
  }: {
    id: string;
    name: string;
    onAddNewItem: (sectionId: string) => void;
  }) {
    return (
      <>
        <Text style={sharedStyles.sectionTitle}>{name}</Text>
        <IconButton
          icon={Theme.ICON_COUNTER_PLUS}
          onPress={() => {
            onAddNewItem(id);
          }}
        />
      </>
    );
  },
);

export const InventorySettingsItem = React.memo(function InventorySettingsItem({
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
    <View style={sharedStyles.itemContainer}>
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
    </View>
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
