import { IconButton } from "@/components/IconButton";
import * as Theme from "@/theme/theme";
import { Text, View } from "react-native";

export function EasyCounter({
  count,
  onChange,
  total = -1,
  enabled = true,
  reverse = false,
}: {
  count: number;
  onChange: (newCount: number) => void;
  total?: number;
  enabled?: boolean;
  reverse?: boolean;
}) {
  const leftDelta = reverse ? 1 : -1;
  const rightDelta = reverse ? -1 : 1;
  const leftIcon = reverse ? Theme.ICON_COUNTER_PLUS : Theme.ICON_COUNTER_MINUS;
  const rightIcon = reverse
    ? Theme.ICON_COUNTER_MINUS
    : Theme.ICON_COUNTER_PLUS;

  return (
    <>
      <IconButton
        style={[styles.buttonLeft, !enabled && styles.disabledButton]}
        onPress={() => {
          // Decrease count logic here
          onChange(count + leftDelta);
        }}
        disabled={!enabled}
        icon={leftIcon}
      />
      <View style={styles.buttonMiddle}>
        <Text style={styles.countText}>
          {count}
          {total > 0 && "/" + total}
        </Text>
      </View>
      <IconButton
        style={[styles.buttonRight, !enabled && styles.disabledButton]}
        onPress={() => {
          // Increase count logic here
          onChange(count + rightDelta);
        }}
        disabled={!enabled}
        icon={rightIcon}
      />
    </>
  );
}

const styles = {
  container: {
    flexDirection: "row",
  },
  countText: {
    fontSize: Theme.BUTTON_FONT_SIZE,
    lineHeight: 22,
    textAlign: "center",
  },

  buttonLeft: {
    //width: 35,
    //borderTopLeftRadius: 100,
    //borderBottomLeftRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    //    backgroundColor: Theme.COLOR_BUTTON,
    //borderRadius: 100,
  },
  buttonMiddle: {
    //width: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  buttonRight: {
    //width: 35,
    //borderTopRightRadius: 100,
    //borderBottomRightRadius: 100,
    //borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    //backgroundColor: Theme.COLOR_BUTTON,
  },
};
