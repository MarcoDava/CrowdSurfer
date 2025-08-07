export interface CrowdLevel {
  id: string;
  title: string;
  description: string;
  colors: [string, string];
  textColor: string;
  dotColor: string;
}

export const crowdLevels = [
  {
    id: 'quiet',
    title: 'Quiet',
    description: 'Plenty of space, very peaceful',
    colors: ['#DCFCE7', '#BBF7D0'] as [string, string],
    textColor: '#16A34A',
    dotColor: '#16A34A',
  },
  {
    id: 'not_busy',
    title: 'Not Busy',
    description: 'Some people around, still comfortable',
    colors: ['#FEF3C7', '#FDE68A'] as [string, string],
    textColor: '#D97706',
    dotColor: '#F59E0B',
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
    textColor: '#DC2626',
    dotColor: '#EF4444',
  },
];
