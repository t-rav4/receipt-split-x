import { Chip } from "@/components/shared/Chip";
import StyledText from "@/components/shared/StyledText";
import { WideButton } from "@/components/shared/WideButton";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useUserContext } from "@/context/UserContext";
import { User } from "@/types/user";
import { ReceiptItem } from "@/utils/pdf-splitting";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
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

  return (
    <View style={styles.container}>
      <StyledText style={{ color: "white" }}>{selectedUser?.name}</StyledText>
      {/* Selected Users - Toggle Select */}
      <FlatList
        horizontal
        style={{
          flexGrow: 0,
          paddingVertical: 12,
        }}
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

      {/* Receipt Items */}
      <FlatList
        style={{
          flexGrow: 0,
          width: "100%",
          paddingVertical: 12,
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
        ListEmptyComponent={<Text>No receipt items</Text>}
      />

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
    paddingVertical: 60,
    paddingHorizontal: 12,
  },
});
