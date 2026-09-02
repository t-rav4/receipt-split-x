import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StyledText from "./StyledText";

interface ScreenLayoutProps {
  title?: string;
  viewStyle?: ViewStyle;
  showBackButton?: boolean;
  rightComponent?: ReactNode;
}

export function ScreenLayout({
  children,
  title,
  viewStyle,
  showBackButton = false,
  rightComponent,
}: PropsWithChildren<ScreenLayoutProps>) {
  const { back } = useRouter();
  return (
    <SafeAreaView style={[styles.layout, viewStyle]}>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity onPress={back}>
            <Ionicons name="arrow-back" color="white" size={32} />
          </TouchableOpacity>
        )}

        {title && <StyledText style={styles.title}>{title}</StyledText>}

        {rightComponent && (
          <View style={{ marginLeft: "auto" }}>{rightComponent}</View>
        )}
      </View>

      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 18,
    gap: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
