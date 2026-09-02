import { ColourPickerModal } from "@/components/colour-picker/ColourPickerModal";
import StyledText from "@/components/shared/StyledText";
import { WideButton } from "@/components/shared/WideButton";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/types/user";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function EmptyListComponent() {
  return (
    <View style={styles.emptyListContainer}>
      <StyledText style={{ color: "gray", fontSize: 14, textAlign: "center" }}>
        You haven't added any users yet. Add a user to get started!
      </StyledText>
    </View>
  );
}

export default function SelectUsersScreen() {
  const { push } = useRouter();

  const { users, createUser, deleteUser, updateUser } = useUserContext();
  const [usernameInput, setUsernameInput] = useState<string | undefined>();
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  const [colourModalVisible, setColourModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = () => {
    if (!usernameInput || usernameInput?.trim() === "") {
      return;
    }

    const newUser = createUser(usernameInput.trim());
    setUsernameInput("");
    toggleUserSelect(newUser.id);
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
    if (selectedUserIds.has(userId)) {
      const newSet = new Set(selectedUserIds);
      newSet.delete(userId);
      setSelectedUserIds(newSet);
    }
    deleteUser(userId);
  };

  const handleOpenColourPicker = (user: User) => {
    setSelectedUser(user);
    setColourModalVisible(true);
  };

  const handleSelectColour = async (colour: string) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, { colour });
    }
    setColourModalVisible(false);
  };

  const renderItem = (user: User) => {
    const isSelected = selectedUserIds.has(user.id);
    const backgroundColor = isSelected ? "skyblue" : "transparent";
    const textColour = isSelected ? "black" : "white";
    const colourIndicatorBorder = isSelected ? "black" : "transparent";

    return (
      <TouchableOpacity
        style={[styles.userListItemContainer, { backgroundColor }]}
        onPress={() => toggleUserSelect(user.id)}
      >
        <View style={styles.userListItemLabel}>
          <TouchableOpacity
            style={[
              styles.userColourIndicator,
              {
                borderWidth: 1,
                borderColor: colourIndicatorBorder,
                backgroundColor: user.colour,
              },
            ]}
            onPress={() => handleOpenColourPicker(user)}
          />
          <StyledText
            key={user.id}
            style={{
              fontSize: 16,
              color: textColour,
              fontWeight: isSelected ? "bold" : "normal",
            }}
          >
            {user.name}
          </StyledText>
        </View>

        <Ionicons
          name="trash"
          color="white"
          size={18}
          onPress={() => removeUser(user.id)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>Add Splitees</StyledText>
      <StyledText style={{ color: "white", fontSize: 14 }}>
        Select which users you wish to split your receipt with.
      </StyledText>
      <StyledText style={{ color: "grey", fontStyle: "italic" }}>
        (Please select at least 2 users to continue)
      </StyledText>

      <View style={styles.addUserInputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Add a user here..."
          onChangeText={(text) => setUsernameInput(text)}
          value={usernameInput}
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

      <View style={{ marginTop: "auto", paddingTop: 15 }}>
        <WideButton
          label="Split!"
          onPress={() => push("/receipt/AssignItemsScreen")}
          disabled={selectedUserIds.size < 2}
        />
      </View>

      <ColourPickerModal
        visible={colourModalVisible}
        currentColour={selectedUser?.colour}
        onSelect={handleSelectColour}
        onClose={() => setColourModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 45,
    paddingHorizontal: 18,
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
    marginTop: "60%",
    paddingHorizontal: 12,
  },
  addUserInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 18,
    paddingBottom: 10,
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
  userListItemContainer: {
    borderRadius: 4,
    padding: 12,
    borderBottomColor: "gray",
    borderBottomWidth: 0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userListItemLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  userColourIndicator: {
    borderRadius: 100,
    width: 25,
    height: 25,
  },
});
