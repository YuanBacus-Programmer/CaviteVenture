import React from 'react';
import Navbar from '../../components/NavbarSuperAdmin';
import PrivateRoute from '../../components/PrivateRoute';

const Exhibit = () => {
  return (
    <>
    <PrivateRoute>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Exhibit</h1>
        <p>This is the Exhibit page.</p>
      </div>
      </PrivateRoute>
    </>
  );
};

export default Exhibit;
