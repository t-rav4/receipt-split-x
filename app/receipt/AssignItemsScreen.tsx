import { Chip } from "@/components/shared/Chip";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
import StyledText from "@/components/shared/StyledText";
import { WideButton } from "@/components/shared/WideButton";
import { colours } from "@/constants/colours";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useUserContext } from "@/context/UserContext";
import { ReceiptItem } from "@/utils/pdf-splitting";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
  const { spliteeIds, receiptItems, assignUserToItem } = useReceiptContext();

  const splitees = users.filter((user) => spliteeIds.has(user.id));

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  function toggleUserSelect(userId: string) {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
      return;
    }
    setSelectedUserId(userId);
  }

  function handleOnItemPress(item: ReceiptItem) {
    if (!selectedUserId) {
      return;
    }
    assignUserToItem(selectedUserId, item);
  }

  // TODO: discounts could allow for negative costs - to be divided amongst splitees

  const totalPrice = receiptItems
    .reduce((acc, item) => acc + item.finalPrice, 0)
    .toFixed(2);

  const costsByUser = receiptItems.reduce<Record<string, number>>(
    (costs, item) => {
      const usersToCharge =
        item.assignedUserIds.size > 0 ? item.assignedUserIds : spliteeIds;

      const costPerUser = item.finalPrice / usersToCharge.size;

      for (const userId of usersToCharge) {
        costs[userId] = (costs[userId] ?? 0) + costPerUser;
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
          data={splitees}
          horizontal
          contentContainerStyle={{
            justifyContent: "space-evenly",
          }}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => {
            // TODO: improve the 'is selected' styling here
            const computedStyle = {
              opacity: selectedUserId === item.id ? 1 : 0.45,
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
        renderItem={({ item }) => {
          const assignedUsers = users.filter((u) =>
            item.assignedUserIds.has(u.id),
          );

          return (
            <ReceiptListItem
              name={item.name}
              price={item.finalPrice}
              onPress={() => handleOnItemPress(item)}
              assignedUsers={assignedUsers}
            />
          );
        }}
        ListEmptyComponent={<StyledText>No receipt items</StyledText>}
      />

      <View style={{ paddingVertical: 40 }}>
        <StyledText>Total Price: ${totalPrice}</StyledText>
      </View>

      {splitees.map((splitee, _) => (
        <View
          key={splitee.id}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <StyledText>{splitee.name}</StyledText>
          <StyledText>$ {(costsByUser[splitee.id] ?? 0).toFixed(2)}</StyledText>
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
