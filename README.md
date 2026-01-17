# Aadhaar Trends Dashboard

An automated, real-time dashboard displaying publicly released aggregated Aadhaar statistics from UIDAI. Built with Next.js and JavaScript, featuring automatic data refresh capabilities.

## Setup

- Prerequisites: Node.js 18+, npm (or yarn/pnpm/bun)
- Clone (example):
  ```bash
  git clone https://github.com/BharathPESU/UIDAI.git
  cd UIDAI/uidai
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start development server:
  ```bash
  npm run dev
  ```
- Open the app: `http://localhost:3000`
- Optional environment config (for hosted JSON): create `.env.local` and set
  ```bash
  NEXT_PUBLIC_BASE_URL=https://your-domain.com
  ```
  The API will fetch JSON from `https://your-domain.com/data/aadhaar-stats.json`. If not set, it uses `http://localhost:3000` and the local file at `public/data/aadhaar-stats.json`.
- Production build:
  ```bash
  npm run build
  npm run start
  ```
- Common troubleshooting:
  - If dev lock error occurs: `pkill -f "next dev" && rm -rf .next && npm run dev`
  - Port conflict: `npm run dev -- -p 3001`

## 🎯 Overview

This dashboard provides comprehensive visualizations of Aadhaar enrolment and update statistics through an industry-standard auto-refresh mechanism. The system automatically fetches and displays the latest available aggregated data without requiring manual intervention, code changes, or redeployment.

## ✨ Features

### Auto-Refresh Data Pipeline
- **Automatic Data Fetching**: Dashboard automatically fetches data from a hosted JSON source
- **Periodic Refresh**: Data refreshes every 5 minutes automatically
- **Manual Refresh**: Users can manually trigger data refresh via UI button
- **Smart Caching**: API implements 5-minute cache to optimize performance
- **Error Handling**: Graceful fallback to cached data if fetch fails

### Visualizations
- **Year-wise Enrolment Trend**: Line chart showing Aadhaar enrolment growth over years
- **State-wise Updates**: Horizontal bar chart displaying top states by update count
- **Age Group Distribution**: Pie chart showing demographic distribution
- **Update Types Analysis**: Column chart breaking down different update categories

### User Experience
- **Loading States**: Smooth loading indicators during data fetch
- **Error States**: User-friendly error messages with retry options
- **Last Updated Timestamp**: Clear display of when data was last updated
- **Refresh Status**: Real-time indicator showing auto-refresh is active
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Automatic theme adaptation

## 🏗️ Architecture

### Data Flow
```
Hosted JSON → Next.js API Route (/api/data) → Frontend (React) → Charts (Canvas)
              ↓                                ↓
         Cache Layer                    Auto-refresh Timer
```

### Components

1. **Data Source** (`/public/data/aadhaar-stats.json`)
   - Hosted JSON file containing aggregated statistics
   - Simulates UIDAI's periodic data releases
   - Structure includes enrolments, state updates, age groups, and update types

2. **API Route** (`/app/api/data/route.js`)
   - Fetches data from hosted JSON source
   - Implements caching (5-minute duration)
   - Handles errors gracefully with fallback
   - Returns clean JSON to frontend

3. **Frontend** (`/app/page.tsx`)
   - Manages data fetching and state
   - Implements auto-refresh timer (5 minutes)
   - Handles loading and error states
   - Triggers manual refresh on user action

4. **Dashboard Component** (`/app/components/Dashboard.js`)
   - Renders all visualizations using HTML5 Canvas
   - Displays summary cards with key metrics
   - Shows last updated timestamp
   - Provides ethics and transparency notice

## 📊 Data Structure

The JSON data source follows this structure:

```json
{
  "lastUpdated": "2026-01-10",
  "metadata": {
    "source": "UIDAI Aggregated Statistics",
    "updateFrequency": "Monthly",
    "dataType": "Publicly Released Aggregated Data"
  },
  "enrolments": [
    { "year": 2025, "total": 1385000000 }
  ],
  "stateUpdates": [
    { "state": "Karnataka", "updates": 6500000 }
  ],
  "ageGroups": [
    { "group": "19-35", "count": 485000000 }
  ],
  "updateTypes": [
    { "type": "Biometric Update", "count": 45000000 }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uidai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm run start
```

