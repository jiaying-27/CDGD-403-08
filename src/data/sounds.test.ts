import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { sounds, soundsByMood } from './sounds';

describe('sounds data', () => {
  test('maps every referenced audio file to an existing file in public/audio', () => {
    for (const sound of sounds) {
      const relativePath = decodeURIComponent(sound.file.replace('/audio/', ''));
      const absolutePath = path.join(process.cwd(), 'public', 'audio', relativePath);

      expect(existsSync(absolutePath)).toBe(true);
    }
  });

  test('only uses sounds defined in the shared catalog for each mood', () => {
    const catalogNames = new Set(sounds.map((sound) => sound.name));

    for (const moodSounds of Object.values(soundsByMood)) {
      for (const sound of moodSounds) {
        expect(catalogNames.has(sound.name)).toBe(true);
      }
    }
  });
});
