/**
 * Typography variant mappings
 *
 * h1 => Display
 * h2 => Data
 * h3 => Title
 * h4 => Subtitle
 * caption => All Caps - Header
 * body1 => Body&Buttons and Navigation_2
 * body2 => Notes
 */
import { TypographyOptions } from "@material-ui/core/styles/createTypography";

import { grey } from "@material-ui/core/colors";

export const typography: TypographyOptions = {
  fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  h1: {
    fontWeight: 600,
    fontSize: "2rem",
    lineHeight: 2,
  },
  h2: {
    fontSize: "1.4rem",
    lineHeight: 2,
    fontWeight: 400,
  },
  h3: {
    fontSize: "1.2rem",
    fontWeight: 600,
  },
  h4: {
    fontSize: "1.1rem",
    fontWeight: 600,
    lineHeight: "1.5",
  },
  h5: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: "1.5",
  },
  body2: {
    fontSize: "0.9rem",
    lineHeight: "1.5",
  },
  caption: {
    fontSize: "0.85rem",
    fontWeight: 400,
    color: grey[600],
  },
  button: {
    textTransform: "none",
  },
  subtitle1: {
    fontSize: "0.9rem",
  },
};
