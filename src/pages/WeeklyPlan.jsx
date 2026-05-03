import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Calendar, Clock, CheckCircle, ChevronRight, Layers as Layout,
  BookOpen as Library, User, Flame, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function WeeklyPlan() {
  const { logout } = useAuth();
  const [plan, setPlan] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentDayNumber, setCurrentDayNumber] = useState(1);

  useEffect(() => {
    const savedPlan = JSON.parse(localStorage.getItem('placeup_plan') || '[]');
    const savedProgress = JSON.parse(localStorage.getItem('placeup_progress') || '[]');
    const startDate = localStorage.getItem('placeup_start_date') || new Date().toISOString().split('T')[0];
    
    setPlan(savedPlan);
    setProgress(savedProgress);

    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDayNumber(diffDays);
  }, []);

  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'DSA': return 'var(--primary-color)';
      case 'Aptitude': return 'var(--purple-color)';
      case 'Web Dev': return 'var(--green-color)';
      case 'Communication': return '#EAB308';
      case 'Resume': return '#6B7280';
      default: return 'var(--primary-color)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px' }}>
      <Navbar />

      {/* Main */}
      <main className="container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Weekly Roadmap 🗺️</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Your strategic journey for the next 7 days.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {days.map((day, idx) => {
            const dayNum = idx + 1;
            const dayTasks = plan.filter(t => t.dayNumber === dayNum);
            const isCurrent = dayNum === currentDayNumber;
            const isExpired = dayNum < currentDayNumber;
            const totalDone = dayTasks.filter(t => progress.includes(t.id)).length;
            const isSkipped = isExpired && totalDone === 0 && dayTasks.length > 0;

            return (
              <div 
                key={day} 
                className={`glass-card tilt-3d shadow-vibrant ${isCurrent ? 'active-day' : ''}`}
                style={{ 
                  padding: '1.5rem', 
                  minHeight: '450px',
                  border: isCurrent ? '3px solid var(--primary-color)' : isSkipped ? '3px solid #ef4444' : '1px solid var(--card-border)',
                  background: isCurrent ? 'rgba(79,142,247,0.05)' : 'var(--card-bg)',
                }}
              >
                <div className="d-flex justify-between align-center" style={{ marginBottom: '2rem' }}>
                  <div className="d-flex align-center gap-2">
                    <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{day}</h2>
                    {isCurrent && <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', background: 'var(--primary-color)', color: 'white', borderRadius: '6px', textTransform: 'uppercase' }}>Today</span>}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {totalDone}/{dayTasks.length}
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {dayTasks.map(task => {
                    const isDone = progress.includes(task.id);
                    return (
                      <div 
                        key={task.id} 
                        className="glass-card" 
                        style={{ 
                          padding: '1rem', 
                          fontSize: '0.85rem',
                          borderLeft: `4px solid ${getCategoryColor(task.category)}`,
                          opacity: isExpired && !isDone ? 0.6 : 1,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div className="d-flex justify-between align-center" style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 800, color: getCategoryColor(task.category), fontSize: '0.7rem', textTransform: 'uppercase' }}>{task.category}</span>
                          {isDone && <CheckCircle size={16} color="var(--green-color)" />}
                        </div>
                        <p style={{ margin: 0, fontWeight: 600, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'inherit', lineHeight: 1.4 }}>
                          {task.topic}
                        </p>
                      </div>
                    );
                  })}
                  
                  {dayTasks.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.3 }}>
                      <Calendar size={48} style={{ marginBottom: '1rem' }} />
                      <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Empty Day</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
