<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Shopify Fetcher</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#03080a;--panel:#08130f;--panel2:#0c1a14;--border:#132a20;
  --green:#00ff88;--green-d:#00c96a;--green-glow:rgba(0,255,136,.18);
  --text:#d8f5e3;--text2:#7a9c88;--text3:#4a6355;
  --mono:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;
  background-image:radial-gradient(ellipse at 20% 0%,rgba(0,255,136,.07),transparent 45%),
                   radial-gradient(ellipse at 80% 100%,rgba(0,255,136,.05),transparent 45%);}
.wrap{max-width:920px;margin:0 auto;padding:28px 18px 80px}
header{border:1px solid var(--border);border-radius:16px;background:var(--panel);
  padding:22px 26px;margin-bottom:16px;position:relative;overflow:hidden}
.title{font-size:23px;font-weight:900;letter-spacing:-.7px;display:flex;align-items:center;gap:11px}
.sub{color:var(--text2);font-size:13px;margin-top:7px;font-family:var(--mono)}
.tagline{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.pill{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.8px;
  padding:4px 11px;border-radius:20px;background:rgba(0,255,136,.06);
  border:1px solid rgba(0,255,136,.22);color:var(--green);text-transform:uppercase}
.stats{display:flex;gap:18px;margin-top:16px;flex-wrap:wrap}
.stat{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--text2);font-family:var(--mono)}
.dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green)}
.panel{border:1px solid var(--border);border-radius:14px;background:var(--panel);
  padding:22px 24px;margin-bottom:14px}
.label{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:1.6px;color:var(--green);
  text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:9px}
.label::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--border),transparent)}
.field{margin-bottom:14px}
.field-label{font-size:11.5px;color:var(--text2);margin-bottom:6px;font-weight:500;
  display:flex;justify-content:space-between;align-items:center}
input[type=text],input[type=number]{
  width:100%;background:#040c08;border:1px solid var(--border);border-radius:10px;
  padding:12px 14px;color:var(--text);font-family:var(--mono);font-size:13px;outline:none}
input:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-glow)}
input:disabled{opacity:.55;cursor:not-allowed;color:var(--green);font-weight:700}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:600px){.row{grid-template-columns:1fr}}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-top:1px solid var(--border)}
.toggle-row:first-child{border-top:none;padding-top:0}
.toggle-label{font-size:12.5px;color:var(--text2)}
.switch{position:relative;width:44px;height:24px;background:#040c08;border:1px solid var(--border);
  border-radius:14px;cursor:pointer;transition:all .2s}
.switch::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;
  background:var(--text3);transition:all .2s}
.switch.on{background:rgba(0,255,136,.15);border-color:var(--green)}
.switch.on::after{transform:translateX(20px);background:var(--green)}
.btn{background:linear-gradient(135deg,var(--green),var(--green-d));border:none;border-radius:11px;
  padding:14px 26px;color:#04120a;font-weight:900;font-size:13.5px;letter-spacing:.6px;cursor:pointer;
  width:100%;font-family:var(--mono);text-transform:uppercase;margin-top:14px}
.btn:disabled{opacity:.5;cursor:wait}
.out-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:12px;flex-wrap:wrap}
.out-title{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:1.6px;color:var(--green);text-transform:uppercase}
.out-meta{font-size:10.5px;color:var(--text3);font-family:var(--mono)}
.acts{display:flex;gap:7px;flex-wrap:wrap}
.mini{background:transparent;border:1px solid var(--border);border-radius:8px;padding:6px 12px;
  color:var(--text2);font-family:var(--mono);font-size:10.5px;cursor:pointer;text-transform:uppercase;font-weight:600}
.mini:hover{border-color:var(--green);color:var(--green)}
.results{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.card{border:1px solid var(--border);border-radius:11px;background:var(--panel2);padding:13px 16px}
.card:hover{border-color:var(--green-d)}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:7px}
.card-idx{font-family:var(--mono);font-size:10.5px;color:var(--text3)}
.card-site{font-family:var(--mono);font-size:13.5px;font-weight:700;color:var(--green);word-break:break-all}
.copy-btn{background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 10px;
  color:var(--text3);font-family:var(--mono);font-size:10px;cursor:pointer}
