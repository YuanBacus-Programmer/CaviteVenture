"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const { signOut } = useAuth(); // Get signOut function from useAuth

  // To highlight the active link
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/superadmin/dashboard" className={`hover:underline ${isActive('/superadmin/dashboard') ? 'font-bold' : ''}`}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/superadmin/exhibit" className={`hover:underline ${isActive('/superadmin/exhibit') ? 'font-bold' : ''}`}>
            Exhibit
          </Link>
        </li>
        <li>
          <Link href="/superadmin/events" className={`hover:underline ${isActive('/superadmin/events') ? 'font-bold' : ''}`}>
            Events
          </Link>
        </li>
        <li>
          <Link href="/superadmin/profile" className={`hover:underline ${isActive('/superadmin/profile') ? 'font-bold' : ''}`}>
            Profile
          </Link>
        </li>
        <li>
          <button
            onClick={signOut} // Call signOut on click
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
