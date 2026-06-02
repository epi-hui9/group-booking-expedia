// Capture-only overlay injected into the page during demo recording.
// It is NEVER bundled into the app — it is added by Playwright at capture
// time only. It provides: a virtual cursor, click ripples, a smooth camera
// (zoom/pan via a transform on #root), and an optional spotlight.
//
// Exposes window.__cap with async helpers the capture script drives.
(() => {
  if (window.__cap) return;

  const install = () => {
    const root = document.getElementById("root");
    if (!root) return false;

    const VW = () => window.innerWidth;
    const VH = () => window.innerHeight;

    // Camera state (applied to #root).
    let s = 1;
    let tx = 0;
    let ty = 0;
    root.style.transformOrigin = "0 0";
    root.style.transition = "transform 950ms cubic-bezier(.4,0,.2,1)";
    root.style.willChange = "transform";

    const layer = document.createElement("div");
    layer.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;pointer-events:none;overflow:hidden;";
    document.body.appendChild(layer);

    // Spotlight (radial dim around a focal point).
    const spot = document.createElement("div");
    spot.style.cssText =
      "position:fixed;inset:0;opacity:0;transition:opacity 550ms ease;pointer-events:none;";
    layer.appendChild(spot);

    // Virtual cursor.
    const cursor = document.createElement("div");
    cursor.style.cssText =
      "position:fixed;left:0;top:0;width:30px;height:30px;will-change:left,top,transform;" +
      "transition:left 720ms cubic-bezier(.45,0,.2,1),top 720ms cubic-bezier(.45,0,.2,1),transform 140ms ease;" +
      "filter:drop-shadow(0 3px 5px rgba(13,20,33,.4));";
    cursor.innerHTML =
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff" stroke="#0D1421" stroke-width="1.3" stroke-linejoin="round">' +
      '<path d="M5 2.5l15 8.6-6.4 1.4L10 19.5 5 2.5z"/></svg>';
    let curX = VW() * 0.5;
    let curY = VH() * 0.62;
    cursor.style.left = curX + "px";
    cursor.style.top = curY + "px";
    cursor.style.transform = "translate(-3px,-2px)";
    layer.appendChild(cursor);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const applyCamera = () => {
      root.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
    };

    window.__cap = {
      async cursorTo(x, y, ms = 760) {
        curX = x;
        curY = y;
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";
        await sleep(ms);
      },
      async ripple(x, y) {
        const r = document.createElement("div");
        r.style.cssText =
          `position:fixed;left:${x}px;top:${y}px;width:16px;height:16px;border-radius:9999px;` +
          "transform:translate(-50%,-50%) scale(.35);background:rgba(22,104,227,.30);" +
          "border:2.5px solid rgba(22,104,227,.95);opacity:.95;" +
          "transition:transform 520ms cubic-bezier(.2,.7,.2,1),opacity 520ms ease-out;";
        layer.appendChild(r);
        cursor.style.transform = "translate(-3px,-2px) scale(.82)";
        requestAnimationFrame(() => {
          r.style.transform = "translate(-50%,-50%) scale(3.6)";
          r.style.opacity = "0";
        });
        await sleep(150);
        cursor.style.transform = "translate(-3px,-2px) scale(1)";
        await sleep(380);
        r.remove();
      },
      async focus(rect, scale, ms = 980) {
        const ccx = rect.x + rect.width / 2;
        const ccy = rect.y + rect.height / 2;
        // Convert current screen focal point to layout coords.
        const lx = (ccx - tx) / s;
        const ly = (ccy - ty) / s;
        s = scale;
        tx = VW() / 2 - scale * lx;
        ty = VH() / 2 - scale * ly;
        applyCamera();
        await sleep(ms);
      },
      async reset(ms = 980) {
        s = 1;
        tx = 0;
        ty = 0;
        applyCamera();
        await sleep(ms);
      },
      async spotlight(rect) {
        const ccx = rect.x + rect.width / 2;
        const ccy = rect.y + rect.height / 2;
        const rad = Math.max(rect.width, rect.height) * 0.75 + 140;
        spot.style.background =
          `radial-gradient(circle ${rad}px at ${ccx}px ${ccy}px,` +
          " rgba(13,20,33,0) 55%, rgba(13,20,33,.42) 100%)";
        spot.style.opacity = "1";
        await sleep(550);
      },
      async clearSpotlight() {
        spot.style.opacity = "0";
        await sleep(550);
      },
      async hideCursor() {
        cursor.style.transition = "opacity 300ms ease";
        cursor.style.opacity = "0";
        await sleep(320);
      },
      async showCursor() {
        cursor.style.opacity = "1";
        await sleep(120);
      },
    };
    return true;
  };

  if (!install()) {
    const id = setInterval(() => {
      if (install()) clearInterval(id);
    }, 50);
  }
})();
