/**
 * ticker.js
 * ---------
 * Renders the scrolling ticker-tape strip used as Stock Lens's signature
 * visual element. Pulls real tickers from data.js (COMPANIES + TICKER_EXTRAS)
 * so the tape reflects the same companies the search actually knows about.
 */

function renderTicker(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const all = [
    ...COMPANIES.map((c) => ({ ticker: c.ticker, change: c.change, trend: c.trend })),
    ...TICKER_EXTRAS,
  ];

  const itemHtml = (item) => {
    const cls = item.trend === "up" ? "up" : "down";
    const arrow = item.trend === "up" ? "▲" : "▼";
    return `<span class="ticker-item"><span class="sym">${item.ticker}</span><span class="${cls}">${arrow} ${item.change}</span></span>`;
  };

  // Duplicate the list once so the CSS translateX(-50%) loop is seamless.
  const sequence = [...all, ...all].map(itemHtml).join("");

  el.innerHTML = `<div class="ticker-track">${sequence}</div>`;
}
