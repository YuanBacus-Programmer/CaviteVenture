import React from 'react';
import Navbar from '../../components/NavbarSuperAdmin';
import PrivateRoute from '../../components/PrivateRoute';

const Dashboard = () => {
  return (
    <>
    <PrivateRoute>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to the Superadmin Dashboard!</p>
      </div>
      </PrivateRoute>
    </>
  );
};

export default Dashboard;
