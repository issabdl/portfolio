document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bg-grid") || document.querySelector(".container");
  if (!container) return;

  const BOX_SIZE = 64;
  const THRESHOLD = 110;
  const THRESHOLD_SQ = THRESHOLD * THRESHOLD;

  let boxes = [];

  const buildGrid = () => {
    const rect = container.getBoundingClientRect();
    const cols = Math.max(1, Math.ceil(rect.width / BOX_SIZE));
    const rows = Math.max(1, Math.ceil(rect.height / BOX_SIZE));
    const targetCount = cols * rows;

    if (boxes.length === targetCount) return;

    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < targetCount; i += 1) {
      const box = document.createElement("div");
      box.className = "box";
      frag.appendChild(box);
    }
    container.appendChild(frag);
    boxes = Array.from(container.querySelectorAll(".box"));
  };

  const highlight = (clientX, clientY) => {
    if (boxes.length === 0) return;

    for (const b of boxes) b.classList.remove("highlight");

    for (const b of boxes) {
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 < THRESHOLD_SQ) b.classList.add("highlight");
    }
  };

  let rafId = null;
  let lastX = 0;
  let lastY = 0;

  const onMove = (e) => {
    lastX = e.clientX;
    lastY = e.clientY;

    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = null;
      highlight(lastX, lastY);
    });
  };

  const debounce = (fn, waitMs) => {
    let t = null;
    return () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(fn, waitMs);
    };
  };

  const onResize = debounce(() => {
    buildGrid();
    highlight(lastX, lastY);
  }, 150);

  buildGrid();
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onMove, { passive: true });
});
