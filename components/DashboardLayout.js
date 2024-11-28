import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from './Footer';
import {
  HomeIcon,
  BeakerIcon,
  ClockIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        localStorage.removeItem('user');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Supplements', href: '/supplements', icon: BeakerIcon },
    { name: 'History', href: '/dashboard/history', icon: ClockIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-12">
              <Link
                href="/dashboard"
                className="text-xl font-medium text-blue-600"
              >
                <BeakerIcon className="h-8 w-8 inline-block mr-2" />
                Vitamin Tracker
              </Link>
              <div className="hidden md:flex space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 ${
                        router.pathname === item.href
                          ? 'text-blue-600 font-medium'
                          : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{user.email}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-8 py-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