.copy-btn:hover{border-color:var(--green);color:var(--green)}
.card-meta{display:flex;flex-wrap:wrap;gap:12px;font-family:var(--mono);font-size:11.5px;margin-bottom:7px}
.card-meta .kv{display:flex;gap:5px}
.card-meta .k{color:var(--text3);font-size:10.5px}
.card-meta .v{color:var(--text)}
.card-meta .v.price{color:var(--green);font-weight:700}
.card-checkout{font-family:var(--mono);font-size:10.5px;color:var(--text2);word-break:break-all;
  padding:6px 10px;background:#040c08;border-radius:6px;border:1px solid var(--border);cursor:pointer}
.card-checkout:hover{border-color:var(--green);color:var(--green)}
.empty{text-align:center;padding:44px 20px;color:var(--text3);font-family:var(--mono);font-size:12.5px}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--green);
  border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:9px}
@keyframes spin{to{transform:rotate(360deg)}}
.err{border:1px solid #7a2222;background:rgba(122,34,34,.08);color:#ff9090;padding:14px 18px;border-radius:10px;
  font-family:var(--mono);font-size:11.5px}
footer{text-align:center;margin-top:36px;color:var(--text3);font-family:var(--mono);font-size:10.5px;line-height:2}
footer a{color:var(--green);text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="title">🛒 Shopify Fetcher</div>
    <div class="sub">Direct API · Real-time streaming · Smart auto-search</div>
    <div class="tagline">
      <span class="pill">Fast</span>
      <span class="pill">Accurate</span>
      <span class="pill">Zero Errors</span>
      <span class="pill">Automatic</span>
      <span class="pill">$0.10 – $5.00</span>
    </div>
    <div class="stats">
      <div class="stat"><span class="dot"></span> ONLINE <span id="online">1</span></div>
      <div class="stat">SEARCHES <span id="visits">—</span></div>
      <div class="stat">BY Mod_By_Kamal</div>
    </div>
  </header>

  <div class="panel">
    <div class="label">SEARCH</div>
    <div class="field">
      <div class="field-label"><span>Keyword</span><span style="font-family:var(--mono);font-size:10px;color:var(--text3)">auto-runs on type</span></div>
      <input type="text" id="keyword" placeholder="socks  →  typing starts search automatically" autocomplete="off" />
    </div>
    <div class="row">
      <div class="field">
        <div class="field-label"><span>Result Count</span></div>
        <input type="number" id="result" value="100" min="10" max="1000" />
      </div>
      <div class="field">
        <div class="field-label"><span>Price Band</span></div>
        <input type="text" value="$0.10 – $5.00" disabled />
      </div>
    </div>
    <div class="label" style="margin-top:16px">OPTIONS</div>
    <div class="toggle-row">
      <span class="toggle-label">Stream results live (NDJSON)</span>
      <div class="switch" id="streamSwitch"></div>
    </div>
    <button class="btn" id="go">Execute</button>
    <div style="margin-top:12px;font-family:var(--mono);font-size:10.5px;color:var(--text3);word-break:break-all" id="apiUrl"></div>
  </div>

  <div class="panel">
    <div class="out-head">
      <div class="out-title">// OUTPUT</div>
      <div class="acts">
        <button class="mini" onclick="copyAll()">COPY ALL</button>
        <button class="mini" onclick="clearOut()">CLEAR</button>
      </div>
    </div>
    <div class="out-meta" id="outMeta">waiting for input…</div>
    <div class="results" id="results"></div>
  </div>

  <footer>Shopify Product Fetcher · v2.0<br/>By Mod_By_Kamal</footer>
</div>

<script>
const $ = (id) => document.getElementById(id);
let lastResults = [];
let currentAbort = null;
let debounceTimer = null;

const streamSw = $('streamSwitch');
streamSw.addEventListener('click', () => streamSw.classList.toggle('on'));

$('visits').textContent = Math.floor(400 + Math.random() * 300).toLocaleString();

function refreshUrl() {
  const kw = $('keyword').value.trim() || 'socks';
  let u = `/?keyword=${encodeURIComponent(kw)}&result=${$('result').value||100}`;
  if (streamSw.classList.contains('on')) u += '&stream=1';
  $('apiUrl').textContent = location.origin + u;
}
['keyword','result'].forEach(id => $(id).addEventListener('input', refreshUrl));
refreshUrl();

function clearOut() {
  $('results').innerHTML = '<div class="empty">no results yet</div>';
  $('outMeta').textContent = 'waiting…';
  lastResults = [];
}

function copyAll() {
  if (!lastResults.length) return alert('nothing to copy');
  navigator.clipboard.writeText(JSON.stringify(lastResults, null, 2));
}

function renderCards(list, meta) {
  if (!list.length) {
    $('results').innerHTML = '<div class="empty">no products in $0.10–$5.00 range</div>';
    $('outMeta').textContent = meta || 'done · 0 results';
    return;
  }
  $('results').innerHTML = list.map((r, i) => `
    <div class="card">
      <div class="card-head">
        <span class="card-idx">[${String(i+1).padStart(3,'0')}]</span>
        <button class="copy-btn" data-copy="${i}">COPY</button>
      </div>
      <div class="card-site">${r.site}</div>
      <div class="card-meta" style="margin-top:6px">
        <span class="kv"><span class="k">VARIANT</span><span class="v">${r.variant_id}</span></span>
        <span class="kv"><span class="k">PRICE</span><span class="v price">${r.price}</span></span>
      </div>
      <div class="card-checkout" data-checkout="${r.checkout}">CHECKOUT ${r.checkout}</div>
    </div>
  `).join('');

  document.querySelectorAll('.copy-btn').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(b.dataset.copy, 10);
      navigator.clipboard.writeText(JSON.stringify(lastResults[idx], null, 2));
      b.textContent = 'COPIED';
      setTimeout(() => { b.textContent = 'COPY'; }, 1200);
    });
  });
  document.querySelectorAll('.card-checkout').forEach(c => {
    c.addEventListener('click', () => {
      navigator.clipboard.writeText(c.dataset.checkout);
    });
  });
}

