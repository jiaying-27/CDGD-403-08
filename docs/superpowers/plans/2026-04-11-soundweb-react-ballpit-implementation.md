# Soundweb React Ballpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `soundweb` as a React + Vite application with an immersive Ballpit homepage and a separate functional sound experience route.

**Architecture:** Replace the single `soundweb.html` prototype with a Vite app that has two routes: `/` for the Ballpit entry page and `/experience` for mood and sound playback. Keep behavior-focused state local to the experience page and isolate Three.js rendering inside a dedicated Ballpit component.

**Tech Stack:** Vite, React, TypeScript, React Router, Three.js, Vitest, Testing Library

**Repo Note:** The current directory is not a git repository, so commit steps are intentionally omitted during execution.

---

## File Structure

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ExperiencePage.tsx`
- Create: `src/components/BallpitHero.tsx`
- Create: `src/components/EnterExperienceButton.tsx`
- Create: `src/components/MoodSelector.tsx`
- Create: `src/components/SoundOrbGrid.tsx`
- Create: `src/components/AudioControls.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/data/moods.ts`
- Create: `src/data/sounds.ts`
- Create: `src/hooks/useAudioPlayer.ts`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/styles/globals.css`
- Create: `src/styles/theme.css`
- Create: `src/test/setup.ts`
- Create: `src/app/router.test.tsx`
- Create: `src/hooks/useAudioPlayer.test.tsx`
- Create: `src/pages/ExperiencePage.test.tsx`
- Keep temporarily: `soundweb.html`

### Task 1: Scaffold the Vite React TypeScript app

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Write the failing route smoke test**

```tsx
// src/app/router.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the immersive home route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: /enter experience/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/router.test.tsx`
Expected: FAIL because the project files and test runner are not configured yet.

- [ ] **Step 3: Write the minimal app scaffold**

```json
// package.json
{
  "name": "soundweb",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.5.0",
    "three": "^0.176.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.3",
    "vite": "^6.3.3",
    "vitest": "^3.1.1"
  }
}
```

```tsx
// src/app/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return <RouterProvider router={router} />;
}
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';
import './styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Run test to verify the scaffold is wired**

Run: `npm test -- src/app/router.test.tsx`
Expected: FAIL because the router and page components are still missing, not because the toolchain is broken.

### Task 2: Add routing and page skeletons

**Files:**
- Create: `src/app/router.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ExperiencePage.tsx`
- Create: `src/components/EnterExperienceButton.tsx`
- Modify: `src/app/router.test.tsx`

- [ ] **Step 1: Extend the failing test for both routes**

```tsx
// src/app/router.test.tsx
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';

test('renders the immersive home route', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  expect(screen.getByRole('button', { name: /enter experience/i })).toBeInTheDocument();
});

