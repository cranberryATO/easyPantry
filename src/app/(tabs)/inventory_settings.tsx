import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
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

const INVENTORY_KEY = "inventory";

export type InventorySection = {
  sectionName: string;
  sectionOrder: number;
  items: InventoryItem[];
  id: string;
};

export type InventoryItem = {
  itemName: string;
  desiredCount: number;
  currentCount: number;
  orderInSection: number;
  id: string;
};

export type Inventory = {
  hasSeeded: boolean;
  sections: InventorySection[];
};

const DEFAULT_INVENTORY: Inventory = {
  hasSeeded: true,
  sections: [
    {
      sectionName: "🛖Réserve",
      sectionOrder: 1,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "🚽Papier Toilette (pack de 12)",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "⬜Sopalin (pack de 4)",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Mayonnaise",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Moutarde",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "❄️Congélateur",
      sectionOrder: 2,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Pizza",
          desiredCount: 5,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Glace vanille",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Poulet",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Viande hachée",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Frites",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 5,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "🍅Réfrigérateur",
      sectionOrder: 3,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Salade",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Tomates",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Yaourts",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
      ],
    },
    {
      sectionName: "🥖Placards",
      sectionOrder: 4,
      id: Crypto.randomUUID(),
      items: [
        {
          itemName: "Chips",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Pâtes",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Riz",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Farine",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
          id: Crypto.randomUUID(),
        },
        {
          itemName: "Sucre",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 5,
          id: Crypto.randomUUID(),
        },
      ],
    },
  ],
};

export async function loadInventory(): Promise<Inventory> {
  const raw = await AsyncStorage.getItem(INVENTORY_KEY);
  return raw ? JSON.parse(raw) : { hasSeeded: false, sections: [] };
}

export async function saveInventory(items: Inventory): Promise<void> {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

export default function InventorySettings() {
  const [inventory, setInventory] = useState<Inventory>({
    hasSeeded: false,
    sections: [],
  });

  const [editingText, setEditingText] = useState<string>("");
  const [editingItem, setEditingItem] = useState<{
    isEditing: boolean;
    sectionIndex: number;
    itemIndex: number;
  }>({ isEditing: false, sectionIndex: 0, itemIndex: 0 });

  // Load inventory from AsyncStorage on component mount
  useEffect(() => {
    (async () => {
      const stored = await loadInventory();
      console.log("Loaded inventory:", stored);
      if (!stored.hasSeeded) {
        setInventory(DEFAULT_INVENTORY);
      } else {
        setInventory(stored);
      }
    })();
  }, []);

  // Save inventory to AsyncStorage whenever it changes
  useEffect(() => {
    (async () => {
      await saveInventory(inventory);
    })();
  }, [inventory]);

  // Create new inventory with updated value and set inventory
  function updateItemCount(
    sectionIndex: number,
    itemIndex: number,
    field: "desiredCount" | "currentCount",
    newCount: number,
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      console.log(
        `Updating ${field} for item at section ${sectionIndex}, item ${itemIndex} to ${newCount}`,
      );
      newInventory.sections[sectionIndex].items[itemIndex][field] = Math.max(
        0,
        newCount,
      );
      return newInventory;
    });
  }

  function renameItem(
    sectionIndex: number,
    itemIndex: number,
    newName: string,
  ) {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      newInventory.sections[sectionIndex].items[itemIndex].itemName = trimmed;
      return newInventory;
    });
  }

  function handleRemoveItem(sectionIndex: number, itemIndex: number) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      newInventory.sections[sectionIndex].items.splice(itemIndex, 1);
      console.log(`Removed item at section ${sectionIndex}, item ${itemIndex}`);
      setEditingItem({ isEditing: false, sectionIndex: 0, itemIndex: 0 });
      return newInventory;
    });
  }

  function handleMoveItem(
    sectionIndex: number,
    itemIndex: number,
    direction: "up" | "down",
  ) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      const items = newInventory.sections[sectionIndex].items;
      let newItemIndex = itemIndex;
      let newSectionIndex = sectionIndex;
      if (direction === "up") {
        if (itemIndex > 0) {
          [items[itemIndex - 1], items[itemIndex]] = [
            items[itemIndex],
            items[itemIndex - 1],
          ];
          newItemIndex = itemIndex - 1;
        } else {
          // moving item to previous section if it exists
          if (sectionIndex > 0) {
            const prevSectionItems =
              newInventory.sections[sectionIndex - 1].items;
            const itemToMove = items[itemIndex];
            // Remove from current section
            items.splice(itemIndex, 1);
            // Add to previous section at the end
            newItemIndex = prevSectionItems.length;
            prevSectionItems.push(itemToMove);
            newSectionIndex = sectionIndex - 1;
          }
        }
      } else if (direction === "down") {
        if (itemIndex < items.length - 1) {
          [items[itemIndex + 1], items[itemIndex]] = [
            items[itemIndex],
            items[itemIndex + 1],
          ];
          newItemIndex = itemIndex + 1;
        } else {
          // moving item to next section if it exists
          if (sectionIndex < newInventory.sections.length - 1) {
            const nextSectionItems =
              newInventory.sections[sectionIndex + 1].items;
            const itemToMove = items[itemIndex];
            // Remove from current section
            items.splice(itemIndex, 1);
            // Add to next section at the beginning
            nextSectionItems.unshift(itemToMove);
            newSectionIndex = sectionIndex + 1;
            newItemIndex = 0;
          }
        }
      }
      console.log(
        `Moved item from section ${sectionIndex}, item ${itemIndex} to section ${newSectionIndex}, item ${newItemIndex}`,
      );
      return newInventory;
    });
  }

  function handleAddNewItemToSection(sectionIndex: number) {
    setInventory((prev) => {
      const newInventory = structuredClone(prev);
      newInventory.sections[sectionIndex].items.unshift({
        itemName: "",
        id: Crypto.randomUUID(),
        desiredCount: 0,
        currentCount: 0,
        orderInSection: 0,
      });
      setEditingText("");
      setEditingItem({
        isEditing: true,
        sectionIndex: sectionIndex,
        itemIndex: 0,
      });
      return newInventory;
    });
  }

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView>
        {inventory.sections.map((section, sectionIndex) => (
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
                      renameItem(sectionIndex, itemIndex, editingText);
                      setEditingItem({
                        isEditing: false,
                        sectionIndex: 0,
                        itemIndex: 0,
                      });
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
                      updateItemCount(
                        sectionIndex,
                        itemIndex,
                        "desiredCount",
                        newCount,
                      )
                    }
                  />
                  <IconButton
                    style={styles.editingLeftButton}
                    onPress={() => {
                      handleMoveItem(sectionIndex, itemIndex, "down");
                    }}
                    icon={"arrow-down-bold"}
                  />
                  <IconButton
                    style={styles.editingRightButton}
                    onPress={() => {
                      handleMoveItem(sectionIndex, itemIndex, "up");
                    }}
                    icon={"arrow-up-bold"}
                  />
                  <IconButton
                    style={styles.editingRightButton}
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
    paddingHorizontal: 10,
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    borderWidth: 0,
    borderColor: Theme.COLOR_GRAY_30,
    backgroundColor: Theme.COLOR_BACKGROUND,
    opacity: 0.5,
    justifyContent: "center",
    paddingVertical: 0,
  },
  editingMiddleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  editingLeftButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  editingRightButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
