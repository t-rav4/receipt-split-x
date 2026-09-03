import { Chip } from "@/components/shared/Chip";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
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

function HelpButton() {
  const { push } = useRouter();
  return (
    <TouchableOpacity
      style={{
        borderRadius: 40,
        borderWidth: 2,
        borderColor: colours.primary,
        padding: 4,
        alignItems: "center",
      }}
      onPress={() => push("/receipt/DebugRawReceiptScreen")}
    >
      <Ionicons name="help" color={colours.primary} size={15} />
    </TouchableOpacity>
  );
}

// TODO: a button that groups the items by assigned user?
// TODO: filter by user?

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

  // TODO: if you want to remove or add a new user to the splitting, allow user to go back
  // to the SelectUsersScreen without losing the extracted receipt items

  // TODO: discounts could allow for negative costs - to be divided amongst splitees

  const totalPrice = receiptItems
    .reduce((acc, item) => acc + item.finalPrice, 0)
    .toFixed(2);

  const costsByUser = receiptItems.reduce<Record<string, number>>(
    (costs, item) => {
      const usersToCharge =
        item.assignedUsers?.length > 0 ? item.assignedUsers : users;

      const costPerUser = item.finalPrice / usersToCharge.length;

      for (const user of usersToCharge) {
        costs[user.id] = (costs[user.id] ?? 0) + costPerUser;
      }

      return costs;
    },
    {},
  );

  return (
    <ScreenLayout
      title="Split Items"
      showBackButton
      rightComponent={<HelpButton />}
    >
      <View style={styles.header}>
        <StyledText>Select a user to assign items to.</StyledText>
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
          renderItem={({ item }) => {
            // TODO: improve the 'is selected' styling here
            const computedStyle = {
              opacity: selectedUser?.id === item.id ? 1 : 0.45,
            };
            return (
              <Chip
                label={item.name}
                backgroundColour={item.colour}
                onPress={() => toggleUserSelect(item.id)}
                style={computedStyle}
              />
            );
          }}
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
        keyExtractor={(item, index) => `${item.name}-${index}`}
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

      {users.map((user, _) => (
        <View
          key={user.id}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <StyledText>{user.name}</StyledText>
          <StyledText>$ {(costsByUser[user.id] ?? 0).toFixed(2)}</StyledText>
        </View>
      ))}

      <View style={{ marginTop: "auto" }}>
        <WideButton
          label="Next: Review & Split"
          onPress={() => push("/receipt/SummaryScreen")}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
