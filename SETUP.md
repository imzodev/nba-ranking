# NBA Players Catalog - Setup Guide

## 🚀 Quick Start

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration (use these exact variable names)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Database Setup (Players Catalog Only)
1. Go to your Supabase project SQL editor
2. Run the SQL commands from `supabase/schema.sql`
3. This creates the **players table only** with comprehensive columns and indexes

### 4. Install Dependencies
```bash
# Using bun (preferred)
bun install

# Or using npm
npm install
```

### 5. Populate Players Catalog
```bash
# Populate with comprehensive NBA player data from Wikipedia
node scripts/populate-supabase.js
```

## 📊 Current Status

### ✅ Completed - Players Catalog
- [x] **Robust Wikipedia extraction script** - captures ALL infobox data
- [x] **Template parsing** - converts Wikipedia templates to human-readable format
- [x] **Comprehensive data extraction** - personal info, career history, awards, stats
- [x] **Supabase-ready** - uses only NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] **Players catalog only** - no voting system yet, just comprehensive player data
- [x] **Supabase schema** - PostgreSQL tables for players and votes
- [x] **Database population script** - automated data insertion

### 🎯 Next Steps
1. **Set up Supabase project** (5 minutes)
2. **Configure environment variables** (2 minutes)
3. **Run database population** (10-15 minutes for 25 players)
4. **Build Next.js frontend** with drag-and-drop ranking
5. **Implement voting system** with real-time updates

## 🏗️ Architecture

### Database Schema
- **Players table**: Comprehensive player data from Wikipedia
- **Votes table**: User rankings with session tracking
- **Row Level Security**: Secure data access
- **Real-time subscriptions**: Live vote updates

### Data Sources
- **Wikipedia infoboxes**: Complete, authentic player data
- **No hardcoding**: All data dynamically extracted
- **Template parsing**: Human-readable years and awards

## 🎮 Features Coming Next
1. **Player search and filtering**
2. **Drag-and-drop ranking interface**
3. **Real-time vote aggregation**
4. **Wisdom of crowds visualization**
5. **Social sharing and leaderboards**

## 🚀 Ready to Deploy?
Once you set up your Supabase project, we can immediately populate the database and start building the frontend!
