import { ReceiptItem } from "@/utils/pdf-splitting";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { RSModal } from "./shared/RSModal";
import StyledText from "./shared/StyledText";
import { WideButton } from "./shared/WideButton";

interface EditReceiptItemModalProps {
  item: ReceiptItem;
  onEditPrice: (itemId: string, newPrice: string) => void;
  visible: boolean;
  onClose: () => void;
}

export function EditReceiptItemModal({
  item,
  onEditPrice,
  visible,
  onClose,
}: EditReceiptItemModalProps) {
  const [input, setInput] = useState(item.finalPrice.toFixed(2));

  return (
    <RSModal title="Edit Item Price" visible={visible} onClose={onClose}>
      <View style={{ paddingVertical: 40, paddingHorizontal: 20, gap: 12 }}>
        <StyledText>{item.name}</StyledText>

        <View style={styles.inputContainer}>
          <StyledText style={styles.currency}>$</StyledText>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={(text) => setInput(text)}
            inputMode="decimal"
            keyboardType="decimal-pad"
          />
        </View>

        <WideButton
          label="Save"
          onPress={() => onEditPrice(item.id, input)}
          disabled={input === item.finalPrice.toFixed(2)}
        />
      </View>
    </RSModal>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    padding: 8,
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
  },
  currency: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
});
