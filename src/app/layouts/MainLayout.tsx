import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

export function MainLayout() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}
