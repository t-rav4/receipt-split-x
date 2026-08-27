import { StyleSheet, Text, View } from "react-native";

export default function SummaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summary</Text>
      {/* Add summary UI here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
