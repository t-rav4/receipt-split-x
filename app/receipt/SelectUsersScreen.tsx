import { WideButton } from "@/components/shared/WideButton";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/types/user";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function EmptyListComponent() {
  return (
    <View style={styles.emptyListContainer}>
      <Text style={{ color: "gray", fontSize: 16 }}>No users added yet.</Text>
    </View>
  );
}

export default function SelectUsersScreen() {
  const { push } = useRouter();

  const { users, setUsers, deleteUser } = useUserContext();
  const [inputUser, setInputUser] = useState<string | undefined>();
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  const handleAddUser = () => {
    if (!inputUser || inputUser?.trim() === "") {
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: inputUser.trim(),
      colour: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };

    setUsers((prev: User[]) => [...prev, newUser]);
    setInputUser("");
  };

  const toggleUserSelect = (userId: string) => {
    if (selectedUserIds.has(userId)) {
      const newSet = new Set(selectedUserIds);
      newSet.delete(userId);
      setSelectedUserIds(newSet);
    } else {
      setSelectedUserIds((prev) => new Set(prev).add(userId));
    }
  };

  const removeUser = (userId: string) => {
    const newSet = new Set(selectedUserIds);
    newSet.delete(userId);
    setSelectedUserIds(newSet);

    deleteUser(userId); // Remove from context
  };

  const renderItem = (user: User) => {
    const isSelected = selectedUserIds.has(user.id);
    const backgroundColor = isSelected ? "skyblue" : "transparent";
    const textColour = isSelected ? "black" : "white";

    return (
      <TouchableOpacity
        style={[styles.userListItem, { backgroundColor }]}
        onPress={() => toggleUserSelect(user.id)}
      >
        <Text key={user.id} style={{ color: textColour, fontSize: 16 }}>
          {user.name}
        </Text>
        <Ionicons
          name="trash"
          color="white"
          size={18}
          onPress={() => removeUser(user.id)}
        />
      </TouchableOpacity>
    );
  };

  // TODO: user colour should be displayed on the user list item.
  // TODO: should be able to pick the colour for new user

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Splitees</Text>

      <View style={styles.addUserInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter user name"
          onChangeText={(text) => setInputUser(text)}
          value={inputUser}
        />
        <Ionicons name="add" size={24} color="white" onPress={handleAddUser} />
      </View>

      {/* Users List */}
      <FlatList
        contentContainerStyle={{ gap: 4 }}
        data={users}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={<EmptyListComponent />}
      />

      <View style={{ marginTop: "auto" }}>
        <WideButton
          label="Next: Assign Items"
          onPress={() => {
            push("/receipt/AssignItemsScreen");
          }}
          disabled={selectedUserIds.size < 1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 45,
    paddingHorizontal: 12,
    gap: 10,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    paddingVertical: 10,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  addUserInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    paddingLeft: 10,
    color: "white",
  },
  userListItem: {
    borderRadius: 4,
    padding: 12,
    borderBottomColor: "gray",
    borderBottomWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
});
