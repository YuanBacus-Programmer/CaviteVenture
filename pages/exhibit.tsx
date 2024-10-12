// pages/exhibit.tsx
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';

const Exhibit = () => {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Exhibit Page</h1>
      </div>
    </PrivateRoute>
  );
};

export default Exhibit;
