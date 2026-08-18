import { EasyCounter } from "@/components/EasyCounter";
import { useInventory } from "@/components/InventoryProvider";
import { sharedStyles } from "@/theme/styles";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingList() {
  const inventory = useInventory();

  return (
    <SafeAreaView style={sharedStyles.page}>
      <ScrollView>
        {inventory.inventory.sections.map((section, sectionIndex) => (
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
                        inventory.updateItemCount(
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
  buttonsContainer: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
};
