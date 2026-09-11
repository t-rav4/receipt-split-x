import { colours } from "@/constants/colours";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PropsWithChildren } from "react";
import {
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import StyledText from "./StyledText";

interface RSModalProps {
  visible: boolean;
  title?: string;
  onClose?: () => void;
}

export function RSModal({
  children,
  visible,
  title,
  onClose,
}: PropsWithChildren<RSModalProps>) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <>
            <View style={styles.header}>
              {title && <StyledText>{title}</StyledText>}
              <TouchableOpacity
                style={{ marginLeft: "auto" }}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color={colours.text} />
              </TouchableOpacity>
            </View>
            {children}
          </>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colours.surfaceElevated,
    padding: 10,
    borderRadius: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
