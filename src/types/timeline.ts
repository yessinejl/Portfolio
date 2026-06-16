export type TimelineItemType = 'experience' | 'education';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  organization: string; // Entreprise ou École
  period: string; // ex: "01/2025 - 02/2025"
  description: string; // Multilignes supporté
  technologies?: string; // ex: "React, Node.js"
}

export interface TimelineData {
  items: TimelineItem[];
}
