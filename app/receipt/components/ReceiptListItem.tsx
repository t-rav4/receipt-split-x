import StyledText from "@/components/shared/StyledText";
import { User } from "@/types/user";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ReceiptListItemProps {
  name: string;
  price: number;
  onPress?: () => void;
  assignedUsers?: User[];
  showEditActions?: boolean;
}

export function ReceiptListItem({
  name,
  price,
  onPress,
  assignedUsers,
  showEditActions = false,
}: ReceiptListItemProps) {
  return (
    <TouchableOpacity key={name} style={styles.container} onPress={onPress}>
      <View style={{ flex: 1 }}>
        {/* Label */}
        <View style={styles.labelContainer}>
          <StyledText style={styles.label}>{name}</StyledText>
          <StyledText style={{ color: "white" }}>
            ${price.toFixed(2)}
          </StyledText>
        </View>

        {/* Assigned Users */}
        {assignedUsers && assignedUsers?.length > 0 && (
          <View style={{ paddingTop: 8, flexDirection: "row", gap: 4 }}>
            {assignedUsers?.map((user) => (
              <View
                key={user.id}
                style={[styles.userAvatar, { backgroundColor: user.colour }]}
              />
            ))}
          </View>
        )}
      </View>

      {showEditActions && (
        <View
          style={{
            gap: 10,
            flexDirection: "row",
          }}
        >
          {/* TODO: determine best how to implement the edit & remove here */}
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="pencil-outline" color="white" size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="trash" color="salmon" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  labelContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 8,
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
