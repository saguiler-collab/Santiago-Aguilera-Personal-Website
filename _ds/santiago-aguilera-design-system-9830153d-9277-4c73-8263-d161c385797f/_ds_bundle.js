/* @ds-bundle: {"format":4,"namespace":"SantiagoAguileraDesignSystem_983015","components":[{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Mark","sourcePath":"components/brand/Mark.jsx"},{"name":"SpiralRule","sourcePath":"components/brand/SpiralRule.jsx"},{"name":"TimelineItem","sourcePath":"components/content/TimelineItem.jsx"},{"name":"Button","sourcePath":"components/controls/Button.jsx"},{"name":"IconButton","sourcePath":"components/controls/IconButton.jsx"},{"name":"Badge","sourcePath":"components/labels/Badge.jsx"},{"name":"Tag","sourcePath":"components/labels/Tag.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"MediaFrame","sourcePath":"components/surfaces/MediaFrame.jsx"},{"name":"PlaceCard","sourcePath":"components/surfaces/PlaceCard.jsx"},{"name":"Quote","sourcePath":"components/typography/Quote.jsx"},{"name":"SectionHeading","sourcePath":"components/typography/SectionHeading.jsx"},{"name":"Stat","sourcePath":"components/typography/Stat.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"27abb707c3c8","components/brand/Mark.jsx":"c65415f790b4","components/brand/SpiralRule.jsx":"46f0d6e54cd6","components/content/TimelineItem.jsx":"1cf5e033a78b","components/controls/Button.jsx":"20e824d7c800","components/controls/IconButton.jsx":"47737f3e7e47","components/labels/Badge.jsx":"4962432dad5d","components/labels/Tag.jsx":"d7c0b3d79e5e","components/navigation/Footer.jsx":"495d3fa529f3","components/navigation/NavBar.jsx":"b2366d82715f","components/surfaces/Card.jsx":"857a917d144e","components/surfaces/MediaFrame.jsx":"815cf321aeb8","components/surfaces/PlaceCard.jsx":"d6db97e42cbf","components/typography/Quote.jsx":"4f8c2737dd8e","components/typography/SectionHeading.jsx":"1990ac695fa2","components/typography/Stat.jsx":"372f7570fe03","ui_kits/website/Academics.jsx":"9845a51fccf6","ui_kits/website/Beyond.jsx":"05c59e874d0a","ui_kits/website/Home.jsx":"d2c3dd8341dd","ui_kits/website/Media.jsx":"f79da285c696","ui_kits/website/Places.jsx":"88bdb4f49372"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SantiagoAguileraDesignSystem_983015 = window.SantiagoAguileraDesignSystem_983015 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Patched: root-absolute. This is resolved against the page URL, and the pages sit
   in /pages while index.html sits at the root, so a relative path cannot be right
   for both. Re-apply if the design system is ever regenerated. See README. */
const LUCIDE = "/assets/icons/lucide/";

