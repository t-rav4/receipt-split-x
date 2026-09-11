import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AccordionProps {
  content: ReactNode;
}

export function Accordion({
  content,
  children,
}: PropsWithChildren<AccordionProps>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <View style={{ flex: 1 }}>{content}</View>

        <Ionicons
          style={{ paddingLeft: 8 }}
          name={expanded ? "chevron-up" : "chevron-down"}
          color="darkgrey"
          size={20}
        />
      </Pressable>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderColor: "darkgrey",
    borderRadius: 8,
  },

  header: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
