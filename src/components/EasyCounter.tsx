import * as Theme from "@/theme/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, Text, View } from "react-native";

export function EasyCounter({
  count,
  onChange,
  enabled = true,
}: {
  count: number;
  onChange: (newCount: number) => void;
  enabled?: boolean;
}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.buttonLeft, !enabled && styles.disabledButton]}
        onPress={() => {
          // Decrease count logic here
          onChange(count - 1);
        }}
        disabled={!enabled}
      >
        <Entypo name="minus" size={Theme.BUTTON_ICON_SIZE} color="black" />
      </Pressable>
      <View style={styles.buttonMiddle}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      <Pressable
        style={[styles.buttonRight, !enabled && styles.disabledButton]}
        onPress={() => {
          // Increase count logic here
          onChange(count + 1);
        }}
        disabled={!enabled}
      >
        <Entypo name="plus" size={Theme.BUTTON_ICON_SIZE} color="black" />
      </Pressable>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  countText: {
    fontSize: 24,
    lineHeight: 22,
    textAlign: "center",
  },
  buttonLeft: {
    width: 35,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: Theme.COLOR_BUTTON,
    //borderRadius: 100,
  },
  buttonMiddle: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  buttonRight: {
    width: 35,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    //borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: Theme.COLOR_BUTTON,
  },
  disabledButton: {
    backgroundColor: Theme.COLOR_GRAY_30,
  },
};
