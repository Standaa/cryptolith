import { createMuiTheme } from "@material-ui/core";
import { overrides } from "./defaultTheme/overrides";
import { palette } from "./defaultTheme/palette";
import { typography } from "./defaultTheme/typography";
import { props } from "./defaultTheme/props";

export const theme = createMuiTheme({
  typography,
  palette,
  overrides,
  props,
});