/** Masked glyph that inherits currentColor. `name` pulls from Lucide; `src` points at a local SVG. */
function Icon({
  name,
  src,
  size = "1.15em",
  label,
  style,
  ...rest
}) {
  const url = src || LUCIDE + name + ".svg";
  const mask = `url("${url}") center / contain no-repeat`;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? "img" : "presentation",
    "aria-label": label || undefined,
    "aria-hidden": label ? undefined : true,
    style: {
      display: "inline-block",
      width: size,
      height: size,
      background: "currentColor",
      WebkitMask: mask,
      mask,
      flex: "none",
      verticalAlign: "-0.16em",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Mark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VIEWS = {
  full: {
    viewBox: "107 7 1071 925.1",
    ratio: 1071 / 925.1,
    paths: ["M 135 90 L 290 300", "M 1150 35 C 1108 128, 1058 192, 1030 290", "M 931.7 323.8 C 885.5 285.5, 830.9 259.4, 774.5 246.9 C 718.1 234.5, 660 235.7, 605.9 248.7 C 551.9 261.8, 501.7 286.6, 459.6 320.6 C 417.6 354.6, 383.8 397.8, 361.5 446 C 339.3 494.1, 328.7 547.2, 331 599.2 C 333.3 651.2, 348.2 702, 373.1 746.4 C 397.9 790.9, 433.1 828.9, 474.7 856.3 C 516.3 883.7, 564.3 900.3, 612.4 904.1 C 660.5 907.8, 708.6 898.4, 749.8 878.3 C 791.1 858.2, 825.4 827.9, 849.8 793.2 C 874.2 758.4, 888.8 719.5, 894.7 681.3 C 900.6 643.2, 898.1 605.7, 889.2 571.4 C 880.4 537, 864.8 505.6, 843.8 479.2 C 822.8 452.8, 796.3 431.6, 766.8 417.7 C 737.3 403.7, 704.9 397.2, 673.5 399.1 C 642 400.9, 611.6 410.9, 587.3 428.4 C 563 445.9, 545.8 470.8, 536.1 496.1 C 526.4 521.4, 524 546.9, 524.3 569.9 C 524.7 592.9, 527.1 614.3, 533.7 634.4 C 540.3 654.5, 551.2 673.2, 566.7 686.8 C 582.2 700.4, 601.4 710.7, 622.2 707.2 C 643 703.6, 663.8 668.8, 669 645.8"]
  },
  spiral: {
    viewBox: "303 218.9 656.7 713.1",
    ratio: 656.7 / 713.1,
    paths: null
  }
};
VIEWS.spiral.paths = [VIEWS.full.paths[2]];

/** The Santiago Aguilera symbol: a smoothed one-stroke spiral with two flanking marks. */
function Mark({
  variant = "full",
  size = 40,
  strokeWidth = 40,
  color,
  title,
  style,
  ...rest
}) {
  const v = VIEWS[variant] || VIEWS.full;
  const h = typeof size === "number" ? size + "px" : size;
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: v.viewBox,
    role: title ? "img" : "presentation",
    "aria-label": title || undefined,
    "aria-hidden": title ? undefined : true,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      height: h,
      width: `calc(${h} * ${v.ratio})`,
      color: color || "inherit",
      display: "block",
      flex: "none",
      ...style
    }
  }, rest), v.paths.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d
  })));
}
Object.assign(__ds_scope, { Mark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Mark.jsx", error: String((e && e.message) || e) }); }

// components/brand/SpiralRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A section divider: hairline, spiral, hairline. Marks the seam between bands of a page. */
function SpiralRule({
  align = "center",
  size = 26,
  tone = "muted",
  style,
  ...rest
}) {
  const color = tone === "accent" ? "var(--sa-accent)" : tone === "ink" ? "var(--sa-text-primary)" : "var(--sa-text-faint)";
  const line = /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      background: "var(--sa-border-hairline)",
      flex: 1
    }
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sa-space-5)",
      width: "100%",
      color,
      ...style
    }
  }, rest), align !== "start" && line, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    variant: "spiral",
    size: size,
    strokeWidth: 52
  }), align !== "end" && line);
}
Object.assign(__ds_scope, { SpiralRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SpiralRule.jsx", error: String((e && e.message) || e) }); }

// components/content/TimelineItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PLACE = {
  mexico: "var(--sa-place-mexico)",
  colombia: "var(--sa-place-colombia)",
  panama: "var(--sa-place-panama)",
  trinidad: "var(--sa-place-trinidad)",
  usa: "var(--sa-place-usa)",
  spain: "var(--sa-place-spain)",
  pennsburg: "var(--sa-place-pennsburg)"
};

/** One entry on the vertical life map: year rail, accent node, content. */
function TimelineItem({
  year,
  place,
  title,
  where,
  children,
  media,
  meta,
  last,
  active,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = place ? PLACE[place] : "var(--sa-ink-500)";
  const lit = active || hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    style: {
      display: "grid",
      gridTemplateColumns: "64px 24px 1fr",
      gap: "var(--sa-space-4)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      fontVariantNumeric: "tabular-nums",
      color: lit ? "var(--sa-text-primary)" : "var(--sa-text-muted)",
      paddingTop: 2,
      textAlign: "right",
      transition: `color var(--sa-dur-2) var(--sa-ease-out)`
    }
  }, year), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: lit ? 13 : 9,
      height: lit ? 13 : 9,
      marginTop: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: lit ? `0 0 0 4px color-mix(in oklab, ${accent} 22%, transparent), inset 0 0 0 1px var(--sa-border-default)` : "inset 0 0 0 1px var(--sa-border-default)",
      transition: `all var(--sa-dur-2) var(--sa-ease-out)`,
      flex: "none"
    }
  }), !last && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      flex: 1,
      minHeight: 28,
      background: "var(--sa-border-hairline)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-3)",
      paddingBottom: last ? 0 : "var(--sa-space-10)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--sa-type-heading)",
      letterSpacing: "var(--sa-tracking-tight)",
      margin: 0,
      color: "var(--sa-text-primary)"
    }
  }, title), where && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      fontWeight: "var(--sa-weight-regular)",
      color: "var(--sa-text-muted)"
    }
  }, where)), children && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--sa-type-body)",
      fontSize: "var(--sa-text-sm)",
      color: "var(--sa-text-secondary)",
      margin: 0,
      maxWidth: "58ch"
    }
  }, children), media, meta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sa-space-2)",
      flexWrap: "wrap"
    }
  }, meta)));
}
Object.assign(__ds_scope, { TimelineItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/TimelineItem.jsx", error: String((e && e.message) || e) }); }

// components/controls/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: "var(--sa-control-h-sm)",
    padding: "0 14px",
    fontSize: "var(--sa-text-xs)",
    gap: 6
  },
  md: {
    height: "var(--sa-control-h)",
    padding: "0 22px",
    fontSize: "var(--sa-text-sm)",
    gap: 8
  },
  lg: {
    height: "var(--sa-control-h-lg)",
    padding: "0 28px",
    fontSize: "var(--sa-text-base)",
    gap: 10
  }
};
function skin(variant, hover) {
  switch (variant) {
    case "secondary":
      return {
        background: hover ? "color-mix(in oklab, var(--sa-ink-800) 7%, transparent)" : "transparent",
        color: "var(--sa-text-primary)",
        boxShadow: `inset 0 0 0 var(--sa-border-width-strong) ${hover ? "var(--sa-border-strong)" : "var(--sa-border-default)"}`
      };
    case "ghost":
      return {
        background: hover ? "color-mix(in oklab, var(--sa-ink-800) 6%, transparent)" : "transparent",
        color: hover ? "var(--sa-link-hover)" : "var(--sa-text-secondary)",
        boxShadow: "none"
      };
    case "ink":
      return {
        background: hover ? "var(--sa-ink-900)" : "var(--sa-ink-800)",
        color: "var(--sa-text-inverse)",
        boxShadow: "var(--sa-shadow-1)"
      };
    default:
      return {
        background: hover ? "var(--sa-accent-hover)" : "var(--sa-accent)",
        color: "var(--sa-text-inverse)",
        boxShadow: "var(--sa-shadow-1)"
      };
  }
}

