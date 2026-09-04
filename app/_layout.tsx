import { colours } from "@/constants/colours";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { ReceiptProvider } from "../context/ReceiptContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <ReceiptProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colours.background },
          }}
        />
      </ReceiptProvider>
    </UserProvider>
  );
}
