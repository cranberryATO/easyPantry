import { AppLightTheme } from "@/theme/theme";
import { Theme, useTheme } from "expo-router/react-navigation";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const COLOR_GRAY_90 = "#1a1a1a";
const COLOR_GRAY_80 = "#333333";
const COLOR_GRAY_70 = "#4d4d4d";
const COLOR_GRAY_60 = "#666666";
const COLOR_GRAY_50 = "#808080";
const COLOR_GRAY_40 = "#999999";
const COLOR_GRAY_30 = "#b3b3b3";
const COLOR_GRAY_20 = "#cccccc";
const COLOR_GRAY_10 = "#e5e5e5";

const createPageStyles = (colors: Theme["colors"]) => {
  return StyleSheet.create({
    page: {
      flexDirection: "column",
      gap: 12,
      padding: AppLightTheme.gap.medium,
    },
    section: {
      flexDirection: "column",
      gap: 6,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: COLOR_GRAY_50,
      marginBottom: 2,
      paddingHorizontal: 4,
      paddingTop: 10,
      margin: 0,
    },
  });
};

function usePageStyles() {
  const { colors } = useTheme();
  return useMemo(() => createPageStyles(colors), [colors]);
}
export function Page({ children }: { children: React.ReactNode }) {
  const styles = usePageStyles();
  return <View style={styles.page}>{children}</View>;
}

export function Section({ children }: { children: React.ReactNode }) {
  const styles = usePageStyles();
  return <View style={styles.section}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const styles = usePageStyles();
  return <Text style={styles.sectionTitle}>{children}</Text>;
}
