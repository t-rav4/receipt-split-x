import { Accordion } from "@/components/shared/Accordion";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
import StyledText from "@/components/shared/StyledText";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { WideButton } from "@/components/shared/WideButton";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useUserContext } from "@/context/UserContext";
import { ReceiptItem } from "@/utils/pdf-splitting";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

export default function SummaryScreen() {
  const router = useRouter();
  const { users } = useUserContext();
  const { spliteeIds, receiptItems } = useReceiptContext();

  const splitees = users.filter((u) => spliteeIds.has(u.id));

  const summaryItems = splitees.map((u) => {
    const userItems = receiptItems.filter((item) =>
      item.assignedUserIds.has(u.id),
    );
    return { id: u.id, name: u.name, colour: u.colour, items: userItems };
  });

  const renderItem = ({
    key,
    name,
    colour,
    items,
  }: {
    key: string;
    name: string;
    colour: string;
    items: ReceiptItem[];
  }) => {
    return (
      <Accordion
        key={key}
        content={
          <View style={styles.accordionContainer}>
            <UserAvatar name={name} colour={colour} size={40} />

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 8, paddingHorizontal: 14 }}>
                <StyledText>{name}</StyledText>
                <StyledText>{`${items.length} items  .  9 shared item`}</StyledText>
              </View>

              <StyledText style={{ fontWeight: "bold" }}>$24.50</StyledText>
            </View>
          </View>
        }
      >
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.expandedAccordionContainer}>
              <StyledText>{item.name}</StyledText>
              <StyledText>{item.finalPrice.toFixed(2)}</StyledText>
            </View>
          )}
        />
      </Accordion>
    );
  };

  return (
    <ScreenLayout title="Summary" showBackButton>
      <View style={styles.header}>
        <Ionicons name="receipt" color="white" size={48} />
        <StyledText>Total amount</StyledText>
        <StyledText>$ 100.00</StyledText>
        <StyledText>Split between 4 people</StyledText>
      </View>

      <FlatList
        data={summaryItems}
        renderItem={({ item }) =>
          renderItem({
            key: item.id,
            name: item.name,
            colour: item.colour,
            items: item.items,
          })
        }
      />

      <WideButton
        label="Done"
        onPress={() => {
          router.dismissAll();
          router.replace("/");
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 18,
  },

  accordionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  expandedAccordionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
