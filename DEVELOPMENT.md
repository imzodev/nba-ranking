# NBA Ranking App - Development Plan & TODO

This is the **living development document** for building the ultimate NBA wisdom of crowds ranking system. Keep this updated as we progress.

---

## 🎯 Project Overview
**Goal**: Create the definitive NBA top 25 by aggregating thousands of fan rankings using the wisdom of crowds principle.

**Core Principle**: When 10,000+ basketball fans rank their top 25, the average becomes more accurate than any expert panel.

---

## 📋 Current Status
✅ **Phase 1 Complete**: Foundation
- Wikipedia data extraction working
- Supabase database populated with 25+ players
- Environment fully configured
- Basic infrastructure ready

🚧 **Phase 2 In Progress**: Core Features
- API endpoints for players implemented with limit parameter
- Next.js image configuration updated to support Wikimedia images
- Player service updated to support filtering and limiting results

---
## 🎯 Ranking System Design

### How We Create the Ultimate Top 25

#### 1. Vote Collection System
```typescript
// User ranking interface
interface UserRanking {
  sessionId: string;
  rankings: Array<{
    playerName: string;
    rank: number; // 1-25
    timestamp: Date;
  }>;
}
```

#### 2. Wisdom Calculation Algorithm
```typescript
// Aggregate rankings using statistical methods
function calculateWisdomRankings(allRankings: UserRanking[]): PlayerRanking[] {
  const playerScores = {};
  
  // Method 1: Average Rank
  for (const ranking of allRankings) {
    for (const vote of ranking.rankings) {
      playerScores[vote.playerName] = playerScores[vote.playerName] || [];
      playerScores[vote.playerName].push(vote.rank);
    }
  }
  
  // Calculate mean and confidence
  return Object.entries(playerScores).map(([playerName, ranks]) => ({
    playerName,
    averageRank: ranks.reduce((a, b) => a + b, 0) / ranks.length,
    confidence: calculateConfidenceInterval(ranks),
    voteCount: ranks.length
  })).sort((a, b) => a.averageRank - b.averageRank);
}
```

#### 3. Advanced Statistical Methods
- **Median Ranking**: Reduces outlier impact
- **Weighted Voting**: Confidence-based weighting
- **Bayesian Updating**: Prior knowledge integration
- **Time Decay**: Recent votes weighted more heavily

## 🎮 UI/UX Design System

### Drag-and-Drop Ranking Interface
```typescript
// Component structure
interface RankingBoardProps {
  availablePlayers: Player[];
  userRankings: Player[];
  onRankingChange: (rankings: Player[]) => void;
}

// Visual ranking display
interface RankingDisplayProps {
  wisdomRankings: WisdomRanking[];
  userRankings?: UserRanking[];
  confidenceIntervals: ConfidenceInterval[];
}
```

### Visual Components Needed
1. **Player Cards**: Drag-and-drop cards with player info
2. **Ranking Slots**: 25 numbered positions
3. **Real-time Updates**: Live ranking changes
4. **Confidence Visualization**: Uncertainty indicators
5. **Comparison View**: Your ranking vs. crowd wisdom

## 📋 TODO: Development Checklist

### Phase 1: Foundation ✅ COMPLETE
- [x] Wikipedia data extraction
- [x] Supabase database setup
- [x] Player data population
- [x] Environment configuration

### Phase 2: Core Features 🚧 IN PROGRESS
- [x] **Player API System**
  - [x] Player retrieval with limit parameter
  - [x] Player filtering by position and search query
  - [x] Image hosting configuration for Wikimedia sources

- [ ] **Vote Collection System**
  - [ ] IP-based voting (no accounts needed)
  - [ ] Validation (exactly 10, 25, 50, or 100 players)

- [ ] **Ranking Algorithm**
  - [ ] Statistical aggregation methods
  - [ ] Outlier detection and handling
  - [ ] Confidence interval calculation

### Phase 3: Frontend Components 🎯 NEXT
- [x] **Player Display**
  - [x] Basic player cards with images
  - [x] Player grid component

- [ ] **Ranking Interface**
  - [x] Player selection functionality
  - [ ] Draggable player cards
  - [ ] 25 ranking slots
  - [ ] Visual feedback and animations
  - [ ] Mobile responsive design

- [ ] **Results Display**
  - [ ] Real-time ranking visualization
  - [ ] Confidence indicators
  - [ ] Comparison views (your vs. crowd)
  - [ ] Historical tracking

- [ ] **Player Discovery**
  - [ ] Search and filtering
  - [ ] Player comparison tool
  - [ ] Stats visualization
  - [ ] Achievement highlights

### Phase 4: Advanced Features 🔮 FUTURE
- [ ] **Social Features**
  - [ ] Share your rankings
  - [ ] Compare with friends
  - [ ] Leaderboards
  - [ ] Community discussions

- [ ] **Analytics**
  - [ ] Geographic voting patterns
  - [ ] Demographic insights
  - [ ] Era-based analysis
  - [ ] Position bias detection

- [ ] **Machine Learning**
  - [ ] Predictive ranking models
  - [ ] User preference learning
  - [ ] Recommendation systems
  - [ ] Bias correction algorithms

## 🛠️ Implementation Plan

### Week 1: Core Infrastructure
- [x] Set up player data extraction and storage
- [x] Create player retrieval API with filtering and limits
- [x] Configure image hosting for external sources
- [ ] Set up votes table schema
- [ ] Create ranking collection API

### Week 2: Frontend Development
- [ ] Create drag-and-drop components
- [ ] Build results visualization
- [ ] Add real-time updates
- [ ] Mobile optimization

### Week 3: Polish & Testing
- [ ] User experience refinement
- [ ] Performance optimization
- [ ] Edge case handling
- [ ] Cross-browser testing

### Week 4: Launch Preparation
- [ ] Production deployment
- [ ] Analytics setup
- [ ] Performance monitoring
- [ ] User feedback collection

## 🚀 Quick Start Commands

```bash
# Start development
npm run dev

# Run population script
node scripts/populate-supabase.js

# Test ranking interface
npm run dev:ranking

# Build for production
npm run build
```

## 🎯 Success Metrics

- **Engagement**: Average time spent ranking
- **Accuracy**: How close crowd wisdom is to expert consensus
- **Participation**: Number of unique rankings submitted
- **Retention**: Users returning to update rankings

## 📊 Technical Architecture

### Real-time Updates
```typescript
// Supabase real-time subscription
const channel = supabase
  .channel('rankings')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, handleNewVote)
  .subscribe();
```

### Performance Optimization
- **Incremental updates**: Only recalculate affected rankings
- **Caching**: Store intermediate results
- **Database indexing**: Optimize query performance
- **CDN**: Static asset delivery

---

## 🏆 Ready to Build the Ultimate NBA Ranking?

This isn't just another ranking app - it's a **living, breathing** representation of basketball fan collective intelligence. Every vote contributes to creating the most accurate NBA top 25 ever assembled.

**Next Steps:**
1. ✅ Set up your environment
2. ✅ Run the population script
3. 🚧 Complete the player selection and ranking interface
4. ⏱️ Implement the ranking submission system
5. ⏱️ Build the ranking aggregation algorithm
6. ⏱️ Deploy and watch the wisdom emerge

*Powered by Wikipedia, Supabase, and the collective wisdom of basketball fans worldwide.*
