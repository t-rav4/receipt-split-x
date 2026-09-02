import { colours } from "@/constants/colours";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import StyledText from "../shared/StyledText";

interface ColourPickerModalProps {
  visible: boolean;
  currentColour?: string;
  onSelect: (colour: string) => void;
  onClose: () => void;
}

export function ColourPickerModal({
  visible,
  currentColour,
  onSelect,
  onClose,
}: ColourPickerModalProps) {
  const [pickerColour, setPickerColour] = useState(currentColour || "#000000");

  useEffect(() => {
    if (currentColour) {
      setPickerColour(currentColour);
    }
  }, [currentColour]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={onClose}>
            <Ionicons name="close" size={24} color={colours.text} />
          </TouchableOpacity>

          <View style={styles.colourPickerContainer}>
            <ColorPicker
              color={pickerColour}
              onColorChange={(colour) => setPickerColour(colour)}
              thumbSize={30}
              sliderSize={28}
              noSnap
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, { backgroundColor: colours.secondary }]}
            >
              <StyledText style={[styles.btnLabel, {}]}>Cancel</StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSelect(pickerColour)}
              style={[styles.button]}
            >
              <StyledText style={styles.btnLabel}>Confirm</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
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

  colourPickerContainer: {
    height: 320,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },

  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colours.primary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },

  btnLabel: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
});
