import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { CurrentInventoryRow } from "@/components/CurrentInventory";
import { useCallback } from "react";

export default function CurrentInventory() {
  const inventoryContext = useInventory();

  const handleItemCountChanged = useCallback(
    (itemId: string, itemCount: number) => {
      inventoryContext.updateItemCount(itemId, "currentCount", itemCount);
    },
    [],
  );

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView>
        {inventoryContext.inventory.sections.map((section, sectionIndex) => (
          <View key={section.id} style={sharedStyles.section}>
            <View style={sharedStyles.sectionTitleContainer}>
              <Text style={sharedStyles.sectionTitle}>
                {section.sectionName}
              </Text>
            </View>
            {section.items.map((item, itemIndex) => (
              <CurrentInventoryRow
                key={item.id}
                itemId={item.id}
                itemName={item.itemName}
                currentCount={item.currentCount}
                desiredCount={item.desiredCount}
                onChangeItemCount={handleItemCountChanged}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
