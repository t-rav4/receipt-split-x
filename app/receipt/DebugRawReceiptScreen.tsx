import { Chip } from "@/components/shared/Chip";
import { ScreenLayout } from "@/components/shared/ScreenLayout";
import StyledText from "@/components/shared/StyledText";
import { colours } from "@/constants/colours";
import { useReceiptContext } from "@/context/ReceiptContext";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { ReceiptListItem } from "./components/ReceiptListItem";

type DebugView = "RAW_EXTRACT" | "PROCESSED_EXTRACT";

export default function DebugRawReceiptScreen() {
  const { rawExtractedText, receiptItems } = useReceiptContext();

  const [viewType, setViewType] = useState<DebugView>("PROCESSED_EXTRACT");

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
              onPress={() => {}}
              assignedUsers={item.assignedUsers}
              showEditActions
            />
          )}
          ListEmptyComponent={<StyledText>No receipt items</StyledText>}
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
