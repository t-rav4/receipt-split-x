import { colours } from "@/constants/colours";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { RSModal } from "../shared/RSModal";
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
  const pickerColour = useRef(currentColour || "#000000");
  const [pickerKey, setPickerKey] = useState(0);

  useEffect(() => {
    if (visible) {
      pickerColour.current = currentColour || "#000000";
      setPickerKey((key) => key + 1);
    }
  }, [visible, currentColour]);

  const handleColourChange = (colour: string) => {
    pickerColour.current = colour;
  };

  const handleConfirm = () => {
    onSelect(pickerColour.current);
  };

  return (
    <RSModal visible={visible} onClose={onClose}>
      <View style={styles.colourPickerContainer}>
        <ColorPicker
          key={pickerKey}
          color={pickerColour.current}
          onColorChange={handleColourChange}
          thumbSize={30}
          sliderSize={28}
          shadeSliderThumb
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

        <TouchableOpacity onPress={handleConfirm} style={[styles.button]}>
          <StyledText style={styles.btnLabel}>Confirm</StyledText>
        </TouchableOpacity>
      </View>
    </RSModal>
  );
}

const styles = StyleSheet.create({
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
