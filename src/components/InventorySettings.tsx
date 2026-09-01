import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

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
        <View style={styles.line}></View>
        <Text style={[sharedStyles.sectionTitle, { marginRight: 10 }]}>
          {name}
        </Text>
        <IconButton
          icon={Theme.ICON_COUNTER_PLUS}
          onPress={() => {
            onAddNewItem(id);
          }}
        />
        <View style={styles.line}></View>
      </>
    );
  },
);

export const InventorySettingsItem = React.memo(function InventorySettingsItem({
  itemId,
  itemName,
  itemCount,
  dragTranslationY,
  dragY,
  onChangeItemName,
  onChangeItemCount,
  onMove,
  onRemove,
  onDragStart,
  onDragEnd,
}: {
  itemId: string;
  itemName: string;
  itemCount: number;
  dragTranslationY: SharedValue<number>;
  dragY: SharedValue<number>;
  onChangeItemName: (itemId: string, newName: string) => void;
  onChangeItemCount: (itemId: string, newCount: number) => void;
  onMove: (itemId: string, direction: "up" | "down") => void;
  onRemove: (itemId: string) => void;
  onDragStart: (itemId: string) => void;
  onDragEnd: () => void;
}) {
  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onStart((e) => {
      dragTranslationY.value = e.y;
      scheduleOnRN(onDragStart, itemId);
    })
    .onUpdate((e) => {
      dragY.value = e.absoluteY;
    })
    .onEnd((e) => {
      scheduleOnRN(onDragEnd);
    });

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <View style={styles.grip}>
          <MaterialCommunityIcons
            name="drag"
            size={Theme.ICON_BUTTON_SIZE}
            color={Theme.ICON_BUTTON_COLOR}
          />
        </View>
      </GestureDetector>
      <TextInput
        style={styles.itemNameTextInput}
        value={itemName}
        onChangeText={(value) => {
          onChangeItemName(itemId, value);
        }}
        placeholder=""
      />
      <IconButton
        onPress={() => {
          onRemove(itemId);
        }}
        icon="trash-can-outline"
      />
      <View style={styles.spacer} />
      <View style={styles.buttonsContainer}>
        <EasyCounter
          count={itemCount}
          onChange={(value) => {
            onChangeItemCount(itemId, value);
          }}
        />
        {/*
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
        />*/}
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
    //width: 180,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    textAlign: "center",
  },
  grip: {
    width: 30,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    flexShrink: 1,
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.COLOR_GRAY_20,
    marginHorizontal: 10,
  },
  spacer: {
    width: 20,
  },
});