/** The primary action control. Renders an <a> when `href` is set. */
function Button({
  variant = "primary",
  size = "md",
  href,
  iconLeft,
  iconRight,
  fullWidth,
  disabled,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = href && !disabled ? "a" : "button";
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: Tag === "button" ? disabled : undefined,
    "aria-disabled": disabled || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      font: "var(--sa-type-ui)",
      fontSize: s.fontSize,
      letterSpacing: "var(--sa-tracking-tight)",
      borderRadius: "var(--sa-radius-control)",
      border: "none",
      textDecoration: "none",
      whiteSpace: "nowrap",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.42 : 1,
      transform: press && !disabled ? "scale(var(--sa-press-scale))" : hover && !disabled ? "translateY(var(--sa-lift))" : "none",
      transition: "var(--sa-transition-control)",
      ...skin(variant, hover && !disabled),
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/Button.jsx", error: String((e && e.message) || e) }); }

// components/controls/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: 32,
  md: 40,
  lg: 48
};

/** Circular icon-only control. Always pass `label`. */
function IconButton({
  size = "md",
  variant = "quiet",
  label,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const px = SIZES[size] || SIZES.md;
  const Tag = href ? "a" : "button";
  const skin = variant === "solid" ? {
    background: hover ? "var(--sa-accent-hover)" : "var(--sa-accent)",
    color: "var(--sa-text-inverse)",
    boxShadow: "var(--sa-shadow-1)"
  } : variant === "outline" ? {
    background: hover ? "color-mix(in oklab, var(--sa-ink-800) 7%, transparent)" : "transparent",
    color: "var(--sa-text-primary)",
    boxShadow: "inset 0 0 0 1px var(--sa-border-default)"
  } : {
    background: hover ? "color-mix(in oklab, var(--sa-ink-800) 7%, transparent)" : "transparent",
    color: hover ? "var(--sa-link-hover)" : "var(--sa-text-secondary)",
    boxShadow: "none"
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    "aria-label": label,
    title: label,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: px,
      height: px,
      border: "none",
      borderRadius: "var(--sa-radius-pill)",
      cursor: "pointer",
      fontSize: Math.round(px * 0.45),
      transform: press ? "scale(var(--sa-press-scale))" : "none",
      transition: "var(--sa-transition-control)",
      ...skin,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/controls/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/labels/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    background: "var(--sa-surface-sunken)",
    color: "var(--sa-text-muted)"
  },
  accent: {
    background: "var(--sa-accent-quiet)",
    color: "var(--sa-coral-600)"
  },
  highlight: {
    background: "var(--sa-highlight-soft)",
    color: "var(--sa-sienna-500)"
  },
  positive: {
    background: "var(--sa-positive-soft)",
    color: "var(--sa-verdigris-500)"
  },
  ink: {
    background: "var(--sa-ink-800)",
    color: "var(--sa-text-inverse)"
  }
};

/** Static status label in small caps — "Coming soon", "2024", "Published". */
function Badge({
  tone = "neutral",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 9px",
      font: "var(--sa-type-eyebrow)",
      fontSize: "var(--sa-text-2xs)",
      letterSpacing: "var(--sa-tracking-wide)",
      textTransform: "uppercase",
      borderRadius: "var(--sa-radius-sm)",
      ...(TONES[tone] || TONES.neutral),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/Badge.jsx", error: String((e && e.message) || e) }); }

// components/labels/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PLACE = {
  mexico: "var(--sa-place-mexico)",
  colombia: "var(--sa-place-colombia)",
  panama: "var(--sa-place-panama)",
  trinidad: "var(--sa-place-trinidad)",
  usa: "var(--sa-place-usa)",
  spain: "var(--sa-place-spain)",
  pennsburg: "var(--sa-place-pennsburg)"
};

/** Small pill label. Interactive when `onClick` is passed — that's the filter-chip use. */
function Tag({
  place,
  selected,
  onClick,
  iconLeft,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = place ? PLACE[place] : "var(--sa-ink-800)";
  const Tag_ = onClick ? "button" : "span";
  return /*#__PURE__*/React.createElement(Tag_, _extends({
    onClick: onClick,
    "aria-pressed": onClick ? !!selected : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 28,
      padding: place || selected ? "0 12px 0 10px" : "0 12px",
      font: "var(--sa-type-ui)",
      fontSize: "var(--sa-text-xs)",
      letterSpacing: "var(--sa-tracking-normal)",
      borderRadius: "var(--sa-radius-pill)",
      border: "none",
      cursor: onClick ? "pointer" : "default",
      background: selected ? accent : hover && onClick ? "color-mix(in oklab, var(--sa-ink-800) 8%, transparent)" : "var(--sa-surface-sunken)",
      color: selected ? "var(--sa-text-inverse)" : "var(--sa-text-secondary)",
      boxShadow: selected ? "none" : "inset 0 0 0 1px var(--sa-border-hairline)",
      transition: "var(--sa-transition-control)",
      ...style
    }
  }, rest), place && !selected && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: accent,
      flex: "none"
    }
  }), iconLeft, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/labels/Tag.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Deep-teal closing band: mark, one line, social icon row. */
function Footer({
  note = "Six countries, collected in one place. Thanks for reading.",
  socials = [],
  columns = [],
  iconBase = "/assets/icons/brand",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    className: "sa-on-ink",
    style: {
      background: "var(--sa-ink-800)",
      color: "var(--sa-paper-000)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--sa-page-max)",
      margin: "0 auto",
      padding: "var(--sa-space-16) var(--sa-gutter) var(--sa-space-10)",
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--sa-space-16)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-5)",
      minWidth: 260,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    variant: "full",
    size: 44,
    title: "Santiago Aguilera"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--sa-type-body)",
      color: "color-mix(in oklab, var(--sa-paper-000) 74%, transparent)",
      maxWidth: "34ch",
      margin: 0
    }
  }, note)), columns.map(col => /*#__PURE__*/React.createElement("nav", {
    key: col.title,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-3)",
      minWidth: 150
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-eyebrow)",
      letterSpacing: "var(--sa-tracking-eyebrow)",
      textTransform: "uppercase",
      color: "color-mix(in oklab, var(--sa-paper-000) 52%, transparent)"
    }
  }, col.title), col.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href || "#",
    style: {
      font: "var(--sa-type-ui)",
      fontWeight: "var(--sa-weight-regular)",
      color: "color-mix(in oklab, var(--sa-paper-000) 86%, transparent)",
      textDecoration: "none"
    }
  }, l.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--sa-page-max)",
      margin: "0 auto",
      padding: "var(--sa-space-5) var(--sa-gutter)",
      borderTop: "1px solid var(--sa-border-on-ink)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--sa-space-6)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      fontWeight: "var(--sa-weight-regular)",
      color: "color-mix(in oklab, var(--sa-paper-000) 56%, transparent)"
    }
  }, "\xA9 ", new Date().getFullYear(), " Santiago Aguilera Library"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sa-space-1)"
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    key: s.id,
    label: s.label,
    href: s.href || "#",
    style: {
      color: "var(--sa-paper-000)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    src: s.src || `${iconBase}/${s.id}.svg`,
    size: 18
  }))))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sticky top bar: mark + wordmark on the left, section links right, blurred paper veil. */
function NavBar({
  items = [],
  active,
  onNavigate,
  action,
  sticky = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      position: sticky ? "sticky" : "relative",
      top: 0,
      zIndex: 20,
      background: "color-mix(in oklab, var(--sa-surface-page) 82%, transparent)",
      backdropFilter: "var(--sa-blur-veil)",
      WebkitBackdropFilter: "var(--sa-blur-veil)",
      borderBottom: "1px solid var(--sa-border-hairline)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: "var(--sa-page-max)",
      margin: "0 auto",
      padding: "var(--sa-space-4) var(--sa-gutter)",
      display: "flex",
      alignItems: "center",
      gap: "var(--sa-space-8)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#home",
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(items[0]?.id);
      }
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--sa-space-3)",
      textDecoration: "none",
      color: "var(--sa-text-primary)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    variant: "spiral",
    size: 26,
    strokeWidth: 50,
    title: "Santiago Aguilera"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sa-font-display)",
      fontSize: "var(--sa-text-md)",
      letterSpacing: "var(--sa-tracking-tight)"
    }
  }, "Santiago Aguilera")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--sa-space-1)",
      marginLeft: "auto",
      flexWrap: "wrap"
    }
  }, items.map(it => /*#__PURE__*/React.createElement(NavLink, {
    key: it.id,
    item: it,
    active: active === it.id,
    onNavigate: onNavigate
  })), action && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "var(--sa-space-4)"
    }
  }, action))));
}
function NavLink({
  item,
  active,
  onNavigate
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: item.href || "#" + item.id,
    onClick: e => {
      if (onNavigate) {
        e.preventDefault();
        onNavigate(item.id);
      }
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      padding: "8px 12px",
      font: "var(--sa-type-ui)",
      textDecoration: "none",
      color: active ? "var(--sa-text-primary)" : hover ? "var(--sa-text-primary)" : "var(--sa-text-muted)",
      borderRadius: "var(--sa-radius-pill)",
      transition: "var(--sa-transition-control)"
    }
  }, item.label, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 2,
      height: 1.5,
      background: "var(--sa-accent)",
      borderRadius: 1,
      opacity: active ? 1 : hover ? 0.4 : 0,
      transition: `opacity var(--sa-dur-2) var(--sa-ease-out)`
    }
  }));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The default container: paper-white, hairline, small radius, optional hover lift. */
