import { colours } from "@/constants/colours";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { ReceiptProvider } from "../context/ReceiptContext";

export default function RootLayout() {
  return (
    <ReceiptProvider>
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colours.background },
          }}
        />
      </UserProvider>
    </ReceiptProvider>
  );
}
