import Loading from '@/components/common/Loading';

/**
 * GlobalLoadingPage — shown during lazy-load boundaries and initial app bootstrap.
 */
const GlobalLoadingPage = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}
  >
    <Loading />
  </div>
);

export default GlobalLoadingPage;
