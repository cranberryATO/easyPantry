import { Image } from "expo-image";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
} from "react-native";

type GoogleSignInButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
} & Pick<PressableProps, "testID">;

const LABEL = "Se connecter avec Google";

export function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
  label = LABEL,
  testID,
}: GoogleSignInButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: "rgba(0, 0, 0, 0.08)" }}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color="#1f1f1f" />
        ) : (
          <Image
            source={require("@/assets/google/google.png")}
            style={styles.icon}
            contentFit="contain"
            accessibilityIgnoresInvertColors
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    minWidth: 183,
    maxWidth: 400,
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#747775",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pressed: {
    backgroundColor: "#F7F8F8",
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#1F1F1F",
    letterSpacing: 0.1,
  },
});
