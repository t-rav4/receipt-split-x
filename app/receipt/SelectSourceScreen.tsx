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
    <View style={styles.container}>
      <TileButton
        label="Upload a Receipt from file storage"
        ioniIcon="cloud-upload"
        onPress={handleSelectFile}
      />

      <TileButton
        label="Capture a photo of receipt using Camera"
        ioniIcon="camera"
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    gap: 80,
  },
});
