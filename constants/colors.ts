/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#07183d',
    tint: '#11d3cc',

    // Core surfaces
    background: '#fff7e8',
    foreground: '#07183d',

    // Cards / elevated surfaces
    card: '#fffdf7',
    cardForeground: '#07183d',

    // Primary action color (buttons, links, active states)
    primary: '#11d3cc',
    primaryForeground: '#07183d',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#eaf0ed',
    secondaryForeground: '#173153',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#edf0ea',
    mutedForeground: '#617084',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#ff735d',
    accentForeground: '#07183d',

    // Destructive actions (delete, error states)
    destructive: '#d9574c',
    destructiveForeground: '#fff7e8',

    // Borders and input outlines
    border: '#dce3dd',
    input: '#dce3dd',
    deep: '#07183d',
    warm: '#fff7e8',
    tealSoft: '#c9f3ee',
  },

  dark: {
    text: '#fff7e8',
    tint: '#11d3cc',
    background: '#07183d',
    foreground: '#fff7e8',
    card: '#102750',
    cardForeground: '#fff7e8',
    primary: '#11d3cc',
    primaryForeground: '#07183d',
    secondary: '#19345d',
    secondaryForeground: '#fff7e8',
    muted: '#19345d',
    mutedForeground: '#a6b7c4',
    accent: '#ff735d',
    accentForeground: '#07183d',
    destructive: '#ff8977',
    destructiveForeground: '#07183d',
    border: '#294268',
    input: '#294268',
    deep: '#07183d',
    warm: '#fff7e8',
    tealSoft: '#19345d',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
