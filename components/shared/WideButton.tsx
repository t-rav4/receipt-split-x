import { colours } from "@/constants/colours";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface WideButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function WideButton({
  label,
  onPress,
  disabled = false,
}: WideButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
