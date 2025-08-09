export interface CrowdLevel {
  id: string;
  title: string;
  description: string;
  colors: [string, string];
  textColor: string;
  dotColor: string;
}

export const crowdLevels: CrowdLevel[] = [
  {
    id: 'quiet',
    title: 'Quiet',
    description: 'Plenty of space, very peaceful',
    colors: ['#DCFCE7', '#BBF7D0'] as [string, string],
    textColor: '#16A34A',
    dotColor: '#22c55e',
  },
  {
    id: 'not_busy',
    title: 'Not Busy',
    description: 'Some people around, still comfortable',
    colors: ['#FEF3C7', '#FDE68A'] as [string, string],
    textColor: '#D97706',
    dotColor: '#eab308',
  },
  {
    id: 'busy',
    title: 'Busy',
    description: 'Getting crowded, limited seating',
    colors: ['#FED7D7', '#FECACA'] as [string, string],
    textColor: '#EA580C',
    dotColor: '#F97316',
  },
  {
    id: 'very_busy',
    title: 'Very Busy',
    description: 'Packed, hard to find a seat',
    colors: ['#FEE2E2', '#FECACA'] as [string, string],
    textColor: '#EF4444',
    dotColor: '#DC2626',
  },
];

// Gets color theme based on level of busy
export const crowdLevelColorMap = crowdLevels.reduce((acc, level) => {
  acc[level.id] = {
    bg: level.colors,
    text: level.textColor,
    dot: level.dotColor,
  };
  return acc;
}, {} as Record<string, { bg: [string, string]; text: string; dot: string }>);

// Returns how busy based on selection of crowd level
export const crowdLevelTitleMap = crowdLevels.reduce((acc, level) => {
  acc[level.id] = level.title;
  return acc;
}, {} as Record<string, string>);
