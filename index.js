const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 7000;
const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const EXA_API_URL = "https://api.exa.ai/search";
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY
const EXA_API_KEY = process.env.EXA_API_KEY;

// const expresponse = 
//   {
//     requestId: '6986f21bb560159359e7ab0a189f17e8',
//     autopromptString: 'Here is the latest financial report and director details for Meresu Ventures India Private Limited:',
//     autoDate: '2024-03-08T15:25:10.732Z',
//     resolvedSearchType: 'keyword',
//     results: [
//       {
//         id: 'https://www.indiafilings.com/search/meresu-ventures-india-private-limited-cin-U63119MH2024PTC426471',
//         title: 'MERESU VENTURES INDIA PRIVATE LIMITED - IndiaFilings',
//         url: 'https://www.indiafilings.com/search/meresu-ventures-india-private-limited-cin-U63119MH2024PTC426471',
//         author: null
//       },
//       {
//         id: 'https://www.thecompanycheck.com/company/meresu-ventures-india-private-limited/U63119MH2024PTC426471',
//         title: 'Meresu Ventures India Private Limited | Company Details',
//         url: 'https://www.thecompanycheck.com/company/meresu-ventures-india-private-limited/U63119MH2024PTC426471',
//         publishedDate: '2025-01-04T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://in.linkedin.com/in/harshchaudharisigma7',
//         title: 'Harsh Chaudhari - Founding Director - Meresu - LinkedIn',
//         url: 'https://in.linkedin.com/in/harshchaudharisigma7',
//         author: null
//       },
//       {
//         id: 'https://www.honeywell.com/content/dam/honeywellbt/en/documents/downloads/india-hail/financials/annual-reports/hon-corp-hail-annual-report-2023-24.pdf',
//         title: '[PDF] Honeywell Automation India Limited - Annual Report FY 2023 - 24',
//         url: 'https://www.honeywell.com/content/dam/honeywellbt/en/documents/downloads/india-hail/financials/annual-reports/hon-corp-hail-annual-report-2023-24.pdf',
//         publishedDate: '2024-07-26T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://s23.q4cdn.com/407969754/files/doc_events/2024/May/06/2023-annual-report.pdf',
//         title: '[PDF] 2023-annual-report.pdf',
//         url: 'https://s23.q4cdn.com/407969754/files/doc_events/2024/May/06/2023-annual-report.pdf',
//         publishedDate: '2024-05-06T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://www.adanigreenenergy.com/-/media/Project/GreenEnergy/Investor-Downloads/Annual-Reports/FY24.pdf',
//         title: '[PDF] FY24 Annual Report - Adani Green Energy',
//         url: 'https://www.adanigreenenergy.com/-/media/Project/GreenEnergy/Investor-Downloads/Annual-Reports/FY24.pdf',
//         publishedDate: '2024-06-18T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://www.mercantileventures.co.in/wp-content/uploads/2024/08/MVL_23rd-AGM_Notice-and-Annual-Report-2023-24.pdf',
//         title: '[PDF] Mercantile Ventures Limited',
//         url: 'https://www.mercantileventures.co.in/wp-content/uploads/2024/08/MVL_23rd-AGM_Notice-and-Annual-Report-2023-24.pdf',
//         publishedDate: '2024-08-28T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://www.morganventures.in/pdf/annual-report/Annual-Report-2024.pdf',
//         title: '[PDF] 37TH ANNUAL REPORT - Morgan Ventures Limited',
//         url: 'https://www.morganventures.in/pdf/annual-report/Annual-Report-2024.pdf',
//         publishedDate: '2024-08-22T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://www.tataelxsi.com/storage/investors/June2024/kPFlggyG32AaRyfjJ5om.pdf',
//         title: '[PDF] Integrated Annual Report - Tata Elxsi',
//         url: 'https://www.tataelxsi.com/storage/investors/June2024/kPFlggyG32AaRyfjJ5om.pdf',
//         publishedDate: '2024-06-25T12:00:00.000Z',
//         author: null
//       },
//       {
//         id: 'https://www.zyduslife.com/investor/admin/uploads/14/2/2023-2024_1.pdf',
//         title: '[PDF] 2023-2024 - Zydus',
//         url: 'https://www.zyduslife.com/investor/admin/uploads/14/2/2023-2024_1.pdf',
//         publishedDate: '2024-07-08T12:00:00.000Z',
//         author: null
//       }
//     ],
//     effectiveFilters: {
//       includeDomains: [],
//       excludeDomains: [],
//       includeText: [],
//       excludeText: [],
//       moderationConfig: { domainBlacklisted: true, domainBlacklistedMedia: true },
//       urls: []
//     },
//     costDollars: { total: 0.005, search: { neural: 0.005 } }
//   }

app.use(cors());
app.use(express.json());

async function searchCompanyWithExa(companyName) {
  try {
    const response = await axios.post(
      EXA_API_URL,
      {  query: `Fetch the following details for ${companyName}: 
      - Basic Information (Full Legal Name, Corporate Identification Number (CIN), GST Number) 
      - Director Information (Names, roles, tenure) 
      - Financials (Revenue, profit, key ratios, latest filings if available) 
      - Market Position & History with Steel Vendors (Past involvement with JSW Steel competitors, purchase history, supplier relationships, existing contracts, key procurement policies, supplier preferences, buying behavior).`
     },
      { headers: { Authorization: `Bearer ${EXA_API_KEY}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company info from Exa:", error);
    return null;
  }
}

async function summarizeWithPerplexity(rawData) {
  try {
    const requestBody = {
      model: "sonar",
      messages: [
        { role: "system", content: "Summarize the latest financial report and director details from the given data." },
        { role: "user", content: JSON.stringify(rawData) }
      ]
    };

    const response = await axios.post(
      PERPLEXITY_API_URL,
      requestBody,
      { headers: { Authorization: `Bearer ${PERPLEXITY_API_KEY}`, "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error summarizing company info with Perplexity:", error.response?.data || error.message);
    return null;
  }
}



app.post("/api/company-info", async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ error: "Company name is required." });
    }
    
    const exaData = await searchCompanyWithExa(companyName);
    // const exaData = expresponse; 
    console.log(exaData);
    if (!exaData) {
      return res.status(500).json({ error: "Failed to fetch company details from Exa AI." });
    }
    
    const summary = await summarizeWithPerplexity(exaData);
    if (!summary) {
      return res.status(500).json({ error: "Failed to summarize company details with Perplexity AI." });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error processing company info request:", error);
    res.status(500).json({ error: "Failed to fetch and summarize company details." });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
