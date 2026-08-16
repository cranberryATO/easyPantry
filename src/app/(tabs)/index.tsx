import { EasyCounter } from "@/components/EasyCounter";
import * as Theme from "@/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const INVENTORY_KEY = "inventory";

export type InventorySection = {
  sectionName: string;
  sectionOrder: number;
  items: InventoryItem[];
};

export type InventoryItem = {
  itemName: string;
  desiredCount: number;
  currentCount: number;
  orderInSection: number;
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
      items: [
        {
          itemName: "Papier Toilette (pack de 12)",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 1,
        },
        {
          itemName: "Sopalin (pack de 4)",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
        },
        {
          itemName: "Mayonnaise",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
        },
        {
          itemName: "Moutarde",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
        },
      ],
    },
    {
      sectionName: "❄️Congélateur",
      sectionOrder: 2,
      items: [
        {
          itemName: "Pizza",
          desiredCount: 5,
          currentCount: 0,
          orderInSection: 1,
        },
        {
          itemName: "Glace vanille",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
        },
        {
          itemName: "Poulet",
          desiredCount: 3,
          currentCount: 0,
          orderInSection: 3,
        },
        {
          itemName: "Viande hachée",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 4,
        },
        {
          itemName: "Frites",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 5,
        },
      ],
    },
    {
      sectionName: "🍅Réfrigérateur",
      sectionOrder: 3,
      items: [
        {
          itemName: "Salade",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
        },
        {
          itemName: "Tomates",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 2,
        },
        {
          itemName: "Yaourts",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
        },
      ],
    },
    {
      sectionName: "🥖Placards",
      sectionOrder: 4,
      items: [
        {
          itemName: "Chips",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 1,
        },
        {
          itemName: "Pâtes",
          desiredCount: 2,
          currentCount: 0,
          orderInSection: 2,
        },
        {
          itemName: "Riz",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 3,
        },
        {
          itemName: "Farine",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 4,
        },
        {
          itemName: "Sucre",
          desiredCount: 1,
          currentCount: 0,
          orderInSection: 5,
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

export default function Inventory() {
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
        await saveInventory(DEFAULT_INVENTORY);
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
      setEditingItem({
        isEditing: true,
        sectionIndex: newSectionIndex,
        itemIndex: newItemIndex,
      });
      console.log(
        `Moved item from section ${sectionIndex}, item ${itemIndex} to section ${newSectionIndex}, item ${newItemIndex}`,
      );
      return newInventory;
    });
  }

  return (
    <View style={styles.page}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerLabel}>Objectif</Text>
        <Text style={styles.headerLabel}>Actuel</Text>
      </View>
      <ScrollView>
        {inventory.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.sectionName}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                {/* When editing, show a TextInput instead of the Text
                  component and show a delete button and a "move" handle*/}
                {editingItem.isEditing &&
                editingItem.sectionIndex === sectionIndex &&
                editingItem.itemIndex === itemIndex ? (
                  <View
                    style={styles.itemContainer}
                    onBlur={() => {
                      renameItem(sectionIndex, itemIndex, editingText);
                      setEditingItem({
                        isEditing: false,
                        sectionIndex: 0,
                        itemIndex: 0,
                      });
                    }}
                  >
                    <View style={styles.editingSideContainer}>
                      <Pressable
                        style={styles.editingLeftButton}
                        onMouseDown={(e: any) => e.preventDefault()}
                        onPress={() => {
                          handleMoveItem(sectionIndex, itemIndex, "down");
                        }}
                      >
                        <MaterialCommunityIcons
                          name="arrow-down-bold-outline"
                          size={Theme.BUTTON_ICON_SIZE}
                          color="black"
                        />
                      </Pressable>
                      <Pressable
                        style={styles.editingRightButton}
                        onMouseDown={(e: any) => e.preventDefault()}
                        onPress={() => {
                          handleMoveItem(sectionIndex, itemIndex, "up");
                        }}
                      >
                        <MaterialCommunityIcons
                          name="arrow-up-bold-outline"
                          size={Theme.BUTTON_ICON_SIZE}
                          color="black"
                        />
                      </Pressable>
                    </View>
                    <View style={styles.editingMiddleContainer}>
                      <TextInput
                        style={styles.itemNameTextInput}
                        value={editingText}
                        onChangeText={setEditingText}
                      />
                    </View>
                    <View style={styles.editingSideContainer}>
                      <Pressable
                        style={styles.editingLeftButton}
                        onMouseDown={(e: any) => e.preventDefault()}
                        onPress={() => {
                          renameItem(sectionIndex, itemIndex, editingText);
                          setEditingItem({
                            isEditing: false,
                            sectionIndex: 0,
                            itemIndex: 0,
                          });
                        }}
                      >
                        <MaterialCommunityIcons
                          name="check"
                          size={Theme.BUTTON_ICON_SIZE}
                          color="black"
                        />
                      </Pressable>
                      <Pressable
                        style={styles.editingRightButton}
                        onMouseDown={(e: any) => e.preventDefault()}
                        onPress={() => {
                          handleRemoveItem(sectionIndex, itemIndex);
                        }}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={Theme.BUTTON_ICON_SIZE}
                          color="black"
                        />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={styles.itemContainer}>
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

                    <Pressable
                      style={styles.itemName}
                      onLongPress={() => {
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
                      <Text style={styles.itemNameText} numberOfLines={1}>
                        {item.itemName}
                      </Text>
                    </Pressable>
                    <EasyCounter
                      count={item.currentCount}
                      onChange={(newCount) =>
                        updateItemCount(
                          sectionIndex,
                          itemIndex,
                          "currentCount",
                          newCount,
                        )
                      }
                      enabled={
                        !editingItem.isEditing /* if isEditingis true then it is editing another item */
                      }
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = {
  page: {
    flex: 1,
    backgroundColor: Theme.COLOR_BACKGROUND,
    padding: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLabel: {
    borderRadius: 100,
    backgroundColor: Theme.COLOR_BUTTON,
    padding: 10,
    width: 110,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  header: {
    fontSize: 15,
  },
  item: {},
  itemName: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemNameText: {
    fontSize: 16,
    textAlign: "center",
  },
  itemNameTextInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    textAlign: "center",
    borderWidth: 1,
    borderColor: Theme.COLOR_GRAY_30,
    borderRadius: 50,
    backgroundColor: Theme.COLOR_GRAY_10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    padding: 2,
    backgroundColor: "white",
    borderRadius: 100,
    height: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: Theme.COLOR_GRAY_50,
    marginBottom: 2,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 4,
    margin: 0,
    textAlign: "center",
  },
  editingSideContainer: {
    flexDirection: "row",
    width: 110,
    justifyContent: "space-between",
  },
  editingMiddleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  editingLeftButton: {
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.COLOR_BUTTON,
    borderRadius: 100,
  },
  editingRightButton: {
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: Theme.COLOR_BUTTON,
  },
};
