import { palette } from "./palette";

export const overrides = {
  MuiListItem: {
    root: {
      background: "transparent",
      "&$selected": {
        backgroundColor: palette.primary.lighter,
      },
    },
  },
};
