import { AppLightTheme, ThemePressedStyle } from "@/theme/theme";
import { Platform, Pressable } from "react-native";

export default function CardPressable({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <Pressable
      {...props}
      android_ripple={{ color: AppLightTheme.colors.pressed }}
      style={({ pressed }) => [
        props.style ? props.style : {},
        pressed && Platform.OS === "ios" && { ThemePressedStyle },
      ]}
    >
      {children}
    </Pressable>
  );
}
