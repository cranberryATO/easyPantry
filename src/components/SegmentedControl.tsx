import { AppLightTheme, ThemeShadow } from "@/theme/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function SegmentedControl({
  values,
  selectedValue,
  onChange,
}: {
  values: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.container}>
      {values.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => onChange(item.value)}
          style={[
            index === 0 && styles.leftRoundedCorners,
            index === values.length - 1 && styles.rightRoundedCorners,
            index !== values.length - 1 && styles.rightBorder,
            styles.segment,
            selectedValue === item.value && styles.selectedSegment,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              selectedValue === item.value && styles.selectedSegmentText,
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: AppLightTheme.colors.border,
  },
  leftRoundedCorners: {
    borderTopLeftRadius: AppLightTheme.borderRadius.medium,
    borderBottomLeftRadius: AppLightTheme.borderRadius.medium,
  },
  rightRoundedCorners: {
    borderTopRightRadius: AppLightTheme.borderRadius.medium,
    borderBottomRightRadius: AppLightTheme.borderRadius.medium,
  },
  container: {
    flexDirection: "row",
    borderRadius: AppLightTheme.borderRadius.medium,
    backgroundColor: AppLightTheme.colors.card,
    ...ThemeShadow,
  },
  segment: {
    flex: 1,
    padding: 10,
    backgroundColor: AppLightTheme.colors.card,
  },
  segmentText: {
    textAlign: "center",
  },
  selectedSegment: {
    backgroundColor: AppLightTheme.colors.primary,
  },
  selectedSegmentText: {
    color: "white",
  },
});
