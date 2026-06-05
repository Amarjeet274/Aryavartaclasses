import { Outlet } from 'react-router';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}