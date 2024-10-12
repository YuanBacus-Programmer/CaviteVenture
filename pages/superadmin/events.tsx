import React from 'react';
import Navbar from '../../components/NavbarSuperAdmin';
import PrivateRoute from '../../components/PrivateRoute';

const Events = () => {
  return (
    <>
    <PrivateRoute>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <p>Manage your events here.</p>
      </div>
      </PrivateRoute>
    </>
  );
};

export default Events;
