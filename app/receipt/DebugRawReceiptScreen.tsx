import { EditReceiptItemModal } from "@/components/EditReceiptItemModal";
import { Chip } from "@/components/shared/Chip";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
import StyledText from "@/components/shared/StyledText";
import { colours } from "@/constants/colours";
import { useReceiptContext } from "@/context/ReceiptContext";
import { ReceiptItem } from "@/utils/pdf-splitting";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ReceiptListItem } from "./components/ReceiptListItem";

type DebugView = "RAW_EXTRACT" | "PROCESSED_EXTRACT";

export default function DebugRawReceiptScreen() {
  const { rawExtractedText, receiptItems, updateItemById, deleteItemById } =
    useReceiptContext();

  const [viewType, setViewType] = useState<DebugView>("PROCESSED_EXTRACT");

  const [editingItem, setEditingItem] = useState<ReceiptItem | null>(null);

  const openEditModal = (item: ReceiptItem) => {
    setEditingItem(item);
  };

  const onEditPrice = (itemId: string, newPrice: string) => {
    const item = receiptItems.find((i) => i.id === itemId);
    if (!item) {
      console.error("Could not find item by id");
      return;
    }

    updateItemById(itemId, { ...item, finalPrice: Number(newPrice) });
    setEditingItem(null);
  };

  function ItemActions({ item }: { item: ReceiptItem }) {
    return (
      <View
        style={{
          gap: 10,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Ionicons name="pencil-outline" color="white" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteItemById(item.id)}>
          <Ionicons name="trash" color="salmon" size={20} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenLayout title="Debugging - Raw PDF Extract" showBackButton>
      <View style={styles.header}>
        <Chip
          label="Processed"
          onPress={() => setViewType("PROCESSED_EXTRACT")}
          backgroundColour={
            viewType === "PROCESSED_EXTRACT"
              ? colours.primary
              : colours.secondary
          }
        />
        <Chip
          label="Raw"
          onPress={() => setViewType("RAW_EXTRACT")}
          backgroundColour={
            viewType === "RAW_EXTRACT" ? colours.primary : colours.secondary
          }
        />
      </View>

      {viewType === "RAW_EXTRACT" &&
        (rawExtractedText ? (
          <ScrollView style={{ paddingVertical: 10, alignSelf: "center" }}>
            <StyledText>{rawExtractedText}</StyledText>
          </ScrollView>
        ) : (
          <StyledText style={{ textAlign: "center" }}>
            Something went wrong. There is no extracted text from receipt to
            display.
          </StyledText>
        ))}

      {viewType === "PROCESSED_EXTRACT" && (
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
              assignedUsers={item.assignedUsers}
              actions={<ItemActions item={item} />}
            />
          )}
          ListEmptyComponent={<StyledText>No receipt items</StyledText>}
        />
      )}

      {editingItem && (
        <EditReceiptItemModal
          item={editingItem}
          onEditPrice={onEditPrice}
          visible={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