function Card({
  href,
  onClick,
  media,
  eyebrow,
  title,
  meta,
  footer,
  tone = "card",
  interactive,
  padding = "var(--sa-space-6)",
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;
  const Tag = href ? "a" : onClick ? "button" : "div";
  const bg = tone === "sunken" ? "var(--sa-surface-sunken)" : tone === "ink" ? "var(--sa-surface-ink)" : "var(--sa-surface-card)";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      background: bg,
      color: tone === "ink" ? "var(--sa-text-inverse)" : "var(--sa-text-primary)",
      border: "none",
      boxShadow: `inset 0 0 0 1px ${tone === "ink" ? "var(--sa-border-on-ink)" : "var(--sa-border-hairline)"}, ${lift ? "var(--sa-shadow-2)" : "var(--sa-shadow-1)"}`,
      borderRadius: "var(--sa-radius-card)",
      overflow: "hidden",
      textDecoration: "none",
      cursor: href || onClick ? "pointer" : "default",
      transform: lift ? "translateY(var(--sa-lift))" : "none",
      transition: "var(--sa-transition-control)",
      ...style
    }
  }, rest), media, /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-3)",
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-eyebrow)",
      letterSpacing: "var(--sa-tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--sa-text-muted)"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      font: "var(--sa-type-heading)",
      letterSpacing: "var(--sa-tracking-tight)",
      margin: 0,
      color: "inherit"
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--sa-type-body)",
      fontSize: "var(--sa-text-sm)",
      color: tone === "ink" ? "var(--sa-text-secondary)" : "var(--sa-text-secondary)",
      lineHeight: "var(--sa-leading-relaxed)"
    }
  }, children), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--sa-space-2)",
      flexWrap: "wrap",
      marginTop: "auto",
      paddingTop: "var(--sa-space-2)"
    }
  }, meta)), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `var(--sa-space-4) ${padding}`,
      borderTop: `1px solid ${tone === "ink" ? "var(--sa-border-on-ink)" : "var(--sa-border-hairline)"}`,
      font: "var(--sa-type-ui)",
      color: "var(--sa-text-muted)"
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/MediaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Image or video slot. With no `src` it renders an honest labelled placeholder — never a fake photo. */
function MediaFrame({
  src,
  alt = "",
  ratio = "4 / 3",
  kind = "photo",
  caption,
  placeholder = "Photo to be supplied",
  scrim,
  overlay,
  radius = "var(--sa-radius-media)",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-2)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      aspectRatio: ratio,
      overflow: "hidden",
      borderRadius: radius,
      background: "var(--sa-surface-tint)",
      boxShadow: "inset 0 0 0 1px var(--sa-border-hairline)"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      transform: hover ? "scale(1.03)" : "none",
      transition: `transform var(--sa-dur-4) var(--sa-ease-out)`
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      color: "var(--sa-text-faint)",
      padding: "var(--sa-space-4)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: kind === "video" ? "play" : "camera",
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      fontSize: "var(--sa-text-xs)",
      letterSpacing: "var(--sa-tracking-wide)"
    }
  }, placeholder)), scrim && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--sa-scrim-ink)",
      pointerEvents: "none"
    }
  }), kind === "video" && src && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: "var(--sa-radius-pill)",
      background: "rgba(253,251,247,.92)",
      display: "grid",
      placeItems: "center",
      color: "var(--sa-ink-900)",
      fontSize: 20,
      boxShadow: "var(--sa-shadow-2)",
      transform: hover ? "scale(1.06)" : "none",
      transition: `transform var(--sa-dur-2) var(--sa-ease-spring)`
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "play",
    size: 20
  }))), overlay && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "flex-end",
      padding: "var(--sa-space-5)",
      color: "var(--sa-paper-000)"
    }
  }, overlay)), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      font: "var(--sa-type-body)",
      fontSize: "var(--sa-text-xs)",
      color: "var(--sa-text-muted)"
    }
  }, caption));
}
Object.assign(__ds_scope, { MediaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/MediaFrame.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/PlaceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PLACE = {
  mexico: "var(--sa-place-mexico)",
  colombia: "var(--sa-place-colombia)",
  panama: "var(--sa-place-panama)",
  trinidad: "var(--sa-place-trinidad)",
  usa: "var(--sa-place-usa)",
  spain: "var(--sa-place-spain)",
  pennsburg: "var(--sa-place-pennsburg)"
};

/** A country stop on the life map: accent bar, city, country, years. */
function PlaceCard({
  place = "mexico",
  city,
  country,
  years,
  src,
  active,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const accent = PLACE[place] || PLACE.mexico;
  const raised = active || hover;
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    "aria-pressed": onClick ? !!active : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      gap: "var(--sa-space-4)",
      padding: "var(--sa-space-5)",
      border: "none",
      background: active ? "var(--sa-surface-card)" : "var(--sa-surface-sunken)",
      borderRadius: "var(--sa-radius-card)",
      cursor: onClick ? "pointer" : "default",
      overflow: "hidden",
      boxShadow: `inset 0 0 0 1px ${active ? "var(--sa-border-default)" : "var(--sa-border-hairline)"}, ${raised ? "var(--sa-shadow-2)" : "var(--sa-shadow-0)"}`,
      transform: raised ? "translateY(var(--sa-lift))" : "none",
      transition: "var(--sa-transition-control)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: accent,
      opacity: active ? 1 : 0.55
    }
  }), src && /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      aspectRatio: "3 / 2",
      objectFit: "cover",
      borderRadius: "var(--sa-radius-media)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-eyebrow)",
      letterSpacing: "var(--sa-tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--sa-text-muted)",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "map-pin",
    size: 12
  }), country), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sa-font-display)",
      fontSize: "var(--sa-text-xl)",
      lineHeight: "var(--sa-leading-snug)",
      letterSpacing: "var(--sa-tracking-tight)",
      color: "var(--sa-text-primary)"
    }
  }, city), years && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      color: "var(--sa-text-muted)",
      fontVariantNumeric: "tabular-nums"
    }
  }, years)), children && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--sa-type-body)",
      fontSize: "var(--sa-text-sm)",
      color: "var(--sa-text-secondary)",
      margin: 0
    }
  }, children));
}
Object.assign(__ds_scope, { PlaceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PlaceCard.jsx", error: String((e && e.message) || e) }); }

// components/typography/Quote.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pull quote: large serif italic with a coral rule and attribution. */
function Quote({
  children,
  attribution,
  meta,
  size = "md",
  style,
  ...rest
}) {
  const fs = size === "lg" ? "var(--sa-text-3xl)" : size === "sm" ? "var(--sa-text-lg)" : "var(--sa-text-2xl)";
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      display: "flex",
      gap: "var(--sa-space-6)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      background: "var(--sa-accent)",
      borderRadius: 1,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-4)"
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--sa-font-display)",
      fontSize: fs,
      fontStyle: "italic",
      fontWeight: "var(--sa-weight-regular)",
      lineHeight: "var(--sa-leading-snug)",
      letterSpacing: "var(--sa-tracking-tight)",
      color: "var(--sa-text-primary)",
      maxWidth: "34ch",
      textWrap: "pretty"
    }
  }, children), (attribution || meta) && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      font: "var(--sa-type-ui)",
      color: "var(--sa-text-muted)",
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, attribution && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--sa-text-secondary)"
    }
  }, attribution), meta && /*#__PURE__*/React.createElement("span", null, meta))));
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Quote.jsx", error: String((e && e.message) || e) }); }

