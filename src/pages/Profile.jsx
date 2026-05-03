import React, { useState, useEffect } from 'react';
import { 
  Brain, User, Trophy as Award, CheckCircle as Shield, Calendar, Layers as Layout, 
  BookOpen as Library, Flame, Star, Target, TrendingUp, Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState([]);
  const [plan, setPlan] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedStreaks = JSON.parse(localStorage.getItem('placeup_streaks') || '{ "count": 0 }');
    const savedProgress = JSON.parse(localStorage.getItem('placeup_progress') || '[]');
    const savedPlan = JSON.parse(localStorage.getItem('placeup_plan') || '[]');
    setStreak(savedStreaks.count);
    setProgress(savedProgress);
    setPlan(savedPlan);
  }, []);

  const totalTasks = plan.length;
  const completedTasks = progress.length;
  const readiness = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const badges = [
    { id: 'first_step', name: 'First Step', icon: <Target />, desc: 'Complete Day 1', unlocked: completedTasks > 0 },
    { id: 'on_fire', name: 'On Fire', icon: <Flame />, desc: '7-day streak', unlocked: streak >= 7 },
    { id: 'dsa_warrior', name: 'DSA Warrior', icon: <TrendingUp />, desc: 'All weekly DSA done', unlocked: false },
    { id: 'halfway', name: 'Halfway There', icon: <Award />, desc: '50% plan done', unlocked: readiness >= 50 },
    { id: 'ready', name: 'PlaceUp Ready', icon: <Shield />, desc: '100% plan done', unlocked: readiness >= 100 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px' }}>
      <Navbar />

      <main className="container">
        <header style={{ marginBottom: '4rem' }} className="d-flex justify-between align-end">
          <div className="d-flex align-center gap-4">
            <div className="glass-card shadow-vibrant" style={{ width: '120px', height: '120px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--primary-color)' }}>
              <User size={60} color="var(--primary-color)" />
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{user?.name || 'Student'}</h1>
              <div className="d-flex gap-3">
                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '4px 12px', background: 'rgba(79, 142, 247, 0.1)', color: 'var(--primary-color)', borderRadius: '50px' }}>LEVEL 4 PREPPER</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '4px 12px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--green-color)', borderRadius: '50px' }}>STREAK: {streak} DAYS</span>
              </div>
            </div>
          </div>
          <button className="neo-btn" style={{ padding: '0.8rem 1.5rem' }} onClick={() => navigate('/onboarding')}>
            <Settings size={20} /> Edit Profile
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', marginBottom: '4rem' }}>
          {/* Left Column: Stats */}
          <section className="d-flex flex-column gap-4">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Readiness Stats</h2>
            
            <div className="glass-card shadow-vibrant" style={{ padding: '2rem' }}>
              <div className="d-flex justify-between align-center" style={{ marginBottom: '1rem' }}>
                <div className="d-flex align-center gap-2">
                  <TrendingUp size={20} color="var(--primary-color)" />
                  <span style={{ fontWeight: 700 }}>Overall Readiness</span>
                </div>
                <span style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{readiness}%</span>
              </div>
              <div style={{ height: '12px', background: 'var(--card-border)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${readiness}%`, height: '100%', background: 'linear-gradient(to right, var(--primary-color), var(--purple-color))', borderRadius: '6px', boxShadow: '0 0 15px var(--primary-color)' }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card shadow-vibrant" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{completedTasks}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Units Cleared</p>
              </div>
              <div className="glass-card shadow-vibrant" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{streak}</h3>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Day Streak</p>
              </div>
            </div>

            <div className="glass-card shadow-vibrant" style={{ padding: '2rem' }}>
              <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Target Companies</h4>
              <div className="d-flex flex-wrap gap-2">
                {user?.companies?.map(c => (
                  <span key={c} style={{ padding: '6px 14px', borderRadius: '50px', background: 'var(--card-border)', fontSize: '0.8rem', fontWeight: 700 }}>{c}</span>
                )) || <p className="text-muted">None selected</p>}
              </div>
            </div>
          </section>

          {/* Right Column: Badges */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Unlocked Badges</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`glass-card tilt-3d shadow-vibrant text-center`}
                  style={{ 
                    padding: '2rem 1rem',
                    opacity: badge.unlocked ? 1 : 0.4,
                    filter: badge.unlocked ? 'none' : 'grayscale(1)',
                    border: badge.unlocked ? '2px solid var(--purple-color)' : '1px solid var(--card-border)',
                  }}
                >
                  <div style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    background: badge.unlocked ? 'linear-gradient(135deg, var(--purple-color), var(--pink-color))' : 'var(--card-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem auto',
                    boxShadow: badge.unlocked ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
                    color: 'white'
                  }}>
                    {React.cloneElement(badge.icon, { size: 36 })}
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700 }}>{badge.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
