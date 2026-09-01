import * as Theme from "@/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
export function IconButton({
  icon,
  style = {},
  onPress = () => {},
  onPressIn = () => {},
  disabled,
  size = Theme.ICON_BUTTON_SIZE,
}: {
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  style?: any;
  onPress?: () => void;
  onPressIn?: () => void;
  disabled?: boolean;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.container,
        {
          alignSelf: "center",
          width: size,
          height: size,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Pressable
        style={[
          style,
          {
            alignSelf: "center",
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        disabled={disabled}
        android_ripple={{ color: Theme.COLOR_GRAY_30 }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={size}
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
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
