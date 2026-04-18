export const moods = ['Anxious', "Can't sleep", 'Need to relax'] as const;

export type Mood = (typeof moods)[number];
