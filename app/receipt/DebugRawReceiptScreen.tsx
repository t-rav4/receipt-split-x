import StyledText from "@/components/shared/StyledText";
import { useReceiptContext } from "@/context/ReceiptContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function DebugRawReceiptScreen() {
  const { back } = useRouter();
  const { rawExtractedText } = useReceiptContext();

  return (
    <View style={{ paddingVertical: 50, paddingHorizontal: 20 }}>
      <Ionicons
        style={{ paddingVertical: 10 }}
        name="arrow-back-circle"
        color="white"
        size={40}
        onPress={back}
      />
      {rawExtractedText ? (
        <ScrollView
          style={{ paddingVertical: 80, alignSelf: "center" }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          <StyledText>{rawExtractedText}</StyledText>
        </ScrollView>
      ) : (
        <StyledText style={{ textAlign: "center" }}>
          Something went wrong. There is no extracted text from receipt to
          display.
        </StyledText>
      )}
    </View>
  );
}
