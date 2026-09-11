import { StyleSheet, View } from "react-native";
import StyledText from "./StyledText";

interface UserAvatarProps {
  name: string;
  colour: string;
  size?: number;
}

export function UserAvatar({ name, colour, size = 32 }: UserAvatarProps) {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, backgroundColor: colour },
      ]}
    >
      <StyledText style={{ fontWeight: "bold" }}>{name[0]}</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: "100%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
