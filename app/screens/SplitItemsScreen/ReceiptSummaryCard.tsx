import StyledText from "@/components/shared/StyledText";
import { colours } from "@/constants/colours";
import { StyleSheet, View } from "react-native";

interface ReceiptSummaryCardProps {
  receiptName: string;
  numOfItems: number;
  numOfSplitees: number;
  totalAmount: number;
}

export function ReceiptSummaryCard({
  receiptName,
  numOfItems,
  numOfSplitees,
  totalAmount,
}: ReceiptSummaryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.receiptPreview}>
        {/* Receipt pdf preview image */}
      </View>

      <View>
        <StyledText>{receiptName}</StyledText>

        <View style={{ flexDirection: "row", gap: 18, alignItems: "center" }}>
          <StyledText style={{ color: colours.info }}>
            {numOfItems} items
          </StyledText>
          <StyledText style={{ fontSize: 24 }}>•</StyledText>
          <StyledText style={{ color: colours.info }}>
            {numOfSplitees} people
          </StyledText>
        </View>
      </View>

      <StyledText style={styles.price}>${totalAmount.toFixed(2)}</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colours.info,
    backgroundColor: colours.surface,
    alignItems: "center",
  },
  receiptPreview: {
    width: 50,
    height: 50,
    borderRadius: 80,
    backgroundColor: colours.info,
  },

  price: {
    marginLeft: "auto",
    fontWeight: "bold",
    fontSize: 18,
  },
});