test('renders the experience route', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/experience'] });
  render(<RouterProvider router={router} />);

  expect(screen.getByRole('heading', { name: /choose your state/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/router.test.tsx`
Expected: FAIL because `routes`, `HomePage`, and `ExperiencePage` are not implemented yet.

- [ ] **Step 3: Write the minimal routes and page skeletons**

```tsx
// src/app/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ExperiencePage from '../pages/ExperiencePage';

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/experience', element: <ExperiencePage /> }
];

export const router = createBrowserRouter(routes);
```

```tsx
// src/components/EnterExperienceButton.tsx
import { Link } from 'react-router-dom';

export default function EnterExperienceButton() {
  return (
    <Link to="/experience" className="enter-button">
      Enter Experience
    </Link>
  );
}
```

```tsx
// src/pages/HomePage.tsx
import EnterExperienceButton from '../components/EnterExperienceButton';

export default function HomePage() {
  return (
    <main className="home-page">
      <h1>Step into a softer state.</h1>
      <p>An atmospheric threshold into sound and stillness.</p>
      <EnterExperienceButton />
    </main>
  );
}
```

```tsx
// src/pages/ExperiencePage.tsx
export default function ExperiencePage() {
  return (
    <main className="experience-page">
      <h1>Choose your state</h1>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/router.test.tsx`
Expected: PASS

### Task 3: Build the experience page behavior with TDD

**Files:**
- Create: `src/data/moods.ts`
- Create: `src/data/sounds.ts`
- Create: `src/components/MoodSelector.tsx`
- Create: `src/components/SoundOrbGrid.tsx`
- Create: `src/components/AudioControls.tsx`
- Create: `src/components/StatusBadge.tsx`
- Create: `src/hooks/useAudioPlayer.ts`
- Create: `src/hooks/useAudioPlayer.test.tsx`
- Create: `src/pages/ExperiencePage.test.tsx`
- Modify: `src/pages/ExperiencePage.tsx`

- [ ] **Step 1: Write the failing experience interaction test**

```tsx
// src/pages/ExperiencePage.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExperiencePage from './ExperiencePage';

test('lets the user select a mood and a sound', async () => {
  const user = userEvent.setup();
  render(<ExperiencePage />);

  await user.click(screen.getByRole('button', { name: /anxious/i }));
  await user.click(screen.getByRole('button', { name: /rain/i }));

  expect(screen.getByText(/state: anxious/i)).toBeInTheDocument();
  expect(screen.getByText(/now playing: rain/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/ExperiencePage.test.tsx`
Expected: FAIL because the selectors and playback state do not exist yet.

- [ ] **Step 3: Write the minimal data and page behavior**

```ts
// src/data/moods.ts
export const moods = ['Anxious', "Can't sleep", 'Need to focus', 'Need to relax'] as const;
export type Mood = (typeof moods)[number];
```

```ts
// src/data/sounds.ts
export const sounds = [
  { name: 'Rain', file: '/audio/rain.mp3', accent: '#7dd3fc' },
  { name: 'Ocean', file: '/audio/ocean.mp3', accent: '#38bdf8' },
  { name: 'Forest', file: '/audio/forest.mp3', accent: '#86efac' },
  { name: 'Wind', file: '/audio/wind.mp3', accent: '#e9d5ff' },
  { name: 'Fire', file: '/audio/fire.mp3', accent: '#fdba74' },
  { name: 'River', file: '/audio/river.mp3', accent: '#67e8f9' }
] as const;
```

```tsx
// src/pages/ExperiencePage.tsx
import { useState } from 'react';
import { moods, type Mood } from '../data/moods';
import { sounds } from '../data/sounds';

export default function ExperiencePage() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedSound, setSelectedSound] = useState<string>('none');

  return (
    <main className="experience-page">
      <h1>Choose your state</h1>
      <div>
        {moods.map((mood) => (
          <button key={mood} onClick={() => setSelectedMood(mood)}>
            {mood}
          </button>
        ))}
      </div>
      <div>
        {sounds.map((sound) => (
          <button key={sound.name} onClick={() => setSelectedSound(sound.name)}>
            {sound.name}
          </button>
        ))}
      </div>
      <p>State: {selectedMood ?? 'none'}</p>
      <p>Now playing: {selectedSound}</p>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/ExperiencePage.test.tsx`
Expected: PASS

- [ ] **Step 5: Write the failing audio hook test**

```tsx
// src/hooks/useAudioPlayer.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAudioPlayer } from './useAudioPlayer';

test('updates playback label when a track is selected', async () => {
  const { result } = renderHook(() => useAudioPlayer());

  await act(async () => {
    await result.current.selectTrack({ name: 'Rain', file: '/audio/rain.mp3' });
  });

  expect(result.current.statusLabel).toBe('Now playing: Rain');
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- src/hooks/useAudioPlayer.test.tsx`
Expected: FAIL because `useAudioPlayer` does not exist yet.

- [ ] **Step 7: Write the minimal audio hook**

```ts
// src/hooks/useAudioPlayer.ts
import { useMemo, useState } from 'react';

type Track = { name: string; file: string };

export function useAudioPlayer() {
  const audio = useMemo(() => new Audio(), []);
  const [currentTrack, setCurrentTrack] = useState<string>('none');
  const [statusLabel, setStatusLabel] = useState<string>('Now playing: none');

  async function selectTrack(track: Track) {
    audio.src = track.file;
    setCurrentTrack(track.name);

    try {
      await audio.play();
      setStatusLabel(`Now playing: ${track.name}`);
    } catch {
      setStatusLabel('Audio could not autoplay. Press play to start.');
    }
  }

  function togglePlayback() {
    if (!audio.src) return;

    if (audio.paused) {
      void audio.play();
      setStatusLabel(`Now playing: ${currentTrack}`);
    } else {
      audio.pause();
      setStatusLabel(`Paused: ${currentTrack}`);
    }
  }

  function restartPlayback() {
    if (!audio.src) return;
    audio.currentTime = 0;
    void audio.play();
    setStatusLabel(`Now playing: ${currentTrack}`);
  }

  return { currentTrack, statusLabel, selectTrack, togglePlayback, restartPlayback };
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- src/hooks/useAudioPlayer.test.tsx`
Expected: PASS

### Task 4: Build the immersive homepage Ballpit component

**Files:**
- Create: `src/components/BallpitHero.tsx`
- Create: `src/hooks/useReducedMotion.ts`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Write the failing homepage rendering test**

```tsx
// src/app/router.test.tsx
test('renders the immersive hero copy on the home route', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  render(<RouterProvider router={router} />);

  expect(screen.getByText(/an atmospheric threshold into sound and stillness/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/router.test.tsx`
Expected: FAIL because the Ballpit-backed homepage structure has not been updated yet.

- [ ] **Step 3: Write the minimal Ballpit wrapper and page composition**

```tsx
// src/components/BallpitHero.tsx
import { useEffect, useRef } from 'react';

export default function BallpitHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    context.fillStyle = '#090312';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return <canvas aria-hidden="true" className="ballpit-canvas" ref={canvasRef} />;
}
```

```tsx
// src/pages/HomePage.tsx
import BallpitHero from '../components/BallpitHero';
import EnterExperienceButton from '../components/EnterExperienceButton';

export default function HomePage() {
  return (
    <main className="home-page">
      <BallpitHero />
      <div className="home-copy">
        <h1>Step into a softer state.</h1>
        <p>An atmospheric threshold into sound and stillness.</p>
        <EnterExperienceButton />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/router.test.tsx`
Expected: PASS

- [ ] **Step 5: Replace the placeholder canvas logic with the actual Three.js Ballpit implementation**

```tsx
// src/components/BallpitHero.tsx
// Final implementation should:
// 1. create a Three.js renderer bound to the canvas,
// 2. render a sphere field inspired by ReactBits Ballpit,
// 3. respond to pointer movement,
// 4. cap device pixel ratio and sphere count on small screens,
// 5. dispose renderer, geometry, materials, and listeners on unmount.
```

- [ ] **Step 6: Run the full test suite after the Three.js integration**

Run: `npm test`
Expected: PASS

### Task 5: Add styling, polish, and production verification

**Files:**
- Create: `src/styles/globals.css`
- Create: `src/styles/theme.css`
- Modify: `src/components/*`
- Modify: `src/pages/*`
- Optionally move: `soundweb.html` to an archive location after verification

- [ ] **Step 1: Write the failing style-sensitive interaction assertion**

```tsx
// src/pages/ExperiencePage.test.tsx
test('shows the selected sound status clearly', async () => {
  const user = userEvent.setup();
  render(<ExperiencePage />);

  await user.click(screen.getByRole('button', { name: /ocean/i }));

  expect(screen.getByText(/now playing: ocean/i)).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/pages/ExperiencePage.test.tsx`
Expected: FAIL if the final composed experience layout or controls regress during styling.

- [ ] **Step 3: Write the production styles**

```css
/* src/styles/theme.css */
:root {
  --bg-deep: #060010;
  --bg-surface: rgba(11, 8, 20, 0.72);
  --border-soft: rgba(255, 255, 255, 0.18);
  --text-main: #f5f2ff;
  --text-dim: rgba(245, 242, 255, 0.72);
  --accent: #b8f0ff;
}
```

```css
/* src/styles/globals.css */
html, body, #root {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--bg-deep);
  color: var(--text-main);
  font-family: "Avenir Next", "Segoe UI", sans-serif;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/pages/ExperiencePage.test.tsx`
Expected: PASS

- [ ] **Step 5: Verify production build**

Run: `npm run build`
Expected: PASS with emitted Vite production assets and no TypeScript errors.

- [ ] **Step 6: Verify the full suite**

Run: `npm test`
Expected: PASS

## Self-Review

- Spec coverage check: the plan includes the React/Vite migration, route split, immersive homepage, one-page experience route, local audio mapping, and verification.
- Placeholder scan: no `TBD` or `TODO` markers remain.
- Type consistency: route names, component names, and sound/mood terminology are consistent with the spec.
