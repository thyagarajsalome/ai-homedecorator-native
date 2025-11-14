import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from "react-native-svg";

// Note: className is replaced with a style prop
type IconProps = {
  style?: StyleProp<ViewStyle>;
  // for icons that change based on state, like the chevron
  active?: boolean;
};

export const LogoIcon: React.FC<IconProps> = ({ style }) => (
  <Svg viewBox="0 0 100 100" style={[{ width: 32, height: 32 }, style]}>
    <Defs>
      <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
        <Stop offset="100%" stopColor="#c084fc" stopOpacity={1} />
      </LinearGradient>
      <LinearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
        <Stop offset="100%" stopColor="#a78bfa" stopOpacity={1} />
      </LinearGradient>
    </Defs>
    <Path
      d="M20,80 Q50,95 80,80 L80,50 Q70,60 50,60 Q30,60 20,50 Z"
      fill="url(#logoGradient)"
    />
    <Path
      d="M20,50 Q30,40 50,40 Q70,40 80,50 L80,20 Q50,5 20,20 Z"
      fill="url(#logoGradient2)"
    />
  </Svg>
);

export const AccordionChevronIcon: React.FC<IconProps> = ({
  style,
  active,
}) => (
  <Svg
    viewBox="0 0 20 20"
    fill="currentColor"
    style={[
      { width: 20, height: 20 },
      style,
      active && { transform: [{ rotate: "180deg" }] },
    ]}
  >
    <Path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </Svg>
);

export const DecorateIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 20 20"
    fill="currentColor"
    style={[{ width: 20, height: 20 }, style]}
  >
    <Path d="M10 3.5a1.5 1.5 0 011.06.44l3.536 3.535a1.5 1.5 0 010 2.122L11.06 13.13a1.5 1.5 0 01-2.122 0L5.404 9.596a1.5 1.5 0 010-2.122L8.94 3.94A1.5 1.5 0 0110 3.5zM8.94 5.05L5.404 8.586a.5.5 0 000 .707l3.535 3.536a.5.5 0 00.707 0l3.536-3.536a.5.5 0 000-.707L8.94 5.05zM15.95 10.45a1 1 0 01-1.414 1.414l-2.02-2.02a1 1 0 111.414-1.414l2.02 2.02zM6.485 13.515a1 1 0 01-1.414 1.414L3.05 12.91a1 1 0 111.414-1.414l2.021 2.019z" />
    <Path d="M10 18a1 1 0 100-2 1 1 0 000 2zM3 7a1 1 0 100-2 1 1 0 000 2zM17 7a1 1 0 100-2 1 1 0 000 2z" />
  </Svg>
);

export const UploadIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={[{ width: 24, height: 24 }, style]}
  >
    <Path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
  </Svg>
);

export const CameraIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={[{ width: 24, height: 24 }, style]}
  >
    <Circle cx="12" cy="12" r="3.2" />
    <Path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </Svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={[{ width: 24, height: 24 }, style]}
  >
    <Path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={[{ width: 24, height: 24 }, style]}
  >
    <Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 8.81C7.5 8.31 6.79 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
  </Svg>
);

export const ResetIcon: React.FC<IconProps> = ({ style }) => (
  <Svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={[{ width: 24, height: 24 }, style]}
  >
    <Path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
  </Svg>
);
