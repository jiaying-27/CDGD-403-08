import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function RouteErrorPage() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  const description = error instanceof Error
    ? error.message
    : 'The page could not be rendered. You can return home and try again.';

  return (
    <main className="route-error-page">
      <div className="route-error-card">
        <p className="eyebrow">Soundweb</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="enter-button" to="/">
          Return Home
        </Link>
      </div>
    </main>
  );
}
