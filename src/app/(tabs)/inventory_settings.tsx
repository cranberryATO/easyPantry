import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventorySettings() {
  const inventoryContext = useInventory();

  const [editingText, setEditingText] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{
    isEditing: boolean;
    sectionIndex: number;
    itemIndex: number;
  }>({ isEditing: false, sectionIndex: 0, itemIndex: 0 });

  function handleRemoveItem(sectionIndex: number, itemIndex: number) {
    setEditingItem({ isEditing: false, sectionIndex: 0, itemIndex: 0 });
    inventoryContext.removeItem(sectionIndex, itemIndex);
  }

  function handleMoveItem(
    sectionIndex: number,
    itemIndex: number,
    direction: "up" | "down",
  ) {
    setEditingItem({ isEditing: false, sectionIndex: 0, itemIndex: 0 });
    inventoryContext.moveItem(sectionIndex, itemIndex, direction);
  }

  function handleAddNewItemToSection(sectionIndex: number) {
    inventoryContext.addNewItem(sectionIndex, 0, "");
    setEditingText("");
    setEditingItem({
      isEditing: true,
      sectionIndex: sectionIndex,
      itemIndex: 0,
    });
  }

  function handleFinishEditing(sectionIndex: number, itemIndex: number) {
    const trimmed = editingText.trim();
    if (trimmed != "") {
      inventoryContext.renameItem(sectionIndex, itemIndex, trimmed);
    }
    setEditingItem({
      isEditing: false,
      sectionIndex: 0,
      itemIndex: 0,
    });
  }

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView>
        {inventoryContext.inventory.sections.map((section, sectionIndex) => (
          <View key={section.id} style={sharedStyles.section}>
            <Animated.View
              style={sharedStyles.sectionTitleContainer}
              exiting={FadeOut}
              layout={LinearTransition}
            >
              <Text style={sharedStyles.sectionTitle}>
                {section.sectionName}
              </Text>
              <IconButton
                icon={Theme.ICON_COUNTER_PLUS}
                onPress={() => {
                  handleAddNewItemToSection(sectionIndex);
                }}
              />
            </Animated.View>
            {section.items.map((item, itemIndex) => (
              <Animated.View
                style={sharedStyles.itemContainer}
                key={item.id}
                exiting={FadeOut}
                entering={FadeIn}
                layout={LinearTransition}
              >
                {/* When editing, show a TextInput instead of the Text
                  component and show a delete button and a "move" handle*/}
                {editingItem.isEditing &&
                editingItem.sectionIndex === sectionIndex &&
                editingItem.itemIndex === itemIndex ? (
                  <TextInput
                    autoFocus
                    style={styles.itemNameTextInput}
                    value={editingText}
                    onChangeText={setEditingText}
                    placeholder="Nouvel article"
                    onBlur={() => {
                      handleFinishEditing(sectionIndex, itemIndex);
                    }}
                  />
                ) : (
                  <Pressable
                    style={sharedStyles.itemName}
                    onPress={() => {
                      setEditingItem({
                        isEditing: true,
                        sectionIndex,
                        itemIndex,
                      });
                      setEditingText(item.itemName);
                    }}
                    disabled={
                      editingItem.isEditing /* if isEditingis true then it is editing another item */
                    }
                  >
                    <Text style={sharedStyles.itemNameText} numberOfLines={1}>
                      {item.itemName}
                    </Text>
                  </Pressable>
                )}
                <View style={styles.buttonsContainer}>
                  <EasyCounter
                    enabled={
                      !editingItem.isEditing /* if isEditingis true then it is editing another item */
                    }
                    count={item.desiredCount}
                    onChange={(newCount) =>
                      inventoryContext.updateItemCount(
                        sectionIndex,
                        itemIndex,
                        "desiredCount",
                        newCount,
                      )
                    }
                  />
                  <IconButton
                    onPress={() => {
                      handleMoveItem(sectionIndex, itemIndex, "down");
                    }}
                    icon={"arrow-down-bold"}
                  />
                  <IconButton
                    onPress={() => {
                      handleMoveItem(sectionIndex, itemIndex, "up");
                    }}
                    icon={"arrow-up-bold"}
                  />
                  <IconButton
                    onPress={() => {
                      handleRemoveItem(sectionIndex, itemIndex);
                    }}
                    icon="trash-can"
                  />
                </View>
              </Animated.View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemNameTextInput: {
    paddingHorizontal: 0,
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    borderWidth: 0,
    borderColor: Theme.COLOR_GRAY_30,
    backgroundColor: "white",
    opacity: 0.5,
    justifyContent: "center",
    paddingVertical: 0,
  },
  buttonsContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    textAlign: "center",
  },
});
