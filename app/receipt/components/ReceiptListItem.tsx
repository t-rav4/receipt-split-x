import StyledText from "@/components/shared/StyledText";
import { User } from "@/types/user";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ReceiptListItemProps {
  name: string;
  price: number;
  onPress?: () => void;
  assignedUsers?: User[];
}

export function ReceiptListItem({
  name,
  price,
  onPress,
  assignedUsers,
}: ReceiptListItemProps) {
  return (
    <TouchableOpacity key={name} style={styles.container} onPress={onPress}>
      {/* Assigned Users */}
      {assignedUsers && assignedUsers?.length > 0 && (
        <View style={{ flexDirection: "row", gap: 4 }}>
          {assignedUsers?.map((user) => (
            <View
              key={user.id}
              style={[styles.userAvatar, { backgroundColor: user.colour }]}
            />
          ))}
        </View>
      )}

      {/* Label */}
      <StyledText style={styles.label}>{name}</StyledText>
      <StyledText style={{ color: "white" }}>${price.toFixed(2)}</StyledText>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
  },

  userAvatar: {
    borderRadius: 100,
    width: 20,
    height: 20,
  },
});
