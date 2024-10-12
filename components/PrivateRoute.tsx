// components/PrivateRoute.tsx
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to /signin if not authenticated and loading is complete
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Show a loading indicator or null while loading is true
  if (loading) {
    return <div>Loading...</div>; // Customize this loading indicator as needed.
  }

  // Render the children only if the user is authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default PrivateRoute;
