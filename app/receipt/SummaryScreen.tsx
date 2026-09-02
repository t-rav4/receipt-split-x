import { ScreenLayout } from "@/components/shared/ScreenLayout";
import { StyleSheet, Text, View } from "react-native";

export default function SummaryScreen() {
  return (
    <ScreenLayout title="Summary" showBackButton>
      <View style={styles.container}>
        <Text style={styles.title}>Summary</Text>
        {/* Add summary UI here */}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
