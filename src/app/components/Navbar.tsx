import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { GraduationCap, LogIn, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 rounded-2xl px-4 sm:px-6 py-3 bg-[#ffaa1973]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          
          <div className="w-10 h-10 bg-[#0A2540] rounded-xl flex items-center justify-center shadow-sm">
            <GraduationCap className="w-5 h-5 text-[#F5A623]" />
          </div>
          <span className="font-bold text-xl text-[#0A2540] tracking-wide drop-shadow-sm">ARYAVARTA</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
          <div className="flex items-center gap-2 bg-white/30 px-2 py-1.5 rounded-xl border border-white/40 shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)]">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540]/80 hover:text-[#0A2540] hover:bg-white/50'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#0A2540] text-white shadow-md dark:bg-[#F5A623] dark:text-[#0A2540]' : 'text-[#0A2540]/80 hover:text-[#0A2540] hover:bg-white/50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'}`}
            >
              Features
            </NavLink>
            <NavLink 
              to="/dashboard/models" 
              className={({ isActive }) => `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540]/80 hover:text-[#0A2540] hover:bg-white/50'}`}
            >
              Model
            </NavLink>
            <NavLink 
              to="/dashboard/roadmap" 
              className={({ isActive }) => `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540]/80 hover:text-[#0A2540] hover:bg-white/50'}`}
            >
              Roadmap
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'bg-[#0A2540] text-white shadow-md dark:bg-[#F5A623] dark:text-[#0A2540]' : 'text-[#0A2540]/80 hover:text-[#0A2540] hover:bg-white/50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'}`}
            >
              About
            </NavLink>
          </div>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href="/#partner"
            className="px-6 py-2.5 bg-[#0A2540] text-white text-sm font-bold rounded-xl hover:bg-[#0d2e54] transition-colors shadow-lg shadow-[#0A2540]/20"
          >
            Partner with Us
          </a>
          <Link
            to="/admin/login"
            className="flex items-center gap-2 px-5 py-2.5 border border-white/50 bg-white/30 text-[#0A2540] text-sm font-bold rounded-xl hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            Admin
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg bg-white/30 border border-white/40 text-[#0A2540] hover:bg-white/50 transition-colors shadow-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-[#d99b32] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 rounded-2xl overflow-hidden p-4 space-y-2 mx-4">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540] hover:bg-white/50'}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#0A2540] text-white shadow-md dark:bg-[#F5A623] dark:text-[#0A2540]' : 'text-[#0A2540] hover:bg-white/50 dark:text-white dark:hover:bg-white/10'}`}
          >
            Features
          </NavLink>
          <NavLink 
            to="/dashboard/models" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540] hover:bg-white/50'}`}
          >
            Model
          </NavLink>
          <NavLink 
            to="/dashboard/roadmap" 
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#0A2540] text-white shadow-md' : 'text-[#0A2540] hover:bg-white/50'}`}
          >
            Roadmap
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => `block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-[#0A2540] text-white shadow-md dark:bg-[#F5A623] dark:text-[#0A2540]' : 'text-[#0A2540] hover:bg-white/50 dark:text-white dark:hover:bg-white/10'}`}
          >
            About
          </NavLink>
          <div className="pt-2 border-t border-white/30 flex flex-col gap-2 mt-2">
            <Link
              to="/#partner"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full px-5 py-3 bg-[#0A2540] text-white font-semibold rounded-lg text-center hover:bg-[#0d2e54] transition-colors shadow-md"
            >
              Partner with Us
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3 border border-white/50 bg-white/30 text-[#0A2540] font-semibold rounded-lg hover:bg-[#0A2540] hover:text-white transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
