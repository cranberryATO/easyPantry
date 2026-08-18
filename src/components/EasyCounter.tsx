import { IconButton } from "@/components/IconButton";
import { sharedStyles } from "@/theme/styles";
import * as Theme from "@/theme/theme";
import { Text } from "react-native";

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
        style={!enabled && sharedStyles.disabledButton}
        onPress={() => {
          // Decrease count logic here
          onChange(count + leftDelta);
        }}
        disabled={!enabled}
        icon={leftIcon}
      />
      <Text style={styles.countText}>
        {count}
        {total > 0 && "/" + total}
      </Text>
      <IconButton
        style={!enabled && sharedStyles.disabledButton}
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
  countText: {
    fontSize: Theme.BUTTON_FONT_SIZE,
    lineHeight: 22,
    textAlign: "center",
    alignSelf: "center",
  },
};
