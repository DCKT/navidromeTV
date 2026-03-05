import { useRef, ReactNode } from "react";
import {
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import tw from "twrnc";

interface FocusableProps {
  onPress?: () => void;
  children: ReactNode;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  focusScale?: number;
  glowColor?: string;
  rounded?: boolean;
  disabled?: boolean;
}

export function Focusable({
  onPress,
  children,
  hasTVPreferredFocus,
  style,
  focusScale = 1.1,
  glowColor = "#1DB954",
  rounded = true,
  disabled = false,
}: FocusableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focusScale,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const borderRadius = rounded ? "rounded-full" : "rounded-lg";

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      activeOpacity={disabled ? 1 : 0.8}
      hasTVPreferredFocus={hasTVPreferredFocus}
      disabled={disabled}
    >
      <Animated.View
        style={[
          tw`items-center justify-center ${borderRadius}`,
          { transform: [{ scale }], opacity: disabled ? 0.3 : 1 },
          style,
        ]}
      >
        <Animated.View
          style={[
            tw`absolute inset-[-8px] ${borderRadius}`,
            {
              opacity: glowOpacity,
              backgroundColor: `${glowColor}25`,
              shadowColor: glowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 24,
            },
          ]}
        />
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
