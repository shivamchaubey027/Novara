import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Novara</h3>
            <p className="text-slate-400 mb-4">
              Your elegant destination for buying and selling books, connecting readers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-slate-400 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/buy">
                  <a className="text-slate-400 hover:text-white transition-colors">Buy Books</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-slate-400 hover:text-white transition-colors">Sell Books</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <a className="text-slate-400 hover:text-white transition-colors">Blogs</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Returns</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Safety</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-slate-400">&copy; 2023 Novara. All rights reserved.</p>
            <p className="text-slate-400 mt-2 sm:mt-0 flex items-center">
              Made with <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" /> for book lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
