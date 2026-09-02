import { colours } from "@/constants/colours";
import React from "react";
import { Text } from "react-native";

interface StyledTextProps extends React.ComponentProps<typeof Text> {}

export default function StyledText(props: StyledTextProps) {
  const { style, ...rest } = props;
  return <Text style={[{ color: colours.text }, style]} {...rest} />;
}
