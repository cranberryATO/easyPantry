import { EasyCounter } from "@/components/EasyCounter";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
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

export default function Inventory() {
  const [inventory, setInventory] = useState<Inventory>({
    hasSeeded: false,
    sections: [],
  });

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

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView>
        {inventory.sections.map((section, sectionIndex) => (
          <View key={section.id} style={sharedStyles.section}>
            <View style={sharedStyles.sectionTitleContainer}>
              <Text style={sharedStyles.sectionTitle}>
                {section.sectionName}
              </Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <View key={item.id}>
                <View style={sharedStyles.itemContainer}>
                  <Text style={sharedStyles.itemNameText} numberOfLines={1}>
                    {item.itemName}
                  </Text>
                  <View style={styles.buttonsContainer}>
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
                      total={item.desiredCount}
                      reverse={true}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginVertical: 1,
    padding: 2,
    //backgroundColor: "white",
    //borderRadius: 100,
    height: 40,
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
  buttonsContainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};
