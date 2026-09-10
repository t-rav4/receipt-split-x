import { ReceiptListItem } from "@/app/receipt/components/ReceiptListItem";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
import StyledText from "@/components/shared/StyledText";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { WideButton } from "@/components/shared/WideButton";
import { colours } from "@/constants/colours";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useUserContext } from "@/context/UserContext";
import { ReceiptItem } from "@/utils/pdf-splitting";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ReceiptSummaryCard } from "./ReceiptSummaryCard";

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

export default function SplitItemsScreen() {
  const { push } = useRouter();

  const { users } = useUserContext();
  const { spliteeIds, receiptItems, assignUserToItem, costsByUser, totalCost } =
    useReceiptContext();

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

  return (
    <ScreenLayout
      title="Split Items"
      showBackButton
      rightComponent={<HelpButton />}
    >
      <ReceiptSummaryCard
        receiptName="Coles"
        numOfItems={receiptItems.length}
        numOfSplitees={spliteeIds.size}
        totalAmount={totalCost}
      />

      <View style={{}}>
        <StyledText
          style={{ fontWeight: "bold", fontSize: 16, paddingVertical: 4 }}
        >
          Assign items to people
        </StyledText>
        <StyledText style={{ color: colours.info }}>
          Select the person(s) responsible for each item.
        </StyledText>
        <StyledText style={{ color: colours.info }}>
          Leave unassigned to split evenly.
        </StyledText>
      </View>

      {/* Selected Users - Toggle Select */}
      <View style={styles.userChipsContainer}>
        <FlatList
          data={splitees}
          horizontal
          contentContainerStyle={{
            justifyContent: "space-evenly",
          }}
          keyExtractor={(user) => user.id}
          renderItem={({ item: user }) => {
            const computedStyle: ViewStyle = {
              gap: 4,
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 12,
              backgroundColor:
                selectedUserId === user.id ? colours.secondary : "",
            };
            return (
              <TouchableOpacity
                style={computedStyle}
                onPress={() => toggleUserSelect(user.id)}
              >
                <UserAvatar name={user.name} colour={user.colour} />
                <StyledText>{user.name}</StyledText>
              </TouchableOpacity>
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
        ListEmptyComponent={<StyledText>No receipt items</StyledText>} // TODO: add better UI here
      />

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
  header: {},
  userChipsContainer: {
    paddingTop: 10,
    paddingBottom: 15,
  },
});
