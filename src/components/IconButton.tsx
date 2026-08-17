import * as Theme from "@/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, View } from "react-native";

export function IconButton({
  icon,
  style,
  onPress,
  disabled,
}: {
  icon: string;
  style: any;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[style]}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: Theme.COLOR_GRAY_30 }}
        onMouseDown={(e: any) => e.preventDefault()}
      >
        <MaterialCommunityIcons
          name={icon}
          size={Theme.ICON_BUTTON_SIZE}
          color={Theme.ICON_BUTTON_COLOR}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 1000,
    overflow: "hidden",
  },
});
