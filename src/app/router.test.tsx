import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';

test('renders the immersive home route', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  const { container } = render(<RouterProvider router={router} />);

  expect(screen.getByRole('link', { name: /enter experience/i })).toBeInTheDocument();
  expect(container.querySelector('.ballpit-demo-frame')).not.toBeNull();
  expect(container.querySelector('.home-stage-fullscreen')).not.toBeNull();
  expect(container.querySelector('.ballpit-canvas, .ballpit-fallback')).not.toBeNull();
});

test('renders the experience route', () => {
  const router = createMemoryRouter(routes, { initialEntries: ['/experience'] });
  render(<RouterProvider router={router} />);

  expect(screen.getByRole('heading', { level: 1, name: /choose your state/i })).toBeInTheDocument();
});
