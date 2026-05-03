import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, Menu, X, Sun, Moon, LogOut, User,
  Layout, Calendar, Library, HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isLanding) {
      navigate('/#' + id);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isLanding ? 'solid' : ''}`}>
        <div className="container d-flex align-center justify-between">
          {/* Logo */}
          <div className="d-flex align-center gap-2 logo-container" onClick={() => isLanding ? scrollToSection('home') : navigate('/')}>
            <div className="logo-icon">
              <Brain size={28} color="var(--primary-color)" />
            </div>
            <h2 className="logo-text">PlaceUp</h2>
          </div>

          {/* Desktop Nav Links (Landing Only) */}
          {isLanding && (
            <div className="nav-links hide-mobile">
              <span className="nav-link" onClick={() => scrollToSection('home')}>Home</span>
              <span className="nav-link" onClick={() => scrollToSection('features')}>Features</span>
              <span className="nav-link" onClick={() => scrollToSection('how-it-works')}>How it Works</span>
              <span className="nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
              <span className="nav-link" onClick={() => scrollToSection('contact')}>Contact</span>
            </div>
          )}

          {/* Desktop Dashboard Links (Logged In & Not Landing) */}
          {user && !isLanding && !isAuthPage && (
             <div className="nav-links hide-mobile">
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                <Link to="/weekly" className={`nav-link ${location.pathname === '/weekly' ? 'active' : ''}`}>Roadmap</Link>
                <Link to="/library" className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}>Library</Link>
                <Link to="/vault" className={`nav-link ${location.pathname === '/vault' ? 'active' : ''}`}>Vault</Link>
                <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
             </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex align-center gap-3">
            <button onClick={toggleTheme} className="neo-icon-btn theme-toggle" title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!user ? (
              <div className="d-flex gap-2 hide-mobile">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="neo-btn nav-btn">Login</button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button className="primary-btn nav-btn shadow-vibrant">Join Now</button>
                </Link>
              </div>
            ) : (
              <div className="d-flex align-center gap-2">
                <button className="neo-icon-btn hide-mobile" onClick={logout} title="Sign Out">
                  <LogOut size={18} color="#ef4444" />
                </button>
                <div className="user-badge hide-mobile" onClick={() => navigate('/profile')}>
                  <User size={16} />
                  <span>{user.name?.split(' ')[0]}</span>
                </div>
              </div>
            )}

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="d-flex justify-between align-center" style={{ marginBottom: '2rem' }}>
          <div className="d-flex align-center gap-2">
            <Brain size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0 }}>Menu</h3>
          </div>
          <button className="neo-icon-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {isLanding ? (
            <>
              <span className="nav-link-mobile" onClick={() => scrollToSection('home')}>Home</span>
              <span className="nav-link-mobile" onClick={() => scrollToSection('features')}>Features</span>
              <span className="nav-link-mobile" onClick={() => scrollToSection('how-it-works')}>How it Works</span>
              <span className="nav-link-mobile" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
              <span className="nav-link-mobile" onClick={() => scrollToSection('contact')}>Contact</span>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/weekly" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>Roadmap</Link>
              <Link to="/library" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>Library</Link>
              <Link to="/vault" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>Vault</Link>
              <Link to="/profile" className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            </>
          )}

          <hr className="drawer-divider" />
          
          {!user ? (
            <div className="d-flex flex-column gap-3">
              <Link to="/login" className="w-100"><button className="neo-btn w-100">Login</button></Link>
              <Link to="/signup" className="w-100"><button className="primary-btn w-100 shadow-vibrant">Sign Up</button></Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              <div className="user-badge w-100" style={{ padding: '1rem' }}>
                <User size={18} />
                <span>{user.name}</span>
              </div>
              <button className="neo-btn w-100" style={{ color: '#ef4444' }} onClick={logout}>
                <LogOut size={18} style={{ marginRight: '10px' }} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
