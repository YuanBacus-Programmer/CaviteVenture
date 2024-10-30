// pages/exhibit.tsx
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';
import Exhibitpro from '@/components/Exhibit';

const Exhibit = () => {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Exhibitpro/>
      </div>
    </PrivateRoute>
  );
};

export default Exhibit;
