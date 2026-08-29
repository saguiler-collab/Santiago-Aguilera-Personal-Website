/**
 * Single source of truth for the profile links shown in every page footer.
 *
 * These used to be copy-pasted into all 30-odd pages, which is why all three had
 * quietly rotted to href="#", the Footer component's fallback. Edit them here and
 * every page updates at once.
 *
 * An entry with an empty href is dropped rather than rendered: an icon that looks
 * clickable and goes nowhere reads worse to a university or an employer than no
 * icon at all. Fill a href in and that icon reappears site-wide. Order here is the
 * order they appear in.
 *
 * The footer draws each glyph from the id, so the ids are the list of what it knows:
 * linkedin, instagram, github, youtube, spotify, discord, email. For email the href
 * is a mailto: link. An id it does not recognise is dropped rather than drawn blank.
 *
 * With all of them empty the whole row is hidden and the footer closes up around it,
 * which is why there is no gap there right now.
 */
(function () {
  "use strict";

  var SOCIALS = [
    { id: "linkedin", label: "LinkedIn", href: "" },
    { id: "instagram", label: "Instagram", href: "" },
    { id: "github", label: "GitHub", href: "" },
    { id: "youtube", label: "YouTube", href: "" },
    { id: "spotify", label: "Spotify", href: "" },
    { id: "discord", label: "Discord", href: "" },
    { id: "email", label: "Email", href: "" }
  ];

  window.SA_SOCIALS = SOCIALS.filter(function (s) {
    return typeof s.href === "string" && s.href.trim() !== "";
  });
})();
