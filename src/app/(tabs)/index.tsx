import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { CurrentInventorySection } from "@/components/CurrentInventory";
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
          <CurrentInventorySection
            key={section.id}
            sectionId={section.id}
            sectionName={section.sectionName}
            items={section.items}
            onChangeItemCount={handleItemCountChanged}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
