import { AppLightTheme, ThemeShadow } from "@/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { CardContent, CardHeader, CardPressable } from "./Card";

export function CalendarPage({ dateString }: { dateString: string }) {
  const date = new Date(dateString);
  const month = date
    .toLocaleDateString("fr-FR", {
      month: "short",
    })
    .toUpperCase();
  const dayNumber = date.getDate();

  return (
    <View style={styles.container}>
      <Text style={styles.dayNumber}>{dayNumber}</Text>
      <Text style={styles.month}> {month}</Text>
    </View>
  );
}

export function CalendarCard({
  dateString,
  title,
  description,
  onPress,
}: {
  dateString: string;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.shadowContainer}>
      <CardPressable onPress={onPress} style={styles.pressableBase}>
        <View style={styles.calendarCard}>
          <View style={styles.calendarCardLeft}>
            <CalendarPage dateString={dateString} />
          </View>
          <View style={styles.calendarCardRight}>
            <CardHeader>{title}</CardHeader>
            <CardContent>{description}</CardContent>
          </View>
          <View style={styles.calendarCardIcon}>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={AppLightTheme.colors.gray_text}
            />
          </View>
        </View>
      </CardPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: AppLightTheme.borderRadius.medium,
    overflow: "hidden",
    ...ThemeShadow,
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "bold",
    color: AppLightTheme.colors.text,
  },
  month: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "bold",
    color: AppLightTheme.colors.gray_text,
  },
  calendarCard: {
    flexDirection: "row",
    padding: 0,
    height: 80,
    borderRadius: AppLightTheme.borderRadius.medium,
  },
  calendarCardLeft: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: AppLightTheme.colors.border,
  },
  calendarCardRight: {
    justifyContent: "center",
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    padding: AppLightTheme.gap.medium,
  },
  calendarCardIcon: {
    width: 40,
    height: "100%",
    flexShrink: 0,

    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: AppLightTheme.gap.medium,
  },
  pressableBase: {
    overflow: "hidden",
    backgroundColor: AppLightTheme.colors.card,
    borderRadius: AppLightTheme.borderRadius.medium,
  },
});
