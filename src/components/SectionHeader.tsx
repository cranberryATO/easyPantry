import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "./IconButton";

export const SectionHeader = React.memo(function SectionHeader({
  id,
  name,
  onAddNewItem,
}: {
  id?: string;
  name: string;
  onAddNewItem?: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.line}></View>
      <Text
        style={[
          sharedStyles.sectionTitle,
          onAddNewItem != null && { marginRight: 10 },
        ]}
      >
        {name}
      </Text>
      {onAddNewItem != null && (
        <IconButton
          icon={Theme.ICON_COUNTER_PLUS}
          onPress={() => {
            onAddNewItem(id);
          }}
        />
      )}
      <View style={styles.line}></View>
    </View>
  );
});

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

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 35,
    margin: 0,
  },
  line: {
    flex: 1,
    flexShrink: 1,
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: Theme.COLOR_GRAY_20,
    marginHorizontal: 10,
  },
});
