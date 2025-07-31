# NBA Player Ranking App - Wisdom of Crowds

A Next.js app that aggregates user rankings to create the definitive top 25 NBA players of all time using the wisdom of crowds principle.

## 🏀 What This App Does

Instead of relying on expert opinions or traditional rankings, this app lets **you** and thousands of other users create the ultimate NBA top 25 by averaging everyone's individual rankings.

### The Wisdom of Crowds Approach
- **Individual Input**: Each user provides their personal top 25 NBA players
- **Collective Intelligence**: We average all rankings to find the consensus
- **Dynamic Updates**: Rankings evolve as more people participate
- **Real-time Results**: See how the crowd's wisdom changes over time

## 🚀 Quick Start

### Prerequisites
- Node.js 20.18.0+
- Supabase account
- Git

### 1. Clone and Setup
```bash
git clone <your-repo>
cd nba-ranking
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup
```bash
# Run the population script
node scripts/populate-supabase.js
```

### 4. Start Development
```bash
npm run dev
```

## 📊 How It Works

### Ranking System

Our ranking system uses a fair and consistent point allocation method to aggregate user submissions:

#### Points Calculation
- Each player receives points based on their position in a user's ranking list
- 1st place: 100 points
- 2nd place: 99 points
- 10th place: 91 points
- 50th place: 51 points
- 100th place: 1 point

#### Key Features
- **Position-Based Scoring**: Points are calculated as `101 - rank` (minimum 1 point)
- **Consistent Across Lists**: The same position gets the same points regardless of ranking type (top 10, 25, 50, or 100)
- **Fair Aggregation**: All user submissions contribute equally to the final rankings
- **Unified Rankings**: The top 10 is always the first 10 players from the top 25, which is always the first 25 from the top 50, etc.

#### Aggregation Process
1. Users submit their rankings (top 10, 25, 50, or 100)
2. Each player receives points based on their position
3. Points are aggregated across all user submissions
4. Players are sorted by total points (descending) and average rank (ascending for tiebreakers)
5. The resulting list represents the collective wisdom of all participants

### Technical Implementation

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

