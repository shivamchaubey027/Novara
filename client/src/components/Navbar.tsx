import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-bold text-primary cursor-pointer">Novara</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/" className={`font-medium text-lg transition-colors duration-200 ${
              isActive('/') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-700 hover:text-gold'
            }`}>
              Home
            </Link>
            <Link href="/buy" className={`font-medium text-lg transition-colors duration-200 ${
              isActive('/buy') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-700 hover:text-gold'
            }`}>
              Buy
            </Link>
            <Link href="/blogs" className={`font-medium text-lg transition-colors duration-200 ${
              isActive('/blogs') ? 'text-gold border-b-2 border-gold pb-1' : 'text-gray-700 hover:text-gold'
            }`}>
              Blogs
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className={`font-medium transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-primary' : 'text-slate-700 hover:text-primary'
                }`}>
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/"
                className="text-slate-700 hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/buy"
                className="text-slate-700 hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Buy
              </Link>
              <Link 
                href="/blogs"
                className="text-slate-700 hover:text-primary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blogs
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-slate-700 hover:text-primary font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button 
                    className="bg-primary text-white hover:bg-slate-800 w-fit"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
