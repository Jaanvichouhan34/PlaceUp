import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Link as LinkIcon, User } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    signup(formData);
    navigate('/onboarding');
  };

  return (
    <div className="auth-container">
      <div className="hero-glow-container">
        <div className="hero-glow"></div>
      </div>
      
      <div className="glass-card auth-card animate-fade-in">
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div className="d-flex justify-center align-center gap-2" style={{ marginBottom: '1rem' }}>
            <Brain size={32} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.8rem' }}>PlaceUp</h2>
          </div>
          <p className="text-muted">Create your account to start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          <div className="d-flex flex-column gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="neo-input" 
                placeholder="John Doe" 
                style={{ paddingLeft: '40px' }}
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="neo-input" 
                placeholder="john@example.com" 
                style={{ paddingLeft: '40px' }}
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="neo-input" 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px' }}
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="neo-input" 
                placeholder="••••••••" 
                style={{ paddingLeft: '40px' }}
                required 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>}

          <button type="submit" className="primary-btn" style={{ marginTop: '1rem', width: '100%' }}>
            Sign Up
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>

      {/* Floating Particles background rendering is done at the root level */}
    </div>
  );
}
