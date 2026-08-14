export const LANDING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Islamic Calendar MCP</title>
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
    h1 { margin: 0; font-size: 1.5rem; font-weight: 500; letter-spacing: -0.025em; }
    @media (min-width: 640px) { h1 { font-size: 1.875rem; } }
    .lede {
      margin: 0;
      max-width: 42rem;
      font-size: 0.875rem;
      line-height: 1.625;
      color: var(--muted);
    }
    @media (min-width: 640px) { .lede { font-size: 1rem; } }
    header { display: flex; flex-direction: column; gap: 0.75rem; }
    .card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow: hidden;
      border-radius: 0.75rem;
      background: var(--card);
      padding: 1.5rem 0;
      font-size: 0.875rem;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
      outline: 1px solid rgb(23 23 23 / 0.1);
    }
    .card-head, .card-body { padding: 0 1.5rem; }
    .card-head { display: flex; flex-direction: column; gap: 0.25rem; }
    .card-title { margin: 0; font-weight: 500; }
    .card-desc { margin: 0; color: var(--muted); }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .label { margin: 0; font-size: 0.875rem; font-weight: 500; }
    .group {
      display: flex;
      min-height: 2.25rem;
      width: 100%;
      align-items: flex-start;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow: hidden;
    }
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
      font-size: 0.75rem;
    }
    .group pre {
      overflow-x: auto;
      padding: 0.5rem 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
      line-height: 1.625;
    }
    .copy {
      display: inline-flex;
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
    .alert {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }
    .alert strong { font-weight: 500; }
    .alert p { margin: 0; color: var(--muted); }
    .alert a { color: inherit; }
    .github {
      margin-top: 0.5rem;
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
      <h1>Islamic Calendar MCP</h1>
      <p class="lede">A remote MCP server for the Malaysian Islamic (Hijri) calendar. Connect Cursor, Claude, Figma, or other AI clients to look up Hijri months, Gregorian dates, and important Islamic observances.</p>
    </header>

    <section class="card">
      <div class="card-head">
        <h2 class="card-title">Connect</h2>
        <p class="card-desc">Use this URL in Cursor, Figma, Claude, or any Streamable HTTP MCP client.</p>
      </div>
      <div class="card-body stack">
        <div class="group">
          <input id="mcp-url" readonly value="https://islam-calendar.shahrulestar.com/mcp" aria-label="Remote MCP URL" />
          <button class="copy" type="button" data-copy="url" aria-label="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
        <div class="stack" style="gap:0.5rem">
          <p class="label">Cursor config</p>
          <div class="group">
            <pre id="mcp-config">{
  "mcpServers": {
    "islamic-calendar": {
      "url": "https://islam-calendar.shahrulestar.com/mcp"
    }
  }
}</pre>
            <button class="copy" type="button" data-copy="config" aria-label="Copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <h2 class="card-title">Tools</h2>
        <p class="card-desc">Month summary, day-by-day takwim, and Islamic observances.</p>
      </div>
      <div class="card-body tools">
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

    <aside class="alert">
      <strong>Data source</strong>
      <p>Calendar data follows Malaysia time (Asia/Kuala_Lumpur) and is verified against <a href="https://www.e-solat.gov.my/index.php?siteId=24&amp;pageId=26" target="_blank" rel="noreferrer">JAKIM e-Solat</a>. Some later dates may still change after official moon-sighting announcements.</p>
      <a class="github" href="https://github.com/shahrulestar/islamic-calendar-mcp" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>
        GitHub
      </a>
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
