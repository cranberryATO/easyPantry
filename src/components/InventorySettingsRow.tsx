import { EasyCounter } from "@/components/EasyCounter";
import { IconButton } from "@/components/IconButton";
import { sharedStyles } from "@/theme/styles";
import { StyleSheet, TextInput, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export function InventorySettingsRow({
  key,
  itemName,
  onChangeItemName,
  itemCount,
  onChangeItemCount,
  onMove,
  onRemove,
}: {
  key: string;
  onChangeItemName: (newName: string) => void;
  itemCount: number;
  onChangeItemCount: (newCount: number) => void;
  onMove: (direction: "up" | "down") => void;
  onRemove: () => void;
}) {
  return (
    <Animated.View
      style={sharedStyles.itemContainer}
      key={key}
      exiting={FadeOut}
      entering={FadeIn}
      layout={LinearTransition}
    >
      <TextInput
        style={styles.itemNameTextInput}
        value={itemName}
        onChangeText={onChangeItemName}
        placeholder="Nouvel article"
      />
      <View style={styles.buttonsContainer}>
        <EasyCounter count={itemCount} onChange={onChangeItemCount} />
        <IconButton
          onPress={() => {
            onMove("down");
          }}
          icon={"arrow-down-bold"}
        />
        <IconButton
          onPress={() => {
            onMove("up");
          }}
          icon={"arrow-up-bold"}
        />
        <IconButton
          onPress={() => {
            onRemove;
          }}
          icon="trash-can"
        />
      </View>
    </Animated.View>
  );
}

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
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    textAlign: "center",
  },
});
