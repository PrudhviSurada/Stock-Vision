/**
 * data.js
 * -------
 * Central data store for Stock Lens.
 *
 * To add a new company later:
 *   1. Add a new object to the COMPANIES array below.
 *   2. Drop the matching research PDF into /reports.
 *   3. Match `pdf` to the file name. That's it — search, the modal,
 *      and the download button all read from this single source.
 */

const COMPANIES = [
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT Services",
    logoInitials: "TCS",
    logoColor: "#12805C",
    description: "India's largest IT services and consulting company, delivering technology solutions across banking, retail, and manufacturing worldwide.",
    summary: "TCS combines scale with best-in-class margins in IT services. Growth is moderating with the sector, but a strong balance sheet, sticky BFSI relationships, and expanding AI-led deal wins keep the long-term thesis intact. Valuation carries a premium for that stability.",
    pdf: "reports/Tata-Motors.pdf",
    price: "3,842.50",
    change: "+0.8%",
    trend: "up",
  },
  {
    ticker: "INFY",
    name: "Infosys Limited",
    sector: "IT Services",
    logoInitials: "IN",
    logoColor: "#0E1C2E",
    description: "A global leader in next-generation digital services and consulting, helping enterprises navigate their digital transformation.",
    summary: "Infosys is navigating a choppy demand environment with disciplined cost management and steady large-deal signings. Generative AI offerings (Topaz) are an emerging growth lever, while valuation broadly tracks large-cap IT peers pending a clearer demand recovery.",
    pdf: "reports/infosys.pdf",
    price: "1,612.30",
    change: "+1.2%",
    trend: "up",
  },
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    sector: "Conglomerate",
    logoInitials: "RIL",
    logoColor: "#C77D02",
    description: "A diversified conglomerate spanning energy, petrochemicals, retail, and digital services through Jio and Reliance Retail.",
    summary: "Jio's subscriber and ARPU growth plus Reliance Retail's expansion are increasingly the key value drivers, while the legacy O2C business remains more cyclical. A sum-of-the-parts lens is the most useful way to think about the current valuation.",
    pdf: "reports/reliance.pdf",
    price: "2,984.75",
    change: "-0.4%",
    trend: "down",
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    sector: "Private Banking",
    logoInitials: "HDFC",
    logoColor: "#12805C",
    description: "India's largest private sector bank by assets, offering retail, wholesale, and treasury banking services.",
    summary: "Post-merger integration with HDFC Ltd continues, with loan growth deliberately calibrated to normalize the credit-deposit ratio. Asset quality remains strong; the near-term story is margin normalization rather than credit risk.",
    pdf: "reports/HDFC-bank.pdf",
    price: "1,678.90",
    change: "+0.3%",
    trend: "up",
  },
  {
    ticker: "Sun Pharmaceutical",
    name: "Sun Pharmaceutical",
    sector: "HealthCare",
    logoInitials: "HDFC",
    logoColor: "#b7ca4b",
    description: "Sun Pharma is a leading global specialty generic company, with global revenue of US$ 6.2 billion.",
    summary: "Sun Pharmaceutical Industries Limited (d/b/a Sun Pharma) is an Indian multinational pharmaceutical company headquartered in Mumbai. It manufactures and sells pharmaceutical formulations and active pharmaceutical ingredients (APIs) in more than 100 countries.",
    pdf: "reports/Sun-Pharma.pdf",
    price: "1,870.90",
    change: "+0.3%",
    trend: "up",
  },
  
];



// Extra symbols (no research report yet) purely to make the ticker tape feel alive.
const TICKER_EXTRAS = [
  { ticker: "HCLTECH", change: "+0.5%", trend: "up" },
  { ticker: "SBIN", change: "-0.2%", trend: "down" },
  { ticker: "AXISBANK", change: "+0.9%", trend: "up" },
  { ticker: "ITC", change: "+0.1%", trend: "up" },
  { ticker: "BHARTIARTL", change: "-0.6%", trend: "down" },
  { ticker: "KOTAKBANK", change: "+0.4%", trend: "up" },
];

function findCompany(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return COMPANIES.find(
    (c) => c.ticker.toLowerCase() === q || c.name.toLowerCase() === q
  ) || null;
}

function searchCompanies(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return COMPANIES.filter(
    (c) => c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
  ).slice(0, 6);
}
