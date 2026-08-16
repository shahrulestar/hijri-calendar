export const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content="MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users." />
  <meta property="og:title" content="Hijri Calendar MCP" />
  <meta property="og:description" content="MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users." />
  <meta property="og:image" content="https://hijri.shahrulestar.com/cover.png" />
  <meta property="og:url" content="https://hijri.shahrulestar.com" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Hijri Calendar MCP" />
  <meta name="twitter:description" content="MCP Server for Malaysia's Islamic calendar. Never miss an important date—look up Hijri calendar timings and get accurate info on Ramadan, Aidilfitri, Aidiladha, Maal Hijrah, and Maulidur Rasul to keep your app in tune with what matters to your users." />
  <meta name="twitter:image" content="https://hijri.shahrulestar.com/cover.png" />
  <link rel="icon" href="/icon-light.svg" type="image/svg+xml" />
  <link rel="icon" href="/icon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
  <link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
  <title>Hijri Calendar MCP</title>
  <style>
    :root {
      --bg: #fff;
      --fg: #171717;
      --muted: #737373;
      --border: #e5e5e5;
      --card: #fff;
      --hover: #f5f5f5;
      --radius: 0.625rem;
    }
    html.dark {
      --bg: #0a0a0a;
      --fg: #fafafa;
      --muted: #a3a3a3;
      --border: #262626;
      --card: #171717;
      --hover: #262626;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--fg);
      font-family: system-ui, sans-serif;
    }
    main {
      margin: 0 auto;
      display: flex;
      min-height: 100svh;
      width: 100%;
      max-width: 1000px;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1rem;
    }
    @media (min-width: 640px) { main { padding-left: 1.5rem; padding-right: 1.5rem; } }
    @media (min-width: 1024px) { main { padding-left: 2rem; padding-right: 2rem; } }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.025em;
      text-wrap: balance;
    }
    h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: -0.025em;
    }
    .lede {
      margin: 0;
      font-size: 0.875rem;
      color: var(--muted);
    }
    header { display: flex; flex-direction: column; gap: 0.75rem; }
    .connect {
      display: flex;
      width: 100%;
      min-width: 0;
      flex-direction: column;
      gap: 1rem;
    }
    .connect-head { display: flex; flex-direction: column; gap: 0.25rem; }
    .connect-desc { margin: 0; font-size: 0.875rem; color: var(--muted); }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .label { margin: 0; font-size: 0.875rem; font-weight: 500; }
    .group {
      display: flex;
      min-height: 2.25rem;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      align-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .group.preview {
      position: relative;
      align-items: stretch;
    }
    .group.preview .copy {
      position: absolute;
      top: 0.375rem;
      right: 0.375rem;
      z-index: 1;
    }
    .group.preview pre { padding-right: 2.5rem; }
    .group input, .group pre {
      flex: 1;
      min-width: 0;
      margin: 0;
      border: 0;
      background: transparent;
      font: inherit;
      color: inherit;
    }
    .group input {
      height: 2.25rem;
      padding: 0 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      white-space: nowrap;
      overflow-x: auto;
    }
    .group pre {
      overflow-x: auto;
      padding: 0.5rem 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875rem;
      line-height: 1.625;
      white-space: pre;
    }
    .copy {
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      margin: 0.375rem;
      border: 0;
      border-radius: 0.375rem;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
    }
    .copy:hover { background: var(--hover); color: var(--fg); }
    .copy svg { width: 1rem; height: 1rem; }
    .tools { display: flex; flex-direction: column; gap: 0.625rem; }
    .tool {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.625rem 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .tool code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500; }
    .tool p { margin: 0; color: var(--muted); }
    .source {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .source p { margin: 0; font-size: 0.875rem; color: var(--muted); }
    .source a { color: inherit; text-decoration: underline; text-underline-offset: 3px; }
    .github {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 0.25rem;
      height: 2rem;
      padding: 0 0.625rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--bg);
      color: inherit;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
    }
    .links {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .github:hover { background: var(--hover); }
    .github svg { width: 1rem; height: 1rem; }
  </style>
  <script>
    (function () {
      try {
        var stored = localStorage.getItem("theme");
        if (stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches)) {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <main>
    <header>
      <h1>Hijri Calendar MCP</h1>
      <p class="lede">MCP Server for Malaysia's Islamic calendar.</p>
    </header>

    <section class="connect">
      <div class="connect-head">
        <h2>Connect</h2>
        <p class="connect-desc">Use this URL in Cursor, Figma, Claude, or any Streamable HTTP MCP client.</p>
      </div>
      <div class="group">
        <input id="mcp-url" readonly value="https://hijri.shahrulestar.com/mcp" aria-label="Remote MCP URL" />
        <button class="copy" type="button" data-copy="url" aria-label="Copy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      </div>
      <div class="stack" style="gap:0.5rem">
        <p class="label">Cursor config</p>
        <div class="group preview">
          <pre id="mcp-config">{
  "mcpServers": {
    "islamic-calendar": {
      "url": "https://hijri.shahrulestar.com/mcp"
    }
  }
}</pre>
          <button class="copy" type="button" data-copy="config" aria-label="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </div>
    </section>

    <section class="connect">
      <div class="connect-head">
        <h2>Tools</h2>
        <p class="connect-desc">Month summary, day-by-day takwim, and Islamic observances.</p>
      </div>
      <div class="tools">
        <div class="tool">
          <code>get_lunar_months</code>
          <p>Month summary: Hijri month start, end, and length. Use for “when is Ramadan?” or which month covers a Gregorian date.</p>
        </div>
        <div class="tool">
          <code>get_hijri_calendar</code>
          <p>Day-by-day takwim: Hijri date and weekday for one day, a Hijri month, or a short Gregorian range.</p>
        </div>
        <div class="tool">
          <code>get_islamic_events</code>
          <p>Important Islamic dates in Malaysia — Aidilfitri, Aidiladha, Maulid, Awal Ramadan, and other observances.</p>
        </div>
      </div>
    </section>

    <aside class="source">
      <h2>Data source</h2>
      <p>Calendar data follows Malaysia time (Asia/Kuala_Lumpur) for 1447H–1450H (Gregorian 2025–2028; 1450H through Sha’ban). Verified against <a href="https://www.e-solat.gov.my/index.php?siteId=24&amp;pageId=26" target="_blank" rel="noreferrer">JAKIM e-Solat</a>.</p>
      <div class="links">
        <a class="github" href="https://github.com/shahrulestar/islamic-calendar-mcp" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>
          GitHub
        </a>
        <a class="github" href="https://github.com/sponsors/shahrulestar" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.6 12 20l-7.5-7.4a4.5 4.5 0 1 1 7.5-5.2 4.5 4.5 0 1 1 7.5 5.2z"/></svg>
          Sponsor
        </a>
      </div>
    </aside>
  </main>
  <script>
    const copyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    const tickIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';

    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).catch(function () {
          return copyTextFallback(text);
        });
      }
      return Promise.resolve(copyTextFallback(text));
    }

    function copyTextFallback(text) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      if (!ok) throw new Error("copy failed");
    }

    function isTypingTarget(target) {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        return !target.readOnly && !target.disabled;
      }
      return target.tagName === "SELECT";
    }

    const root = document.documentElement;

    window.addEventListener("keydown", function (event) {
      if (event.defaultPrevented || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== "d") return;
      if (isTypingTarget(event.target)) return;
      const next = root.classList.contains("dark") ? "light" : "dark";
      root.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    });

    const sources = {
      url: document.getElementById("mcp-url").value,
      config: document.getElementById("mcp-config").textContent,
    };
    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const key = button.getAttribute("data-copy");
        try {
          await copyText(sources[key]);
          button.innerHTML = tickIcon;
          button.setAttribute("aria-label", "Copied");
          setTimeout(function () {
            button.innerHTML = copyIcon;
            button.setAttribute("aria-label", "Copy");
          }, 1500);
        } catch {}
      });
    });
  </script>
</body>
</html>
`
