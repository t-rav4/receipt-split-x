import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TileButtonProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}

export const TileButton = ({ label, icon, onPress }: TileButtonProps) => {
  return (
    <View style={{ gap: 8, alignItems: "center" }}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Ionicons name={icon} size={64} color="black" />
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: 300,
    height: 200,
    backgroundColor: "skyblue",
  },

  label: {
    fontSize: 16,
    color: "white",
  },
});
