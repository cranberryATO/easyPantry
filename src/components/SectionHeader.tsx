import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
            onAddNewItem(id ? id : "");
          }}
        />
      )}
      <View style={styles.line}></View>
    </View>
  );
});

export function NewSectionHeader({
  onAddNewSection,
}: {
  onAddNewSection: (name: string) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.line}></View>
      <Pressable
        onPress={() => onAddNewSection("Nouvelle section")}
        style={styles.button}
        android_ripple={{ color: Theme.COLOR_GRAY_30 }}
      >
        <Text style={styles.buttonText}> Ajouter une section </Text>
      </Pressable>
      <View style={styles.line}></View>
    </View>
  );
}

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
  button: {
    backgroundColor: Theme.ICON_BUTTON_COLOR,
    padding: 10,
    borderRadius: 100,
  },
  buttonText: {
    textTransform: "uppercase",
    fontWeight: "bold",
    color: Theme.COLOR_BACKGROUND,
  },
});
