import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ChipProps {
  label: string;
  backgroundColour: string;
  onPress: () => void;
}

export function Chip({ label, backgroundColour: colour, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, { backgroundColor: colour }]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
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
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
