import { Link } from 'react-router';

/**
 * NotFoundPage — rendered on /not-found and all unmatched (*) routes.
 */
const NotFoundPage = () => (
  <div>
    <h1>404 — Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Return to Home</Link>
  </div>
);

export default NotFoundPage;
