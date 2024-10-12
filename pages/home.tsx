// pages/home.tsx
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4">This page is only accessible if you are signed in.</p>
      </div>
    </PrivateRoute>
  );
}
