import { User } from "@/types/user";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ShoppingListItemProps {
  name: string;
  price: number;
  onPress?: () => void;
  assignedUsers?: User[];
}

export function ShoppingListItem({
  name,
  price,
  onPress,
  assignedUsers,
}: ShoppingListItemProps) {
  return (
    <TouchableOpacity key={name} style={styles.container} onPress={onPress}>
      {/* Assigned Users */}
      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        {assignedUsers?.map((user) => (
          <View
            key={user.id}
            style={[styles.userAvatar, { backgroundColor: user.colour }]}
          />
        ))}
      </View>

      {/* Label */}
      <Text style={styles.label}>{name}</Text>
      <Text style={{ color: "white" }}>${price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "darkgray",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },

  userAvatar: {
    borderRadius: 100,
    width: 20,
    height: 20,
  },
});