// components/typography/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Eyebrow + serif title + optional lede. The standard opener for every page band. */
function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "start",
  level = 2,
  size = "md",
  action,
  style,
  ...rest
}) {
  const H = "h" + level;
  const fs = size === "lg" ? "var(--sa-text-4xl)" : size === "sm" ? "var(--sa-text-xl)" : "var(--sa-text-3xl)";
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-3)",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align === "center" ? "center" : "left",
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-eyebrow)",
      letterSpacing: "var(--sa-tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--sa-text-accent)",
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 1,
      background: "currentColor"
    }
  }), eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "var(--sa-space-8)",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(H, {
    style: {
      font: "var(--sa-type-title)",
      fontSize: fs,
      letterSpacing: "var(--sa-tracking-display)",
      color: "var(--sa-text-primary)",
      margin: 0,
      maxWidth: "22ch"
    }
  }, title), action), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      font: "var(--sa-type-lede)",
      color: "var(--sa-text-secondary)",
      maxWidth: "var(--sa-measure)",
      margin: 0
    }
  }, lede));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/typography/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A number that counts up when it scrolls into view, with a label beneath. */
function Stat({
  value,
  prefix = "",
  suffix = "",
  label,
  note,
  align = "start",
  duration = 900,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }
    let raf, start;
    const run = () => {
      const step = t => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / duration);
        setShown(value * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        run();
        io.disconnect();
      }
    }, {
      threshold: 0.4
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  const decimals = String(value).includes(".") ? String(value).split(".")[1].length : 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--sa-space-2)",
      alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align === "center" ? "center" : "left",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sa-font-display)",
      fontSize: "var(--sa-text-4xl)",
      lineHeight: "var(--sa-leading-tight)",
      letterSpacing: "var(--sa-tracking-display)",
      color: "var(--sa-text-primary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, prefix, shown.toFixed(decimals), suffix), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-ui)",
      textTransform: "uppercase",
      letterSpacing: "var(--sa-tracking-eyebrow)",
      fontSize: "var(--sa-text-2xs)",
      color: "var(--sa-text-muted)"
    }
  }, label), note && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--sa-type-body)",
      fontSize: "var(--sa-text-sm)",
      color: "var(--sa-text-secondary)",
      maxWidth: "24ch"
    }
  }, note));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/typography/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Academics.jsx
