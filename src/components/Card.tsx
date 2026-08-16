import Ionicons from "@expo/vector-icons/Ionicons";
import { Theme, useTheme } from "expo-router/react-navigation";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppLightTheme, ThemePressedStyle, ThemeShadow } from "@/theme/theme";
const createCardStyles = (colors: Theme["colors"]) => {
  return StyleSheet.create({
    cardBase: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: AppLightTheme.gap.large,
      paddingHorizontal: AppLightTheme.gap.large,
      backgroundColor: colors.card,
    },
    cardNoGroup: {
      borderRadius: AppLightTheme.borderRadius.medium,
      paddingVertical: AppLightTheme.gap.small,
      ...ThemeShadow,
    },
    cardInGroup: {
      paddingVertical: 10,
    },
    cardWithMedia: {},
    cardHeader: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
      padding: 0,
    },
    cardContent: {
      fontSize: 14,
      padding: 0,
    },
    cardMedia: {
      maxWidth: 50,
      maxHeight: 50,
    },
    cardWithMediaContent: {
      flex: 1,
      flexShrink: 1,
      flexDirection: "column",
      gap: AppLightTheme.gap.tiny,
    },
    cardBody: {
      flex: 1,
      flexShrink: 1,
      flexDirection: "column",
      gap: 0,
    },
    cardGroup: {
      borderRadius: AppLightTheme.borderRadius.medium,
      backgroundColor: colors.card,
      overflow: "hidden", // clippe aux coins du groupe
      ...ThemeShadow,
    },
    cardGroupItemSeparator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    cardWithMediaGrouped: {
      flexDirection: "row",
      alignItems: "center",
      gap: AppLightTheme.gap.medium,
      paddingVertical: AppLightTheme.gap.medium,
      paddingHorizontal: AppLightTheme.gap.large,
      backgroundColor: colors.card,
    },
    cardWithMediaAction: {
      alignSelf: "flex-end",
      marginLeft: "auto",
    },
    defaultPressedStyle: {
      backgroundColor: colors.card,
    },
    cardShadow: {
      borderRadius: AppLightTheme.borderRadius.medium,
      overflow: "hidden",
      ...ThemeShadow,
    },
  });
};
function useCardStyles() {
  const { colors } = useTheme();
  return useMemo(() => createCardStyles(colors), [colors]);
}

const CardGroupContext = React.createContext<boolean>(false);

export function CardGroup({ children }: { children: React.ReactNode }) {
  const styles = useCardStyles();

  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <CardGroupContext.Provider value={true}>
      <View style={styles.cardGroup}>
        {items.map((child, index) => (
          <View
            key={index}
            style={[
              styles.cardGroupItem,
              index < items.length - 1 && styles.cardGroupItemSeparator,
            ]}
          >
            {child}
          </View>
        ))}
      </View>
    </CardGroupContext.Provider>
  );
}

function useIsGrouped() {
  return React.useContext(CardGroupContext);
}

export function Card(props) {
  const isGrouped = useIsGrouped();
  const styles = useCardStyles();
  return props.pressable ? (
    <View style={isGrouped ? {} : styles.cardShadow}>
      <CardPressable
        onPress={props.onPress}
        style={[
          styles.cardBase,
          isGrouped ? styles.cardInGroup : styles.cardNoGroup,
        ]}
      >
        {props.children}
        {props.chevron && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AppLightTheme.colors.gray_text}
          />
        )}
      </CardPressable>
    </View>
  ) : (
    <View
      style={[
        styles.cardBase,
        isGrouped ? styles.cardInGroup : styles.cardNoGroup,
      ]}
    >
      {props.children}
    </View>
  );
}

export function CardBody({ children }: { children: React.ReactNode }) {
  const styles = useCardStyles();
  return <View style={styles.cardBody}>{children}</View>;
}

export function CardMedia({ children }: { children: React.ReactNode }) {
  const styles = useCardStyles();
  return <View style={styles.cardMedia}>{children}</View>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  const styles = useCardStyles();
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardHeader}>
      {children}
    </Text>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  const styles = useCardStyles();
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardContent}>
      {children}
    </Text>
  );
}

export function CardPressable({
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
