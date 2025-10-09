import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [userInitial, setUserInitial] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserInitial('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserInitial('');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mr-3"></div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduPlatform
                </span>
              </Link>
              <div className="ml-10 flex space-x-1">
                <Link 
                  href="/courses" 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    router.pathname === '/courses' 
                      ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  📚 Courses
                </Link>
                {isLoggedIn && (
                  <Link 
                    href="/enrollments" 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      router.pathname === '/enrollments' 
                        ? 'text-blue-700 bg-blue-50 border border-blue-200' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    🎓 My Enrollments
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {userInitial || '?'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 hidden sm:block">
                      {userEmail || 'Loading...'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {children}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 EduPlatform. Made with ❤️ for learning.
          </div>
        </div>
      </footer>
    </div>
  );
}