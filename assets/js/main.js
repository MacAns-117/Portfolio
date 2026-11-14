(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shot = new URLSearchParams(location.search).has("shot");
  const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const params = new URLSearchParams(location.search);
  const themeParam = params.get("theme");
  const saved = localStorage.getItem("theme");
  if (themeParam === "light" || themeParam === "dark") root.dataset.theme = themeParam;
  else if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  else root.dataset.theme = "dark";

  const themeBtn = document.getElementById("theme-toggle");
  const syncThemeBtn = () => {
    const light = root.dataset.theme === "light";
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(light));
      themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
      themeBtn.title = light ? "Dark theme" : "Light theme";
    }
  };
  syncThemeBtn();
  themeBtn?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", root.dataset.theme);
    syncThemeBtn();
  });

  const menuBtn = document.getElementById("menu");
  const drawer = document.getElementById("drawer");
  menuBtn?.addEventListener("click", () => {
    const open = drawer.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  drawer?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      menuBtn?.setAttribute("aria-expanded", "false");
    })
  );

  /* Intro */
  const intro = document.getElementById("intro");
  const finishIntro = () => {
    intro?.classList.add("is-done");
    intro?.setAttribute("aria-hidden", "true");
    window.setTimeout(() => document.documentElement.classList.add("intro-gone"), 800);
  };
  if (!intro || reduce || shot) finishIntro();
  else window.setTimeout(finishIntro, 1600);

  /* Typed hero */
  const term = document.getElementById("term-body");
  const lines = [
    { html: '<span class="prompt">)_ ./portfolio.sh</span>' },
    { html: '<span class="prompt">~ $ whoami</span>' },
    { html: '<span class="key">Name:</span> Maqsood Ahmed Ansari' },
    { html: '<span class="key">Role:</span> Python Developer · GenAI / RAG · Data' },
    { html: '<span class="key">Location:</span> Hyderabad, India · Remote' },
    { html: '<span class="key">Focus:</span> RAG chatbots, data analysis, Django &amp; FastAPI' },
    { html: '<span class="key">Status:</span> open to freelance &amp; remote roles' },
  ];
  // The prompt uses )_ as a stand-in; replaced below with >_
  lines[0].html = '<span class="prompt">&gt;_ ./portfolio.sh</span>';

  const renderLine = (item, done, withCursor) => {
    const div = document.createElement("div");
    if (done) div.className = "done";
    div.innerHTML = item.html + (withCursor ? '<span class="cursor" aria-hidden="true"></span>' : "");
    return div;
  };

  const typeHero = async () => {
    if (!term) return;
    term.textContent = "";
    if (reduce || shot) {
      lines.forEach((item, i) => term.appendChild(renderLine(item, true, i === lines.length - 1)));
      return;
    }
    for (let i = 0; i < lines.length; i++) {
      const wrap = document.createElement("div");
      term.appendChild(wrap);
      const full = lines[i].html;
      // Type plain text after any leading tag chunk
      const parts = full.split(/(<[^>]+>)/).filter(Boolean);
      let acc = "";
      wrap.innerHTML = '<span class="cursor" aria-hidden="true"></span>';
      for (const part of parts) {
        if (part.startsWith("<")) {
          acc += part;
          wrap.innerHTML = acc + '<span class="cursor" aria-hidden="true"></span>';
          continue;
        }
        for (const ch of part) {
          acc += ch;
          wrap.innerHTML = acc + '<span class="cursor" aria-hidden="true"></span>';
          await new Promise((r) => setTimeout(r, 16));
        }
      }
      wrap.className = "done";
      wrap.innerHTML = full;
      await new Promise((r) => setTimeout(r, 220));
    }
    const last = term.lastElementChild;
    if (last) {
      last.classList.remove("done");
      if (!last.querySelector(".cursor")) last.insertAdjacentHTML("beforeend", '<span class="cursor" aria-hidden="true"></span>');
    }
  };

  const startTyping = () => typeHero();
  if (shot || reduce) startTyping();
  else window.setTimeout(startTyping, intro ? 900 : 200);

  /* Typed section headers: fill from data-text when revealed */
  const typeText = (el, text) => {
    if (reduce || shot) {
      el.textContent = text;
      return;
    }
    el.textContent = "";
    let i = 0;
    const tick = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) window.setTimeout(tick, 22);
    };
    tick();
  };

  /* Scroll reveal + header type + counters */
  const seen = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        entry.target.classList.add("is-in");
        const head = entry.target.querySelector(".typed-head");
        if (head?.dataset.text && !head.dataset.typed) {
          head.dataset.typed = "1";
          typeText(head, head.dataset.text);
        }
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    if (shot || reduce) {
      el.classList.add("is-in");
      const head = el.querySelector(".typed-head");
      if (head?.dataset.text) head.textContent = head.dataset.text;
    } else io.observe(el);
  });
  if (shot || reduce) document.querySelectorAll("[data-count]").forEach(animateCount);

  function animateCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = el.dataset.count;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = Number(el.dataset.decimals || 0);
    const fmt = (n, d) => {
      const s = Number(n).toFixed(d);
      const [a, b] = s.split(".");
      const grouped = a.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return b != null && d > 0 ? grouped + "." + b : grouped;
    };
    if (reduce || shot) {
      el.textContent = prefix + fmt(target, decimals) + suffix;
      return;
    }
    const end = Number(target);
    const t0 = performance.now();
    const dur = 1100;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = end * eased;
      el.textContent = prefix + fmt(val, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + fmt(target, decimals) + suffix;
    };
    requestAnimationFrame(step);
  }

  /* Active section nav */
  const navLinks = [...document.querySelectorAll(".nav-links a, .drawer a")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const setActive = () => {
    let current = sections[0];
    const y = window.scrollY + 96;
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec;
    });
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${current.id}`));
  };
  setActive();
  window.addEventListener("scroll", setActive, { passive: true });

  /* Project filters */
  const grid = document.getElementById("grid");
  const cards = [...document.querySelectorAll("#grid .card")];
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach((b) => {
        b.classList.toggle("is-on", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      const f = btn.dataset.filter;
      cards.forEach((card) => {
        const show =
          f === "all" ||
          (f === "featured" && card.dataset.feat === "1") ||
          card.dataset.cat === f;
        card.hidden = !show;
      });
    });
  });

  /* Card tilt */
  if (hoverFine && !reduce && !shot) {
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
        card.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* Constellation background */
  const canvas = document.getElementById("starfield");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w = 0, h = 0, raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.floor((w * h) / 18000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.4,
        c: ["#3cefff", "#b56bff", "#ff3cac"][Math.floor(Math.random() * 3)],
      }));
    };

    const light = () => root.dataset.theme === "light";

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const link = 120;
      const alpha = light() ? 0.28 : 0.7;
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        if (!reduce && !shot) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = a.c;
        ctx.globalAlpha = 0.55 * alpha;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            ctx.beginPath();
            ctx.strokeStyle = a.c;
            ctx.globalAlpha = (1 - d / link) * 0.22 * alpha;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce && !shot && !document.hidden) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      draw();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !reduce && !shot) {
        cancelAnimationFrame(raf);
        draw();
      }
    });
  }
})();
