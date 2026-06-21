import { GameEvent } from '../types/game';

export const EVENT_POOL: GameEvent[] = [
  {
    id: 'ev1', category: 'VIRAL', weight: 15,
    title: 'Viral tweet!',
    description: 'A tech influencer tweeted about your product. Users are flooding in.',
    choices: [
      { text: 'Launch a campaign now ($2K)', effect: { cash: -2000, users: 200, reputation: 10 } },
      { text: 'Enjoy the organic growth', effect: { users: 100 } },
    ],
  },
  {
    id: 'ev2', category: 'CRISIS', weight: 20,
    title: 'Server outage',
    description: 'Your servers crashed for 4 hours. Users are complaining.',
    choices: [
      { text: 'Emergency fix ($5K)', effect: { cash: -5000, reputation: 5 } },
      { text: 'Push a hotfix yourself', effect: { teamMorale: -15, reputation: -8 } },
    ],
  },
  {
    id: 'ev3', category: 'INTERNAL', weight: 15,
    title: 'Investor interest',
    description: 'A VC reached out after seeing your growth numbers.',
    choices: [
      { text: 'Take the meeting', effect: { investorConfidence: 20 } },
      { text: 'Decline — focus on product', effect: { productQuality: 8 } },
    ],
  },
  {
    id: 'ev4', category: 'INTERNAL', weight: 15,
    title: 'Key engineer quit',
    description: 'Your lead engineer just accepted an offer at a big tech company.',
    choices: [
      { text: 'Counter-offer (+$3K/wk salary)', effect: { burnRate: 3000, teamMorale: 10 } },
      { text: 'Let them go', effect: { teamMorale: -20, productQuality: -10 } },
    ],
  },
  {
    id: 'ev5', category: 'COMPETITION', weight: 18,
    title: 'Competitor launched a clone',
    description: 'A well-funded rival just launched a product almost identical to yours.',
    choices: [
      { text: 'Double down on quality', effect: { productQuality: 12, teamMorale: -10 } },
      { text: 'Launch a pricing war', effect: { users: 300, revenue: -500 } },
    ],
  },
  {
    id: 'ev6', category: 'VIRAL', weight: 12,
    title: 'TechCrunch feature!',
    description: 'TechCrunch published a feature article about your startup.',
    choices: [
      { text: 'Use momentum for hiring', effect: { reputation: 20, investorConfidence: 15 } },
      { text: 'Use momentum for acquisition', effect: { users: 400, reputation: 10 } },
    ],
  },
  {
    id: 'ev7', category: 'INTERNAL', weight: 15,
    title: 'Team morale crisis',
    description: 'Your team is burned out. Productivity is dropping.',
    choices: [
      { text: 'Team offsite ($4K)', effect: { cash: -4000, teamMorale: 30 } },
      { text: 'Add perks (+$500/wk)', effect: { burnRate: 500, teamMorale: 15 } },
    ],
  },
  {
    id: 'ev8', category: 'MARKET', weight: 15,
    title: 'Regulatory scrutiny',
    description: 'Regulators are looking into startups in your sector.',
    choices: [
      { text: 'Hire a compliance consultant ($8K)', effect: { cash: -8000, reputation: 10, investorConfidence: 10 } },
      { text: 'Ignore it for now', effect: { investorConfidence: -20 } },
    ],
  },
];