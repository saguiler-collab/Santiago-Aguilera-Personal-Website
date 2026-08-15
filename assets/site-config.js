/**
 * Single source of truth for the profile links shown in every page footer.
 *
 * These used to be copy-pasted into all 30-odd pages, which is why all three had
 * quietly rotted to href="#" — the Footer component's fallback. Edit them here and
 * every page updates at once.
 *
 * An entry with an empty href is dropped rather than rendered: an icon that looks
 * clickable and goes nowhere reads worse to a university or an employer than no
 * icon at all. Fill a href in and that icon reappears site-wide.
 */
(function () {
  "use strict";

  var SOCIALS = [
    { id: "instagram", label: "Instagram", href: "" },
    { id: "linkedin", label: "LinkedIn", href: "", src: "assets/icons/brand/linkedin.svg" },
    { id: "discord", label: "Discord", href: "" }
  ];

  window.SA_SOCIALS = SOCIALS.filter(function (s) {
    return typeof s.href === "string" && s.href.trim() !== "";
  });
})();
