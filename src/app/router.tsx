import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ExperiencePage from '../pages/ExperiencePage';
import RouteErrorPage from '../pages/RouteErrorPage';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/experience',
    element: <ExperiencePage />,
    errorElement: <RouteErrorPage />
  }
];

export const router = createBrowserRouter(routes);
