// components/Navbar.tsx
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/home" legacyBehavior>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Home</a>
          </Link>
          <Link href="/exhibit" legacyBehavior>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Exhibit</a>
          </Link>
          <Link href="/events" legacyBehavior>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Events</a>
          </Link>
          <Link href="/profile" legacyBehavior>
            <a className="text-white hover:bg-gray-700 px-3 py-2 rounded">Profile</a>
          </Link>
        </div>
        <div>
          <button
            onClick={signOut}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
