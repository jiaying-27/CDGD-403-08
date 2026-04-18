import { act, renderHook } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';

test('updates playback label when a track is selected', async () => {
  const { result } = renderHook(() => useAudioPlayer());

  await act(async () => {
    await result.current.selectTrack({ name: 'Rain', file: '/audio/rain.mp3' });
  });

  expect(result.current.statusLabel).toBe('Now playing: Rain');
});

test('exposes a way to stop and reset playback', async () => {
  const { result } = renderHook(() => useAudioPlayer());

  await act(async () => {
    await result.current.selectTrack({ name: 'Rain', file: '/audio/rain.mp3' });
  });

  expect('stopPlayback' in result.current).toBe(true);
  if (!('stopPlayback' in result.current)) {
    return;
  }

  await act(async () => {
    await result.current.stopPlayback();
  });

  expect(result.current.currentTrack).toBe('none');
  expect(result.current.statusLabel).toBe('Now playing: none');
});
