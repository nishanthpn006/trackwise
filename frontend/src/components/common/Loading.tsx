/**
 * Loading — reusable spinner/loading indicator.
 * Used in GlobalLoadingPage, Suspense fallbacks, and button states.
 */
const Loading = () => (
  <div role="status" aria-label="Loading">
    <span>Loading…</span>
  </div>
);

export default Loading;
