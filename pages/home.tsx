// pages/home.tsx
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';
import Dashboard1 from '@/components/Dashboard/Dashboard1';
import Dashboard00 from "@/components/Dashboard/Dashboard";
import Dashboard2 from '@/components/Dashboard/Dashboard2';
import Dashboard3 from '@/components/Dashboard/Dashboard3';

export default function Home() {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4">This page is only accessible if you are signed in.</p>
          <Dashboard1/>
          <Dashboard00/>
          <Dashboard2/>
          <Dashboard3/>
      </div>
    </PrivateRoute>
  );
}
