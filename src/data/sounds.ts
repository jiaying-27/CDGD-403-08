import type { Mood } from './moods';

export type SoundPalette = readonly [string, string, string, string, string];

export type SoundOption = {
  readonly accent: string;
  readonly file: string;
  readonly gradient: string;
  readonly name: string;
  readonly palette: SoundPalette;
};

const soundCatalog = {
  Rain: {
    name: 'Rain',
    file: '/audio/rain.mp3',
    accent: '#97a9bb',
    gradient: 'radial-gradient(circle at 30% 30%, #bec9d3, #64778a)',
    palette: ['#516171', '#74879a', '#aab7c3', '#dde4ea', '#2f3b46']
  },
  Ocean: {
    name: 'Ocean',
    file: '/audio/ocean.mp3',
    accent: '#21426e',
    gradient: 'radial-gradient(circle at 30% 30%, #3f6aa1, #0d1b36)',
    palette: ['#102344', '#1c3f6f', '#426ca5', '#8ba6c8', '#071225']
  },
  'Flowing Stream': {
    name: 'Flowing Stream',
    file: '/audio/flowing%20stream.mp3',
    accent: '#9deaf0',
    gradient: 'radial-gradient(circle at 30% 30%, #defcff, #56c7cf)',
    palette: ['#1f7e88', '#49aeb7', '#9deaf0', '#e7fdff', '#103f46']
  },
  'Rustling Leaves': {
    name: 'Rustling Leaves',
    file: '/audio/rustling%20leaves.MP3',
    accent: '#a8eb7d',
    gradient: 'radial-gradient(circle at 30% 30%, #d4f8ae, #5faa56)',
    palette: ['#41793b', '#72bb61', '#a8eb7d', '#edf9d8', '#224321']
  },
  Forest: {
    name: 'Forest',
    file: '/audio/forest.mp3',
    accent: '#2c6840',
    gradient: 'radial-gradient(circle at 30% 30%, #5c8c66, #123420)',
    palette: ['#143420', '#24553a', '#3a714b', '#83a68c', '#0b1d12']
  },
  'Light Rain': {
    name: 'Light Rain',
    file: '/audio/light%20rain.mp3',
    accent: '#f7e8ef',
    gradient: 'radial-gradient(circle at 30% 30%, #fffafc, #efcfdc)',
    palette: ['#c39cab', '#e3c3cf', '#f7e8ef', '#fffafc', '#8d6b79']
  },
  Waterfall: {
    name: 'Waterfall',
    file: '/audio/waterfall.mp3',
    accent: '#f6e8a8',
    gradient: 'radial-gradient(circle at 30% 30%, #fff7cf, #e7d56e)',
    palette: ['#b79f3f', '#dbc55f', '#f6e8a8', '#fff9da', '#7f6d22']
  },
  'Wind on a Snowy Night': {
    name: 'Wind on a Snowy Night',
    file: '/audio/wind%20on%20a%20snowy%20night.mp3',
    accent: '#e9f1ff',
    gradient: 'radial-gradient(circle at 30% 30%, #f9fbff, #bdd0eb)',
    palette: ['#92a4be', '#becde0', '#e9f1ff', '#ffffff', '#66758e']
  },
  'Summer Cicadas': {
    name: 'Summer Cicadas',
    file: '/audio/summer%20cicadas.mp3',
    accent: '#f5c33b',
    gradient: 'radial-gradient(circle at 30% 30%, #ffe173, #e69a12)',
    palette: ['#9a6507', '#d18a0e', '#f5c33b', '#fff1ba', '#5f3904']
  },
  Fire: {
    name: 'Fire',
    file: '/audio/fire.mp3',
    accent: '#f9793d',
    gradient: 'radial-gradient(circle at 30% 30%, #ffb36d, #d83b21)',
    palette: ['#8d2413', '#d54b24', '#f9793d', '#ffc089', '#4d120a']
  }
} as const satisfies Record<string, SoundOption>;

function pickSound(name: keyof typeof soundCatalog): SoundOption {
  return soundCatalog[name];
}

export const soundsByMood: Record<Mood, readonly SoundOption[]> = {
  Anxious: [
    pickSound('Rain'),
    pickSound('Ocean'),
    pickSound('Flowing Stream'),
    pickSound('Rustling Leaves'),
    pickSound('Forest')
  ],
  "Can't sleep": [
    pickSound('Light Rain'),
    pickSound('Waterfall'),
    pickSound('Ocean'),
    pickSound('Wind on a Snowy Night'),
    pickSound('Flowing Stream')
  ],
  'Need to relax': [
    pickSound('Ocean'),
    pickSound('Light Rain'),
    pickSound('Summer Cicadas'),
    pickSound('Fire'),
    pickSound('Flowing Stream'),
    pickSound('Forest')
  ]
};

export const sounds = Object.values(soundCatalog) as readonly SoundOption[];

export function getSoundsForMood(mood: Mood) {
  return soundsByMood[mood];
}
