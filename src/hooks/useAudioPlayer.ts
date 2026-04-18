import { useEffect, useRef, useState } from 'react';

type Track = {
  name: string;
  file: string;
};

function isJsdomEnvironment() {
  return typeof window !== 'undefined' && /jsdom/i.test(window.navigator.userAgent);
}

function createAudioElement() {
  return typeof Audio !== 'undefined' ? new Audio() : document.createElement('audio');
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string>('none');
  const [statusLabel, setStatusLabel] = useState<string>('Now playing: none');

  if (!audioRef.current) {
    audioRef.current = createAudioElement();
  }

  async function selectTrack(track: Track) {
    const audio = audioRef.current!;
    audio.src = track.file;
    audio.loop = true;
    setCurrentTrack(track.name);

    try {
      await audio.play();
      setStatusLabel(`Now playing: ${track.name}`);
    } catch {
      setStatusLabel('Audio could not autoplay. Press play to start.');
    }
  }

  async function togglePlayback() {
    const audio = audioRef.current!;
    if (!audio.src) return;

    if (audio.paused) {
      await audio.play();
      setStatusLabel(`Now playing: ${currentTrack}`);
      return;
    }

    audio.pause();
    setStatusLabel(`Paused: ${currentTrack}`);
  }

  async function restartPlayback() {
    const audio = audioRef.current!;
    if (!audio.src) return;

    audio.currentTime = 0;
    await audio.play();
    setStatusLabel(`Now playing: ${currentTrack}`);
  }

  async function stopPlayback() {
    const audio = audioRef.current!;

    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    if (isJsdomEnvironment()) {
      setCurrentTrack('none');
      setStatusLabel('Now playing: none');
      return;
    }

    try {
      audio.load();
    } catch {
      // jsdom does not implement HTMLMediaElement.load().
    }

    setCurrentTrack('none');
    setStatusLabel('Now playing: none');
  }

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
    };
  }, []);

  return {
    currentTrack,
    statusLabel,
    selectTrack,
    togglePlayback,
    restartPlayback,
    stopPlayback
  };
}