## 🔄 How Auto-Refresh Works

### Real-time vs Periodic Refresh

**Important Distinction:**
- ❌ **NOT Real-time**: This dashboard does NOT access live Aadhaar systems
- ✅ **Periodic Refresh**: Automatically fetches latest publicly released aggregated data

### Refresh Mechanism

1. **On Page Load**: Dashboard immediately fetches latest data
2. **Periodic Timer**: Automatically refetches every 5 minutes
3. **Manual Trigger**: User can click "Refresh" button anytime
4. **Backend Caching**: API caches data for 5 minutes to optimize performance
5. **Data Updates**: When UIDAI releases new aggregated data, it's reflected automatically

### Updating Data Source

To simulate new data releases:

1. Edit `/public/data/aadhaar-stats.json`
2. Update the `lastUpdated` field
3. Modify statistics as needed
4. Save the file
5. Dashboard will automatically fetch updated data on next refresh

For production, replace local JSON with external hosted URL in `/app/api/data/route.js`:

```javascript
const response = await fetch('https://your-domain.com/api/aadhaar-stats.json');
```

## 🛡️ Ethics & Data Privacy

### Key Principles

1. **No Personal Data**: Zero access to individual Aadhaar records
2. **Aggregated Only**: All statistics are aggregated at state/national level
3. **Public Data**: Only publicly released statistics are displayed
4. **No Real-time Access**: No connection to live UIDAI systems
5. **Transparency**: Clear notices about data sources and limitations

### Visible Notices

The dashboard prominently displays:
> "This dashboard automatically refreshes publicly released, aggregated Aadhaar statistics. No real-time or personal Aadhaar data is accessed."

### Compliance

- ✅ Uses only anonymized, aggregated data
- ✅ No personally identifiable information (PII)
- ✅ Treats updates as periodic refresh (not real-time)
- ✅ Clear documentation of data sources
- ✅ Transparent about limitations

## 🎨 Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Charts**: HTML5 Canvas (native, no external libraries)
- **API**: Next.js API Routes
- **State Management**: React Hooks (useState, useEffect)

### Why No External Charting Libraries?

This implementation uses native HTML5 Canvas for maximum:
- **Performance**: No library overhead
- **Customization**: Full control over chart appearance
- **Learning**: Educational value in understanding chart rendering
- **Bundle Size**: Minimal JavaScript footprint

## 📁 Project Structure

```
uidai/
├── app/
│   ├── api/
│   │   └── data/
│   │       └── route.js          # API endpoint for data fetching
│   ├── components/
│   │   └── Dashboard.js          # Main dashboard component
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page with auto-refresh logic
├── public/
│   └── data/
│       └── aadhaar-stats.json    # Hosted data source
├── package.json
├── next.config.ts
└── README.md
```

## 🔧 Configuration

### Adjust Refresh Interval

In `/app/page.tsx`, modify the interval:

```javascript
// Current: 5 minutes
const interval = setInterval(() => {
  fetchData();
}, 5 * 60 * 1000);

// For 10 minutes:
}, 10 * 60 * 1000);
```

### Change Cache Duration

In `/app/api/data/route.js`:

```javascript
// Current: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// For 15 minutes:
const CACHE_DURATION = 15 * 60 * 1000;
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Supports deployment on:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted (Node.js server)

## 📈 Future Enhancements

Potential features for future versions:
- Export data as CSV/PDF
- Date range filters
- Comparison views (year-over-year)
- Notification system for new data releases
- Historical data archives
- Advanced filtering options
- User preferences (theme, refresh rate)

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Follow existing code style
- Maintain ethical data practices
- Add tests for new features
- Update documentation

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Data structure inspired by UIDAI's public statistics format
- Built with Next.js and React
- Tailwind CSS for styling

## 📞 Support

For issues or questions:
- Check existing documentation
- Review code comments
- Open an issue on GitHub

---

**Remember**: This dashboard displays only publicly released, aggregated statistics. It does not access any real-time or personal Aadhaar data.
# UIDAI