try { (() => {
(() => {
  const {
    Icon,
    Button,
    SectionHeading,
    TimelineItem,
    Card,
    Tag,
    Badge,
    SpiralRule
  } = window.SantiagoAguileraDesignSystem_983015;
  const ENTRIES = [{
    year: "2019",
    place: "panama",
    school: "isps",
    title: "SonoArte Panamá",
    where: "Ciudad de Panamá",
    body: "Percussion training and ensemble performance."
  }, {
    year: "2021",
    place: "trinidad",
    school: "isps",
    title: "Student Council",
    where: "ISPS, Port of Spain",
    body: "Elected representative; ran school-wide events and student feedback sessions.",
    tags: ["Leadership"]
  }, {
    year: "2022",
    place: "trinidad",
    school: "isps",
    title: "Stronger Together",
    where: "ISPS, Port of Spain",
    body: "Student-led initiative supporting classmates through the return to in-person school.",
    tags: ["Service"]
  }, {
    year: "2024",
    place: "usa",
    school: "perkiomen",
    title: "Model United Nations + GVMUN",
    where: "Perkiomen School",
    body: "Delegate at in-person and global virtual conferences; committee research and position papers.",
    tags: ["Debate", "Research"]
  }, {
    year: "2025",
    place: "usa",
    school: "perkiomen",
    title: "HOSA",
    where: "Perkiomen School",
    body: "Health-science competition, hospital shadowing and the club's outreach work.",
    tags: ["Health science"]
  }, {
    year: "2025",
    place: "usa",
    school: "perkiomen",
    title: "The Perkiomenite",
    where: "Perkiomen School",
    body: "Writing and editing for the school publication.",
    tags: ["Journalism"],
    last: true
  }];
  const CLUBS = [{
    title: "HOSA",
    where: "Perkiomen School",
    body: "Future health professionals — competitive events, outreach and shadowing.",
    tags: ["Health science", "Leadership"]
  }, {
    title: "Investment Club",
    where: "Perkiomen School",
    body: "Markets, pitches and a student-run portfolio.",
    tags: ["Finance"]
  }, {
    title: "GVMUN",
    where: "Global Virtual Model UN",
    body: "International committees run entirely online.",
    tags: ["Debate"]
  }, {
    title: "The Perkiomenite",
    where: "Perkiomen School",
    body: "School journalism — reporting, editing, layout.",
    tags: ["Journalism"]
  }, {
    title: "Stronger Together",
    where: "ISPS",
    body: "Peer support initiative built with the student council.",
    tags: ["Service"]
  }, {
    title: "Science Fair + Olympiad",
    where: "Perkiomen School",
    body: "Not written up yet — coming once the season is done.",
    coming: true
  }];
  const FILTERS = [["all", "Everything"], ["isps", "ISPS"], ["perkiomen", "Perkiomen"]];
  function Academics() {
    const [filter, setFilter] = React.useState("all");
    const rows = ENTRIES.filter(e => filter === "all" || e.school === filter);
    return /*#__PURE__*/React.createElement(window.Band, {
      tight: true
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Academics",
      title: "Academic journey",
      lede: "Two schools, one direction. Everything below happened in the country whose colour is on the rail."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-2)",
        marginTop: "var(--sa-space-8)"
      }
    }, FILTERS.map(([id, label]) => /*#__PURE__*/React.createElement(Tag, {
      key: id,
      onClick: () => setFilter(id),
      selected: filter === id
    }, label))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--sa-space-12)",
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "var(--sa-space-16)",
        alignItems: "start"
      }
    }, /*#__PURE__*/React.createElement("div", null, rows.map((e, n) => /*#__PURE__*/React.createElement(TimelineItem, {
      key: e.title,
      year: e.year,
      place: e.place,
      title: e.title,
      where: e.where,
      last: n === rows.length - 1,
      meta: e.tags ? e.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
        key: t,
        place: e.place
      }, t)) : null
    }, e.body))), /*#__PURE__*/React.createElement(Card, {
      tone: "sunken",
      eyebrow: "Research",
      title: "Current work",
      meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tag, null, "Medical app"), /*#__PURE__*/React.createElement(Badge, {
        tone: "highlight"
      }, "In progress")),
      footer: "Write-up to follow"
    }, "A hospital-facing project in design, plus shadowing hours that feed into it. Publications will be listed here as they land.")), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "var(--sa-space-16) 0"
      }
    }, /*#__PURE__*/React.createElement(SpiralRule, null)), /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Leadership & service",
      title: "Clubs and organisations",
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--sa-space-5)",
        marginTop: "var(--sa-space-8)"
      }
    }, CLUBS.map(c => /*#__PURE__*/React.createElement(Card, {
      key: c.title,
      interactive: !c.coming,
      eyebrow: c.where,
      title: c.title,
      meta: c.coming ? /*#__PURE__*/React.createElement(Badge, {
        tone: "highlight"
      }, "Coming soon") : c.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
        key: t
      }, t))
    }, c.body))));
  }
  Object.assign(window, {
    Academics
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Academics.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Beyond.jsx
try { (() => {
(() => {
  const {
    Icon,
    SectionHeading,
    Card,
    MediaFrame,
    Tag,
    Stat,
    Quote,
    SpiralRule
  } = window.SantiagoAguileraDesignSystem_983015;
  const PURSUITS = [{
    icon: "music",
    title: "Drums",
    body: "SonoArte Panamá, the ISPS musical, and the Perkiomen rock band. Three very different rooms, one kit.",
    tags: ["SonoArte Panamá", "ISPS musical", "Rock band"]
  }, {
    icon: "waves",
    title: "Varsity swimming",
    body: "Perkiomen School. Morning sets, meets, and the part of the day that keeps the rest of it in order.",
    tags: ["Varsity"]
  }, {
    icon: "dumbbell",
    title: "Weightlifting",
    body: "Olympic lifting — snatch and clean & jerk, programmed year-round.",
    tags: ["Olympic lifting"]
  }];
  const CURIOSITIES = [{
    icon: "languages",
    title: "French and Mandarin",
    body: "Two languages in progress, on top of Spanish and English."
  }, {
    icon: "book-open",
    title: "Manga",
    body: "Long series, read in order, usually late."
  }, {
    icon: "gamepad-2",
    title: "Video games",
    body: "Co-op, strategy, and whatever the group is playing."
  }];
  function Beyond() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(window.Band, {
      tight: true
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Beyond the classroom",
      title: "Drums, water, weight",
      lede: "Three commitments that have followed me across the five countries."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--sa-space-6)",
        marginTop: "var(--sa-space-12)"
      }
    }, PURSUITS.map(p => /*#__PURE__*/React.createElement(Card, {
      key: p.title,
      padding: "var(--sa-space-5)",
      media: /*#__PURE__*/React.createElement(MediaFrame, {
        ratio: "4 / 3",
        placeholder: `${p.title} — photo to be supplied`,
        radius: "0"
      }),
      title: /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: p.icon,
        size: 18
      }), p.title),
      meta: p.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
        key: t
      }, t))
    }, p.body)))), /*#__PURE__*/React.createElement(window.Band, {
      tone: "sunken",
      tight: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--sa-space-16)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Curiosities",
      title: "What I do with the rest of it",
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-space-6)",
        marginTop: "var(--sa-space-8)"
      }
    }, CURIOSITIES.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.title,
      style: {
        display: "flex",
        gap: "var(--sa-space-4)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--sa-text-accent)",
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: "var(--sa-type-heading)",
        fontSize: "var(--sa-text-md)",
        margin: 0
      }
    }, c.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: "var(--sa-type-body)",
        fontSize: "var(--sa-text-sm)",
        color: "var(--sa-text-secondary)",
        marginTop: 4
      }
    }, c.body)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-12)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      value: 4,
      label: "Languages"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: 3,
      label: "Bands played in"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: 5,
      label: "Countries"
    })))), /*#__PURE__*/React.createElement(window.Band, {
      tight: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--sa-space-16)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: "3 / 2",
      kind: "video",
      placeholder: "Rock band set \u2014 video to be supplied",
      caption: "Video to be supplied"
    }), /*#__PURE__*/React.createElement(Quote, {
      attribution: "On the drum kit"
    }, "Every school I joined had a room with a kit in it. That is how I met people.")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--sa-space-16)"
      }
    }, /*#__PURE__*/React.createElement(SpiralRule, null))));
  }
  Object.assign(window, {
    Beyond
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Beyond.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
(() => {
  const {
    Mark,
    Icon,
    SpiralRule,
    Button,
    Stat,
    SectionHeading,
    Quote,
    PlaceCard,
    Card,
    MediaFrame,
    Tag,
    Badge
  } = window.SantiagoAguileraDesignSystem_983015;
  const PLACES = [{
    id: "mexico",
    city: "Monterrey",
    country: "Mexico",
    years: "Born here",
    note: "Nuevo León. Where the family story starts."
  }, {
    id: "colombia",
    city: "Bogotá",
    country: "Colombia",
    years: "Early school",
    note: "First move I remember clearly."
  }, {
    id: "panama",
    city: "Ciudad de Panamá",
    country: "Panama",
    years: "Middle school",
    note: "SonoArte Panamá — where the drumming started."
  }, {
    id: "trinidad",
    city: "Port of Spain",
    country: "Trinidad & Tobago",
    years: "ISPS",
    note: "StuCo, Stronger Together, the school musical."
  }, {
    id: "usa",
    city: "Pennsburg, PA",
    country: "United States",
    years: "Perkiomen School",
    note: "HOSA, MUN, Investment Club, swimming, lifting."
  }];
  const Band = ({
    children,
    tone,
    tight,
    style
  }) => /*#__PURE__*/React.createElement("section", {
    className: tone === "ink" ? "sa-on-ink" : undefined,
    style: {
      background: tone === "ink" ? "var(--sa-ink-800)" : tone === "sunken" ? "var(--sa-surface-sunken)" : "var(--sa-surface-page)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--sa-page-max)",
      margin: "0 auto",
      padding: `${tight ? "var(--sa-band-y-tight)" : "var(--sa-band-y)"} var(--sa-gutter)`
    }
  }, children));
  function Home({
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        position: "relative",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        right: "-6%",
        top: "-18%",
        color: "var(--sa-paper-200)",
        opacity: 0.9,
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement(Mark, {
      variant: "spiral",
      size: 560,
      strokeWidth: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        maxWidth: "var(--sa-page-max)",
        margin: "0 auto",
        padding: "var(--sa-space-32) var(--sa-gutter) var(--sa-space-24)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--sa-type-eyebrow)",
        letterSpacing: "var(--sa-tracking-eyebrow)",
        textTransform: "uppercase",
        color: "var(--sa-text-accent)"
      }
    }, "Monterrey \u2192 Bogot\xE1 \u2192 Panam\xE1 \u2192 Port of Spain \u2192 Pennsburg"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: "var(--sa-type-display)",
        fontSize: "var(--sa-text-6xl)",
        letterSpacing: "var(--sa-tracking-display)",
        margin: "var(--sa-space-5) 0 0",
        maxWidth: "18ch"
      }
    }, "Santiago Aguilera"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: "var(--sa-type-lede)",
        fontSize: "var(--sa-text-lg)",
        color: "var(--sa-text-secondary)",
        maxWidth: "46ch",
        marginTop: "var(--sa-space-6)"
      }
    }, "I am a student across five countries \u2014 health science, model UN, a drum kit and a swim lane. This is the whole picture, in order."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-3)",
        marginTop: "var(--sa-space-10)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      onClick: () => onNavigate("places"),
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right"
      })
    }, "Walk the timeline"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "secondary",
      onClick: () => onNavigate("academics")
    }, "Academics")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-16)",
        marginTop: "var(--sa-space-24)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Stat, {
      value: 5,
      label: "Countries lived in"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: 4,
      label: "Languages",
      note: "Spanish, English, French, Mandarin"
    }), /*#__PURE__*/React.createElement(Stat, {
      value: 2,
      label: "Schools",
      note: "ISPS and Perkiomen"
    })))), /*#__PURE__*/React.createElement(Band, {
      tone: "sunken",
      tight: true
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Who am I",
      title: "Five countries, one timeline",
      lede: "Every place added something \u2014 a language, an instrument, a way of reading a room.",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        onClick: () => onNavigate("places"),
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "arrow-right"
        })
      }, "All places")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "var(--sa-space-4)",
        marginTop: "var(--sa-space-10)"
      }
    }, PLACES.map(p => /*#__PURE__*/React.createElement(PlaceCard, {
      key: p.id,
      place: p.id,
      city: p.city,
      country: p.country,
      years: p.years,
      onClick: () => onNavigate("places")
    }, p.note)))), /*#__PURE__*/React.createElement(Band, {
      tight: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: "var(--sa-space-16)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: "4 / 3",
      placeholder: "Portrait \u2014 to be supplied",
      caption: "Photo to be supplied"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-space-6)"
      }
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "What I care about",
      title: "Medicine, and the people around it",
      size: "sm",
      lede: "Health science pulled me in through HOSA and hospital shadowing. The rest \u2014 MUN, journalism, the investment club \u2014 taught me how to explain what I find."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-2)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Tag, null, "Health science"), /*#__PURE__*/React.createElement(Tag, null, "Research"), /*#__PURE__*/React.createElement(Tag, null, "Debate"), /*#__PURE__*/React.createElement(Tag, null, "Journalism"), /*#__PURE__*/React.createElement(Tag, null, "Service")), /*#__PURE__*/React.createElement(Quote, {
      size: "sm",
      attribution: "From my application essay"
    }, "Moving five times taught me to read a room before I speak in it.")))), /*#__PURE__*/React.createElement(Band, {
      tone: "ink",
      tight: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--sa-space-12)",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Media",
      title: "Photos and video, once they are in",
      size: "sm",
      lede: "Swim meets, the rock band, the cities. Placeholders until the files are uploaded."
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      onClick: () => onNavigate("media"),
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right"
      })
    }, "See the media"))), /*#__PURE__*/React.createElement(Band, {
      tight: true
    }, /*#__PURE__*/React.createElement(SpiralRule, null)));
  }
  Object.assign(window, {
    Home,
    Band,
    PLACES
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Media.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    SectionHeading,
    MediaFrame,
    Tag,
    Badge
  } = window.SantiagoAguileraDesignSystem_983015;
  const ITEMS = [{
    id: 1,
    kind: "video",
    ratio: "16 / 9",
    label: "Rock band set, Perkiomen",
    tag: "Music",
    span: 2
  }, {
    id: 2,
    kind: "photo",
    ratio: "3 / 4",
    label: "Swim meet, 2025",
    tag: "Swimming"
  }, {
    id: 3,
    kind: "photo",
    ratio: "4 / 3",
    label: "Bogotá",
    tag: "Colombia"
  }, {
    id: 4,
    kind: "photo",
    ratio: "4 / 3",
    label: "Port of Spain",
    tag: "Trinidad"
  }, {
    id: 5,
    kind: "video",
    ratio: "16 / 9",
    label: "MUN committee session",
    tag: "MUN"
  }, {
    id: 6,
    kind: "photo",
    ratio: "1 / 1",
    label: "SonoArte Panamá",
    tag: "Panama"
  }, {
    id: 7,
    kind: "photo",
    ratio: "4 / 3",
    label: "Lifting session",
    tag: "Lifting"
  }, {
    id: 8,
    kind: "photo",
    ratio: "3 / 4",
    label: "Monterrey",
    tag: "Mexico"
  }];
  const FILTERS = ["Everything", "Photos", "Video"];
  function Media() {
    const [filter, setFilter] = React.useState("Everything");
    const [open, setOpen] = React.useState(null);
    const shown = ITEMS.filter(i => filter === "Everything" || (filter === "Video" ? i.kind === "video" : i.kind === "photo"));
    return /*#__PURE__*/React.createElement(window.Band, {
      tight: true
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Media",
      title: "Photos and video",
      lede: "Every slot below is waiting on a real file. The captions say what belongs in each one.",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "highlight"
      }, "Placeholders")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-2)",
        marginTop: "var(--sa-space-8)"
      }
    }, FILTERS.map(f => /*#__PURE__*/React.createElement(Tag, {
      key: f,
      onClick: () => setFilter(f),
      selected: filter === f
    }, f))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "var(--sa-space-4)",
        marginTop: "var(--sa-space-10)"
      }
    }, shown.map(i => /*#__PURE__*/React.createElement("div", {
      key: i.id,
      onClick: () => setOpen(i),
      style: {
        gridColumn: i.span ? `span ${i.span}` : undefined,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: i.ratio,
      kind: i.kind,
      placeholder: i.label,
      caption: i.label
    })))), open && /*#__PURE__*/React.createElement("div", {
      onClick: () => setOpen(null),
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "rgba(8,40,42,.72)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: "var(--sa-space-12)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: "min(880px, 100%)",
        background: "var(--sa-surface-card)",
        borderRadius: "var(--sa-radius-lg)",
        padding: "var(--sa-space-5)",
        boxShadow: "var(--sa-shadow-3)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "var(--sa-space-4)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--sa-type-ui)",
        color: "var(--sa-text-muted)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: open.kind === "video" ? "play" : "camera",
      size: 15
    }), open.tag), /*#__PURE__*/React.createElement(IconButton, {
      label: "Close",
      onClick: () => setOpen(null)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x"
    }))), /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: open.kind === "video" ? "16 / 9" : "4 / 3",
      kind: open.kind,
      placeholder: open.label
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: "var(--sa-type-body)",
        fontSize: "var(--sa-text-sm)",
        color: "var(--sa-text-secondary)",
        marginTop: "var(--sa-space-4)"
      }
    }, open.label, " \u2014 file to be supplied."))));
  }
  Object.assign(window, {
    Media
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Media.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Places.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    Button,
    SectionHeading,
    PlaceCard,
    MediaFrame,
    Tag,
    Quote
  } = window.SantiagoAguileraDesignSystem_983015;
  const DETAIL = {
    mexico: {
      title: "Monterrey, Nuevo León",
      body: "Where the family is from and where the story starts. Spanish first, everything else after.",
      tags: ["Family", "Spanish"]
    },
    colombia: {
      title: "Bogotá",
      body: "The first move I remember clearly — a new school, a new altitude, and the first time I had to introduce myself twice.",
      tags: ["Early school", "Altitude"]
    },
    panama: {
      title: "Ciudad de Panamá",
      body: "SonoArte Panamá put me behind a drum kit. Panama is where music stopped being a class and became a habit.",
      tags: ["SonoArte Panamá", "Drums"]
    },
    trinidad: {
      title: "Port of Spain",
      body: "International School of Port of Spain: student council, Stronger Together, and the school musical. The place where I started leading things instead of joining them.",
      tags: ["ISPS", "StuCo", "Stronger Together"]
    },
    usa: {
      title: "Pennsburg, Pennsylvania",
      body: "Perkiomen School — HOSA, Model UN and GVMUN, the Investment Club, the Perkiomenite, varsity swimming and Olympic lifting.",
      tags: ["Perkiomen School", "HOSA", "MUN", "Swimming"]
    }
  };
  function Places() {
    const [i, setI] = React.useState(3);
    const place = window.PLACES[i];
    const d = DETAIL[place.id];
    const go = n => setI((i + n + window.PLACES.length) % window.PLACES.length);
    return /*#__PURE__*/React.createElement(window.Band, {
      tight: true
    }, /*#__PURE__*/React.createElement(SectionHeading, {
      eyebrow: "Who am I",
      title: "Places I have lived",
      lede: "In order, not in ranking. Use the cities on the left, or step through with the arrows."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "var(--sa-space-12)",
        marginTop: "var(--sa-space-12)",
        alignItems: "start"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-space-3)"
      }
    }, window.PLACES.map((p, n) => /*#__PURE__*/React.createElement(PlaceCard, {
      key: p.id,
      place: p.id,
      city: p.city,
      country: p.country,
      years: p.years,
      active: n === i,
      onClick: () => setI(n)
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-space-6)"
      }
    }, /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: "16 / 9",
      placeholder: `${place.city} — photo to be supplied`,
      scrim: false
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "var(--sa-space-8)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-space-4)"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: "var(--sa-type-title)",
        letterSpacing: "var(--sa-tracking-display)",
        margin: 0
      }
    }, d.title), /*#__PURE__*/React.createElement("p", {
      style: {
        font: "var(--sa-type-body)",
        color: "var(--sa-text-secondary)",
        maxWidth: "58ch"
      }
    }, d.body), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-2)",
        flexWrap: "wrap"
      }
    }, d.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
      key: t,
      place: place.id
    }, t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: "var(--sa-space-2)",
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      label: "Previous place",
      variant: "outline",
      size: "lg",
      onClick: () => go(-1)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left"
    })), /*#__PURE__*/React.createElement(IconButton, {
      label: "Next place",
      variant: "outline",
      size: "lg",
      onClick: () => go(1)
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        alignItems: "center"
      }
    }, window.PLACES.map((p, n) => /*#__PURE__*/React.createElement("span", {
      key: p.id,
      style: {
        height: 3,
        flex: n === i ? 3 : 1,
        borderRadius: 2,
        background: n === i ? `var(--sa-place-${p.id})` : "var(--sa-border-hairline)",
        transition: "all var(--sa-dur-3) var(--sa-ease-out)"
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "var(--sa-space-16)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--sa-space-12)",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Quote, {
      attribution: "Why the timeline",
      meta: "Site plan"
    }, "The point of a life map is that nothing on it stands alone."), /*#__PURE__*/React.createElement(MediaFrame, {
      ratio: "3 / 2",
      placeholder: "Map or scan of the five cities \u2014 to be supplied"
    })));
  }
  Object.assign(window, {
    Places
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Places.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Mark = __ds_scope.Mark;

__ds_ns.SpiralRule = __ds_scope.SpiralRule;

__ds_ns.TimelineItem = __ds_scope.TimelineItem;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MediaFrame = __ds_scope.MediaFrame;

__ds_ns.PlaceCard = __ds_scope.PlaceCard;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Stat = __ds_scope.Stat;

})();
