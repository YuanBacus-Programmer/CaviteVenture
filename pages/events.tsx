// pages/events.tsx
import PrivateRoute from '../components/PrivateRoute';
import Navbar from '../components/Navbar';

const Events = () => {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Events Page</h1>
      </div>
    </PrivateRoute>
  );
};

export default Events;
