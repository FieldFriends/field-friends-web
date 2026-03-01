import { useTheme } from "vuetify";

export const useFriendColors = () => {
  const theme = useTheme();

  // FriendDev: Get hex code from theme or accept raw hex.
  const resolveColor = (val: string | undefined) => {
    if (!val) {
      return undefined;
    }

    // FriendDev: Try to get a color from our theme.
    const themeColor = theme.current.value.colors[val];

    // FriendDev: Either return the hex code for our theme color, or the raw hex the dev entered.
    return themeColor || val;
  };

  return {
    resolveColor
  };
};