import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ExperiencePage from './ExperiencePage';

test('follows the original experience flow from state selection to visual playback', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <ExperiencePage />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', { level: 1, name: /choose your state/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /anxious/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /can’t sleep|can't sleep/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /need to relax/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /need to focus/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/tap a floating sound orb/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /pause \/ play sound/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /anxious/i }));

  expect(screen.getByText(/tap a floating sound orb/i)).toBeInTheDocument();
  expect(screen.getByText(/state: anxious/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /random scene/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /rain/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ocean/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /flowing stream/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /rustling leaves/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /forest/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /summer cicadas/i })).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /rain/i }));

  expect(screen.getByRole('button', { name: /pause \/ play sound/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /restart sound/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /random scene/i })).not.toBeInTheDocument();
  expect(screen.getByText(/state: anxious/i)).toBeInTheDocument();
  expect(screen.getByText(/now playing: rain/i)).toBeInTheDocument();
  expect(screen.getByText(/· rain/i)).toBeInTheDocument();
});

test('renders mood-specific sound orbs with the updated gradient treatments', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <ExperiencePage />
    </MemoryRouter>
  );

  await user.click(screen.getByRole('button', { name: /anxious/i }));

  const rainOrb = screen.getByRole('button', { name: /rain/i });
  const oceanOrb = screen.getByRole('button', { name: /ocean/i });
  const streamOrb = screen.getByRole('button', { name: /flowing stream/i });

  expect(rainOrb.getAttribute('style')).toContain('#bec9d3');
  expect(rainOrb.getAttribute('style')).toContain('#64778a');
  expect(oceanOrb.getAttribute('style')).toContain('#3f6aa1');
  expect(oceanOrb.getAttribute('style')).toContain('#0d1b36');
  expect(streamOrb.getAttribute('style')).toContain('#defcff');
  expect(streamOrb.getAttribute('style')).toContain('#56c7cf');
});
