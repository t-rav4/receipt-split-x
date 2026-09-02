import { Chip } from "@/components/shared/Chip";
import StyledText from "@/components/shared/StyledText";
import { WideButton } from "@/components/shared/WideButton";
import { colours } from "@/constants/colours";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/types/user";
import { ReceiptItem } from "@/utils/pdf-splitting";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ReceiptListItem } from "./components/ReceiptListItem";

export default function AssignItemsScreen() {
  const { push } = useRouter();

  const { users } = useUserContext();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { selectedFile, receiptItems, assignUserToItem, extractItemsFromPdf } =
    useReceiptContext();

  useEffect(() => {
    if (selectedFile) {
      extractItemsFromPdf(selectedFile);
    }
  }, [selectedFile, extractItemsFromPdf]);

  function toggleUserSelect(userId: string) {
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
      return;
    }
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
  }

  function handleOnItemPress(item: ReceiptItem) {
    if (!selectedUser) {
      return;
    }
    assignUserToItem(selectedUser, item);
  }

  // TODO: if a receipt item was incorrectly extracted (bad price etc), allow user to view raw extracted text
  // and tweak the price if needed

  // TODO: if you want to remove or add a new user to the splitting, allow user to go back
  // to the SelectUsersScreen without losing the extracted receipt items

  const totalPrice = receiptItems
    .reduce((acc, item) => acc + item.finalPrice, 0)
    .toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StyledText>Select a user to assign items to.</StyledText>
        <TouchableOpacity
          style={{
            borderRadius: 40,
            borderWidth: 2,
            borderColor: colours.primary,
            padding: 4,
          }}
          onPress={() => push("/receipt/DebugRawReceiptScreen")}
        >
          <Ionicons name="help" color={colours.primary} size={15} />
        </TouchableOpacity>
      </View>

      {/* Selected Users - Toggle Select */}
      <View style={styles.userChipsContainer}>
        <FlatList
          horizontal
          contentContainerStyle={{
            justifyContent: "space-evenly",
          }}
          data={users}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <Chip
              label={item.name}
              backgroundColour={item.colour}
              onPress={() => toggleUserSelect(item.id)}
            />
          )}
        />
      </View>

      {/* Receipt Items */}
      <FlatList
        showsVerticalScrollIndicator
        style={{
          flex: 1,
          width: "100%",
        }}
        contentContainerStyle={{ gap: 8 }}
        data={receiptItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <ReceiptListItem
            name={item.name}
            price={item.finalPrice}
            onPress={() => handleOnItemPress(item)}
            assignedUsers={item.assignedUsers}
          />
        )}
        ListEmptyComponent={<StyledText>No receipt items</StyledText>}
      />

      <View style={{ paddingVertical: 40 }}>
        <StyledText>Total Price: ${totalPrice}</StyledText>
      </View>

      <View style={{ marginTop: "auto" }}>
        <WideButton
          label="Next: Review & Split"
          onPress={() => push("/receipt/SummaryScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 40, // TODO: fix up safe area view to avoid having to manually add paddingBottom
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userChipsContainer: {
    paddingTop: 10,
    paddingBottom: 15,
  },
});