async function runSearch() {
  const kw = $('keyword').value.trim();
  if (!kw) return;

  if (currentAbort) currentAbort.abort();
  currentAbort = new AbortController();

  const isStream = streamSw.classList.contains('on');
  $('go').disabled = true;
  $('results').innerHTML = '<div class="empty"><span class="spinner"></span>searching…</div>';
  $('outMeta').textContent = 'querying "' + kw + '"…';

  const t0 = performance.now();
  lastResults = [];

  try {
    if (isStream) {
      const url = `/?keyword=${encodeURIComponent(kw)}&result=${$('result').value||100}&stream=1`;
      const resp = await fetch(url, { signal: currentAbort.signal });
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            if (obj.error) continue;
            lastResults.push(obj);
          } catch {}
        }
        if (lastResults.length % 5 === 0) {
          renderCards(lastResults, 'streaming… ' + lastResults.length);
        }
      }
    } else {
      const url = `/?keyword=${encodeURIComponent(kw)}&result=${$('result').value||100}&format=raw`;
      const resp = await fetch(url, { signal: currentAbort.signal });
      const data = await resp.json();
      lastResults = Array.isArray(data) ? data : (data.results || []);
    }

    const ms = Math.round(performance.now() - t0);
    $('outMeta').innerHTML =
      'RESULTS <span style="color:#00ff88">' + lastResults.length +
      '</span> · "' + kw + '" · $0.10–$5.00 · <span style="color:#00ff88">' + ms + 'ms</span>';
    renderCards(lastResults);
  } catch (e) {
    if (e.name === 'AbortError') return;
    $('results').innerHTML = '<div class="err">' + e.message + '</div>';
    $('outMeta').textContent = 'failed';
  } finally {
    $('go').disabled = false;
  }
}

$('keyword').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const kw = $('keyword').value.trim();
  refreshUrl();
  if (kw.length < 2) return;
  debounceTimer = setTimeout(runSearch, 550);
});
$('keyword').addEventListener('keydown', e => {
  if (e.key === 'Enter') { clearTimeout(debounceTimer); runSearch(); }
});
$('go').addEventListener('click', () => { clearTimeout(debounceTimer); runSearch(); });

clearOut();
</script>
</body>
</html>
