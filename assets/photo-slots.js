(function () {
  "use strict";
  var EDIT_KEY = "sa:photos:edit";
  var IMG_PREFIX = "sa:img:";
  var MAX_EDGE = 1400;
  var JPEG_QUALITY = 0.82;
  var PHOTOS_DIR = "assets/photos/";

  // Real, committed image files always win over a browser-local upload preview.
  // assets/photos/manifest.json maps a slot's key to a filename that's actually been
  // saved into the repo, that's the only way a static site with no backend gets an
  // upload to "stick" for every visitor instead of just the browser that uploaded it.
  var manifestPromise = fetch(PHOTOS_DIR + "manifest.json")
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; });

  // Editing is off for everyone by default. This is a public portfolio going to
  // universities and employers. A visitor should never see an upload affordance,
  // and previously every page shipped one plus a fixed "Photos editable" button.
  //
  // Santiago turns it on by adding ?edit=1 to any page. It then persists for the
  // rest of the browser session (sessionStorage, not localStorage) so navigating
  // between pages keeps editing on without re-adding the parameter; ?edit=0 or
  // closing the tab ends it.
  function isEditMode() {
    try {
      var param = new URLSearchParams(location.search).get("edit");
      if (param === "1") { sessionStorage.setItem(EDIT_KEY, "1"); return true; }
      if (param === "0") { sessionStorage.removeItem(EDIT_KEY); return false; }
      return sessionStorage.getItem(EDIT_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function exitEditMode() {
    try { sessionStorage.removeItem(EDIT_KEY); } catch (e) {}
    window.dispatchEvent(new CustomEvent("sa:edit-changed"));
  }

  function readImage(key) {
    try { return localStorage.getItem(IMG_PREFIX + key); } catch (e) { return null; }
  }

  function removeImage(key) {
    try { localStorage.removeItem(IMG_PREFIX + key); } catch (e) {}
  }

  function drawToDataUrl(source, w, h) {
    var scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement("canvas");
    canvas.width = cw; canvas.height = ch;
    canvas.getContext("2d").drawImage(source, 0, 0, cw, ch);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  }

  function resizeViaImageEl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = function () { reject(reader.error); };
      reader.onload = function () {
        var img = new Image();
        img.onload = function () { resolve(drawToDataUrl(img, img.naturalWidth, img.naturalHeight)); };
        img.onerror = function () { reject(new Error("Could not read image")); };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // createImageBitmap + imageOrientation:"from-image" bakes in EXIF rotation, which a
  // plain <img> + canvas draw does not. Without it, phone photos taken in portrait
  // often come out sideways.
  function resizeToDataUrl(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: "from-image" }).then(function (bitmap) {
        var url = drawToDataUrl(bitmap, bitmap.width, bitmap.height);
        if (bitmap.close) bitmap.close();
        return url;
      }).catch(function () { return resizeViaImageEl(file); });
    }
    return resizeViaImageEl(file);
  }

  var STYLE = [
    ":host{display:block}",
    ".box{position:relative;aspect-ratio:var(--ratio,4 / 3);overflow:hidden;",
    "border-radius:var(--sa-radius-media,4px);background:var(--sa-surface-tint,#EDE4D5);",
    "box-shadow:inset 0 0 0 1px var(--sa-border-hairline,rgba(8,40,42,.12))}",
    ".box.editable:not(.has-img){cursor:pointer}",
    ".empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;",
    "gap:8px;color:var(--sa-text-faint,#86A3A3);padding:var(--sa-space-4,16px);text-align:center;",
    "transition:transform .2s var(--sa-ease-out,ease),color .2s var(--sa-ease-out,ease)}",
    ".empty svg{width:20px;height:20px;flex:none}",
    ".box.compact .empty{gap:0;padding:2px}",
    ".box.compact .empty svg{width:13px;height:13px;opacity:.75}",
    ".empty .cap{font:var(--sa-type-ui,500 13px/1.3 sans-serif);font-size:var(--sa-text-xs,13px);",
    "letter-spacing:var(--sa-tracking-wide,.04em);max-width:22ch}",
    ".box.editable:hover .empty{transform:scale(1.04);color:var(--sa-text-accent,#B2412A)}",
    ".ring{position:absolute;inset:6px;border-radius:inherit;border:1.5px dashed currentColor;opacity:0;",
    "transition:opacity .2s;pointer-events:none;color:var(--sa-text-accent,#B2412A)}",
    ".box.editable:hover .ring,.box.editable:focus-visible .ring{opacity:.55}",
    "img.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}",
    ".overlay{position:absolute;inset:0;display:none;align-items:flex-end;justify-content:flex-end;gap:6px;padding:8px;",
    "opacity:0;transition:opacity .18s var(--sa-ease-out,ease);",
    "background:linear-gradient(to top,rgba(8,40,42,.55),rgba(8,40,42,0) 55%)}",
    ".box.has-img.editable:hover .overlay,.box.has-img.editable:focus-within .overlay{opacity:1}",
    "button.chip{font:var(--sa-type-ui,500 12px/1 sans-serif);font-size:11px;border:none;border-radius:999px;",
    "padding:6px 10px;background:rgba(253,251,247,.92);color:#08282A;cursor:pointer}",
    "button.chip:hover{background:#fff}",
    "input[type=file]{display:none}",
    ".err{position:absolute;left:6px;right:6px;bottom:6px;font-size:11px;background:#B2412A;color:#fff;",
    "padding:6px 8px;border-radius:6px}"
  ].join("");

  var CAMERA_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8A1.5 1.5 0 0 1 9 4.5h6a1.5 1.5 0 0 1 1.3.7L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg>';

  class SaImageSlot extends HTMLElement {
    static get observedAttributes() { return ["placeholder", "ratio", "compact"]; }

    connectedCallback() {
      if (this._built) { this._render(); return; }
      this._built = true;
      // note: the attribute is "slot-key", not "key". "key" is a reserved React prop
      // name, and this element is instantiated via React.createElement in this codebase's
      // template runtime, so a plain "key" attribute is consumed by React and never reaches
      // the DOM at all (getAttribute("key") is always null).
      this._key = this.getAttribute("slot-key") || ("slot-" + Math.random().toString(36).slice(2));
      this._committed = null;
      manifestPromise.then((manifest) => {
        var file = manifest[this._key];
        if (file) { this._committed = PHOTOS_DIR + file; this._paint(); }
      });

      var root = this.attachShadow({ mode: "open" });
      var style = document.createElement("style");
      style.textContent = STYLE;
      root.appendChild(style);

      this._box = document.createElement("div");
      this._box.className = "box";
      this._box.tabIndex = -1;

      this._img = document.createElement("img");
      this._img.className = "photo";
      this._img.hidden = true;

      this._empty = document.createElement("div");
      this._empty.className = "empty";
      this._empty.innerHTML = CAMERA_SVG + '<span class="cap"></span>';
      this._cap = this._empty.querySelector(".cap");

      this._ring = document.createElement("div");
      this._ring.className = "ring";

      this._overlay = document.createElement("div");
      this._overlay.className = "overlay";
      this._replaceBtn = document.createElement("button");
      this._replaceBtn.type = "button"; this._replaceBtn.className = "chip"; this._replaceBtn.textContent = "Replace";
      this._removeBtn = document.createElement("button");
      this._removeBtn.type = "button"; this._removeBtn.className = "chip"; this._removeBtn.textContent = "Remove";
      this._overlay.appendChild(this._replaceBtn);
      this._overlay.appendChild(this._removeBtn);

      this._input = document.createElement("input");
      this._input.type = "file"; this._input.accept = "image/*";

      this._box.appendChild(this._img);
      this._box.appendChild(this._empty);
      this._box.appendChild(this._ring);
      this._box.appendChild(this._overlay);
      this._box.appendChild(this._input);
      root.appendChild(this._box);

      // Clicking the photo itself does nothing on purpose. Pages that wrap a slot in a
      // lightbox (Media) get to own that click. Editing only happens through the empty
      // state or the explicit Replace/Remove chips.
      this._empty.addEventListener("click", () => { if (this._editable()) this._input.click(); });
      this._box.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && this._editable() && this._img.hidden) {
          e.preventDefault(); this._input.click();
        }
      });
      this._replaceBtn.addEventListener("click", (e) => { e.stopPropagation(); this._input.click(); });
      this._removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeImage(this._key);
        this._paint();
      });
      this._input.addEventListener("click", (e) => e.stopPropagation());
      this._input.addEventListener("change", () => {
        var file = this._input.files && this._input.files[0];
        this._input.value = "";
        if (!file) return;
        resizeToDataUrl(file).then((dataUrl) => {
          try {
            localStorage.setItem(IMG_PREFIX + this._key, dataUrl);
            this._paint();
          } catch (err) {
            this._showError("Storage is full. Remove another photo or use a smaller image.");
          }
        }).catch(() => this._showError("Could not read that image."));
      });

      this._onEditChange = () => this._paint();
      window.addEventListener("sa:edit-changed", this._onEditChange);
      window.addEventListener("storage", this._onEditChange);

      this._render();
    }

    disconnectedCallback() {
      window.removeEventListener("sa:edit-changed", this._onEditChange);
      window.removeEventListener("storage", this._onEditChange);
    }

    attributeChangedCallback() { if (this._built) this._render(); }

    _editable() { return isEditMode() && !this._committed; }

    _render() {
      var compact = this.hasAttribute("compact");
      this._box.classList.toggle("compact", compact);
      this._cap.textContent = compact ? "" : (this.getAttribute("placeholder") || "Photo to be supplied");
      this._cap.style.display = compact ? "none" : "";
      this._img.alt = this.getAttribute("placeholder") || "";
      this._box.style.setProperty("--ratio", this.getAttribute("ratio") || "4 / 3");
      this._paint();
    }

    _paint() {
      var editable = this._editable();
      var data = this._committed || readImage(this._key);
      this._box.classList.toggle("editable", editable);
      this._box.classList.toggle("has-img", !!data);
      this._box.tabIndex = editable && !data ? 0 : -1;
      if (data) {
        this._img.src = data; this._img.hidden = false; this._empty.style.display = "none";
        this._overlay.style.display = editable ? "flex" : "none";
      } else {
        this._img.hidden = true; this._img.removeAttribute("src"); this._empty.style.display = "flex";
        this._overlay.style.display = "none";
      }
    }

    _showError(msg) {
      var el = this.shadowRoot.querySelector(".err");
      if (!el) { el = document.createElement("div"); el.className = "err"; this._box.appendChild(el); }
      el.textContent = msg;
      clearTimeout(this._errT);
      this._errT = setTimeout(() => el.remove(), 4000);
    }
  }

  if (!customElements.get("sa-image-slot")) customElements.define("sa-image-slot", SaImageSlot);

  // Shown only in edit mode. The warning is the point: uploads live in this browser's
  // localStorage, so they are a private preview, they do not exist for anyone else and
  // they vanish if the browser clears its storage. Without saying so, it is very easy to
  // fill in every slot, see a finished-looking site, and publish 161 empty boxes.
  // Author-only notes ("still to add" prompts) are revealed by this class rather than
  // shipped to visitors. Without it those blocks published a to-do list addressed to
  // Santiago on a page a university might be reading.
  function markEditing() {
    document.documentElement.classList.toggle("sa-editing", isEditMode());
  }

  function injectEditBanner() {
    markEditing();
    if (!isEditMode() || document.getElementById("sa-edit-banner")) return;

    var bar = document.createElement("div");
    bar.id = "sa-edit-banner";
    Object.assign(bar.style, {
      // bottom-left, not bottom-right: the Footer's social icon links sit bottom-right,
      // and a fixed corner widget there would visually block them once scrolled that far.
      position: "fixed", left: "16px", bottom: "16px", zIndex: "50", maxWidth: "min(380px, calc(100vw - 32px))",
      font: "500 12px/1.45 var(--sa-font-body, sans-serif)", letterSpacing: ".01em",
      padding: "12px 14px", borderRadius: "10px",
      background: "var(--sa-ink-800, #0F3D3E)", color: "var(--sa-paper-000, #FDFBF7)",
      boxShadow: "var(--sa-shadow-2, 0 10px 24px -8px rgba(0,0,0,.3))",
      display: "flex", gap: "12px", alignItems: "flex-start"
    });

    var text = document.createElement("div");
    text.style.flex = "1";
    text.innerHTML =
      '<strong style="display:block;margin-bottom:3px">Editing photos</strong>' +
      'Uploads are saved in this browser only. To publish one, put the file in ' +
      '<code style="font-size:11px">assets/photos/</code> and map its slot key in ' +
      '<code style="font-size:11px">manifest.json</code>.';

    var exit = document.createElement("button");
    exit.type = "button";
    exit.textContent = "Done";
    Object.assign(exit.style, {
      font: "500 12px/1 var(--sa-font-body, sans-serif)", border: "none", cursor: "pointer",
      padding: "7px 12px", borderRadius: "999px", flex: "none",
      background: "var(--sa-paper-000, #FDFBF7)", color: "var(--sa-ink-800, #0F3D3E)"
    });
    exit.addEventListener("click", function () {
      exitEditMode();
      markEditing();
      bar.remove();
    });

    bar.appendChild(text);
    bar.appendChild(exit);
    document.body.appendChild(bar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectEditBanner);
  } else {
    injectEditBanner();
  }
})();
