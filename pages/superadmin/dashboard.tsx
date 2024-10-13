import React, { useEffect, useState } from 'react';
import Navbar from '../../components/NavbarSuperAdmin';
import PrivateRoute from '../../components/PrivateRoute';
import AllVisit from '@/components/AllVisit';
import { User, Settings, FileText } from 'lucide-react';

// Define type for the DashboardCard props
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // More explicit type for the icon
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
    <div className="p-3 rounded-full bg-primary/10">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [maleCount, setMaleCount] = useState<number>(0);
  const [femaleCount, setFemaleCount] = useState<number>(0);
  const [otherCount, setOtherCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setTotalUsers(data.totalUsers);
        setMaleCount(data.male);
        setFemaleCount(data.female);
        setOtherCount(data.other);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics');
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome to the Superadmin Dashboard!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard title="Total Users" value={totalUsers} icon={User} />
              <DashboardCard title="Male" value={maleCount} icon={FileText} />
              <DashboardCard title="Female" value={femaleCount} icon={Settings} />
              <DashboardCard title="Other" value={otherCount} icon={Settings} />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Visit Statistics</h2>
              <AllVisit />
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;
