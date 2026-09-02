import { ScreenLayout } from "@/components/shared/ScreenLayout";
import { getDocumentAsync } from "expo-document-picker";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { TileButton } from "../../components/shared/TileButton";
import { useReceiptContext } from "../../context/ReceiptContext";

export default function SelectSourceScreen() {
  const { setSelectedFile } = useReceiptContext();
  const router = useRouter();

  const handleSelectFile = async () => {
    const result = await getDocumentAsync({ type: "application/pdf" });

    const selectedFile = result.assets?.[0];

    if (selectedFile) {
      console.log("Selected file:", selectedFile.uri);
      setSelectedFile(selectedFile.uri);
      router.push("/receipt/SelectUsersScreen");
    }
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <TileButton
          label="Upload a Receipt from file storage"
          ioniIcon="cloud-upload"
          onPress={handleSelectFile}
        />

        <TileButton
          ioniIcon="camera"
          label="Capture a photo of receipt using Camera"
          onPress={() => {}}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 80,
  },
});
