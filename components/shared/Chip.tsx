import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import StyledText from "./StyledText";

interface ChipProps {
  label: string;
  backgroundColour: string;
  onPress: () => void;
  style?: ViewStyle;
}

export function Chip({
  label,
  backgroundColour: colour,
  onPress,
  style,
}: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: colour }, style]}
      onPress={onPress}
    >
      <StyledText style={styles.label}>{label}</StyledText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    margin: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
