# Soundweb React Ballpit Redesign

## Summary

Soundweb will be migrated from a single-file HTML prototype into a lightweight
React + Vite application. The new product shape is a two-route experience:

- `/` is a full-screen immersive entry page with a Ballpit-style interactive
  background.
- `/experience` is the functional sound experience page where users choose a
  mood and then choose and play a natural white-noise sound.

The redesign intentionally drops the existing four-page flow. The new homepage
is not a functional wizard. It acts as an atmospheric entry point that sends
the user into the actual experience.

## Goals

- Preserve the core user goal: pick a state and enter a natural sound
  experience.
- Rebuild the site using a maintainable React structure instead of a single
  HTML file.
- Introduce a Ballpit-style immersive homepage close to the ReactBits visual
  direction.
- Keep the stack lightweight and appropriate for a static interactive site.
- Continue using local audio files for the experience page.

## Non-Goals

- Reproduce the current four-screen prototype exactly.
- Add backend services, accounts, analytics, or persistence.
- Introduce a heavier framework such as Next.js.
- Turn the homepage into a conventional marketing landing page with multiple
  content sections.

## Recommended Stack

- Vite
- React
- React Router
- Three.js

### Why this stack

Vite keeps the project small and fast for a static experience site. React
provides the component and state structure the current prototype lacks. React
Router cleanly separates the immersive entry route from the functional sound
route. Three.js is the correct level of graphics tooling for a Ballpit-style
interactive background.

### Why not change the stack further

The project does not need SSR, server components, or framework-level routing.
Moving to Next.js or a similar framework would add complexity without improving
the core experience.

## Product Shape

### Route 1: `/`

This route is an art-directed entry surface, not a form and not a settings
page.

#### Purpose

- Establish atmosphere immediately.
- Make the first impression feel like an installation piece.
- Invite the user into the experience with minimal text.

#### Visual direction

- Full-screen Ballpit-inspired animated background.
- Sparse foreground UI.
- One short title.
- One short line of support text.
- One primary entry action that navigates to `/experience`.

#### Interaction

- Pointer movement subtly influences the background.
- The page remains readable and intentional, but the visual system is dominant.
- No mood selection and no audio playback happens here.

### Route 2: `/experience`

This route contains the functional product experience.

#### Purpose

- Let the user choose a current state.
- Let the user choose a sound source.
- Play and control the selected sound.

#### Interaction model

The current four-page sequence is replaced with a one-page interaction model.
The user should be able to:

- see the selected mood clearly,
- choose or switch between moods quickly,
- choose a natural sound source from the available set,
- start, pause, and restart playback,
- understand what is currently playing.

#### Content retained from the prototype

Moods:

- Anxious
- Can't sleep
- Need to focus
- Need to relax

Sounds:

- Rain
- Ocean
- Forest
- Wind
- Fire
- River

## Information Architecture

### App shell

The app should use a minimal shell with route-level composition instead of a
large global layout.

### Proposed structure

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    BallpitHero.tsx
    EnterExperienceButton.tsx
    MoodSelector.tsx
    SoundOrbGrid.tsx
    AudioControls.tsx
    StatusBadge.tsx
  data/
    moods.ts
    sounds.ts
  hooks/
    useAudioPlayer.ts
    useReducedMotion.ts
  pages/
    HomePage.tsx
    ExperiencePage.tsx
  styles/
    globals.css
    theme.css
public/
  audio/
```

## Ballpit Integration Strategy

### Chosen approach

Use the React + Vite application architecture, but implement the homepage
Ballpit as a dedicated local component inspired by the ReactBits Ballpit
background.

### Reasoning

This gives the project a clean product structure while still delivering a
visual result close to the reference effect. The Ballpit implementation should
be isolated so the rest of the application is not coupled to demo-style code.

### Component boundary

`BallpitHero.tsx` owns:

- canvas lifecycle,
- Three.js scene setup,
- resize handling,
- animation loop,
- pointer interaction,
- cleanup on unmount,
- mobile/performance downgrades.

The page component should not contain raw rendering logic.

### Performance constraints

The component should:

- cap device pixel ratio,
- reduce sphere count on smaller screens,
- support reduced motion gracefully,
- avoid blocking route transitions,
- clean up WebGL resources on unmount.

## Audio Strategy

### Source of truth

Audio remains local and is served from `public/audio/`.

### Mapping

Use a typed config object in `src/data/sounds.ts` to define:

- label,
- filename,
- optional visual metadata such as accent color.

### Current blocker

The current directory does not contain any audio files even though the existing
prototype references `rain.mp3`, `ocean.mp3`, and similar assets. The new app
should still be built around local files, but actual playback will require
those assets to be added under `public/audio/`.

## State Model

### Route-level state

The homepage does not need persistent state.

### Experience state

The experience page manages:

- selected mood,
- selected sound,
- playback status,
- current time and duration when available.

This state can live locally inside the experience page plus a focused
`useAudioPlayer` hook. No global state manager is needed.

## Visual Language

### Homepage

- dark immersive base,
- luminous spheres,
- strong depth and glow,
- restrained copy,
- cinematic spacing,
- clear but minimal call to action.

### Experience page

- still atmospheric, but more functional than the homepage,
- stronger legibility for controls,
- consistent palette ties back to the immersive landing,
- selected mood and selected sound should always be obvious.

## Navigation Flow

1. User lands on `/`.
2. User experiences the immersive Ballpit entry page.
3. User activates the entry action.
4. App navigates to `/experience`.
5. User selects a mood.
6. User selects a sound.
7. Audio plays and can be controlled.

## Error Handling

### Missing audio files

If a file is missing, the UI should show a clear message instead of failing
silently.

### Autoplay restrictions

Playback should be started in direct response to a user gesture whenever
possible. If the browser blocks playback, the UI should tell the user to press
play explicitly.

### WebGL or rendering failure

If the Ballpit background fails to initialize, the homepage should fall back to
a static atmospheric background rather than a blank screen.

## Accessibility

- The entry button must be keyboard reachable.
- Mood and sound controls must be keyboard reachable.
- Visual-only state must have text equivalents.
- Reduced motion users should receive a calmer background treatment.
- Contrast on the experience page should favor usability over pure visual drama.

## Testing Strategy

### Manual verification

- Homepage loads on desktop and mobile viewport sizes.
- Homepage transitions to experience route correctly.
- Mood selection updates visible state correctly.
- Sound selection starts or attempts playback correctly.
- Pause and restart controls work correctly.
- Missing-file and blocked-playback messages are understandable.

### Automated coverage

Add focused tests for:

- route rendering,
- experience state transitions,
- audio hook behavior where practical.

Avoid trying to unit test the full Three.js rendering layer deeply. That effort
is not worth the cost here.

## Migration Plan Shape

Implementation should follow this order:

1. Scaffold the React + Vite application.
2. Add routing and page skeletons.
3. Port the content model for moods and sounds.
4. Build the experience page behavior first.
5. Build the immersive homepage Ballpit component.
6. Add audio assets wiring and error states.
7. Validate desktop and mobile behavior.

## Open Dependencies

- `react`
- `react-dom`
- `vite`
- `react-router-dom`
- `three`

## Risks

- The Ballpit background can become too heavy on lower-end mobile devices.
- Missing audio assets will prevent end-to-end playback validation.
- If the homepage visual system becomes too dominant, the entry call to action
  may lose clarity.

## Decision Record

- Use approach 1 from the explored options.
- Migrate to React + Vite.
- Keep the homepage as an immersive entry page only.
- Move functional selection and playback into a separate experience route.
- Continue using the existing mood list and local audio file model.
