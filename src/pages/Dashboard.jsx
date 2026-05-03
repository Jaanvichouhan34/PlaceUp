import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain, Target, Calendar, Clock, BookOpen, Star, 
  Flame, CheckCircle, Zap, CheckCircle as Shield, Trophy, Layers as Layout,
  BookOpen as Library, User, Menu, ChevronRight, Zap as AlertTriangle, Zap as RefreshCw,
  TrendingUp, BarChart, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDailyMotivation, rescheduleTasks } from '../services/gemini';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState([]);
  const [progress, setProgress] = useState([]);
  const [motivation, setMotivation] = useState('');
  const [streak, setStreak] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  useEffect(() => {
    // Load local data
    const savedPlan = JSON.parse(localStorage.getItem('placeup_plan') || '[]');
    const savedProgress = JSON.parse(localStorage.getItem('placeup_progress') || '[]');
    const savedStreaks = JSON.parse(localStorage.getItem('placeup_streaks') || '{ "count": 0 }');
    const userData = JSON.parse(localStorage.getItem('placeup_user') || '{}');
    const startDate = localStorage.getItem('placeup_start_date') || new Date().toISOString().split('T')[0];
    
    setPlan(savedPlan);
    setProgress(savedProgress);
    setStreak(savedStreaks.count);
    
    // Calculate current day number based on start date
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setCurrentDay(diffDays);

    // Calculate days left
    if (userData.examDate) {
      const exam = new Date(userData.examDate);
      const diff = exam.getTime() - now.getTime();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }

    fetchMotivation(userData.companies || ['Tech Companies'], daysLeft);
  }, []);

  const [currentDay, setCurrentDay] = useState(1);

  const fetchMotivation = async (companies, days) => {
    const text = await getDailyMotivation(companies, days);
    setMotivation(text);
    localStorage.setItem('placeup_motivation_text', text);
    localStorage.setItem('placeup_motivation_date', new Date().toDateString());
  };

  const toggleTask = (taskId) => {
    const isDone = progress.includes(taskId);
    const newProgress = isDone 
      ? progress.filter(id => id !== taskId)
      : [...progress, taskId];
    
    setProgress(newProgress);
    localStorage.setItem('placeup_progress', JSON.stringify(newProgress));
    
    // Confetti gamification when completing a task
    if (!isDone) {
      const todayTasksList = plan.filter(t => t.dayNumber === currentDay);
      const completedTodayList = todayTasksList.filter(t => newProgress.includes(t.id));
      if (todayTasksList.length > 0 && completedTodayList.length === todayTasksList.length) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f8ef7', '#a855f7', '#22c55e']
        });
      }
    }
  };

  const handleSkipToday = async () => {
    setIsRescheduling(true);
    const todayTasks = plan.filter(t => t.dayNumber === 1 && !progress.includes(t.id));
    
    // In a real app, dayNumber would be dynamic based on start date
    // For now, let's assume we are on Day 1
    const result = await rescheduleTasks(todayTasks, daysLeft, currentDay);
    if (Array.isArray(result) && result.length > 0) {
      // Update plan with redistributed tasks
      const newPlan = plan.map(p => {
        const updated = result.find(r => r.id === p.id);
        return updated || p;
      });
      // If result contains completely new tasks, add them
      const onlyNew = result.filter(r => !plan.find(p => p.id === r.id));
      const finalPlan = [...newPlan, ...onlyNew];
      
      setPlan(finalPlan);
      localStorage.setItem('placeup_plan', JSON.stringify(finalPlan));
    } else {
      alert("Failed to reschedule tasks. The AI might have returned an invalid response. Please try again.");
    }
    
    setIsRescheduling(false);
    setShowRescheduleModal(false);
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'DSA': return '#3b82f6'; // Primary blue
      case 'Aptitude': return '#a855f7'; // Purple
      case 'Web Dev': return '#22c55e'; // Green
      case 'Communication': return '#eab308'; // Yellow
      case 'Resume': return '#6b7280'; // Gray
      default: return '#3b82f6';
    }
  };

  const getCategoryStats = () => {
    const stats = {};
    plan.forEach(t => {
      if (progress.includes(t.id)) {
        stats[t.category] = (stats[t.category] || 0) + 1;
      }
    });
    return Object.keys(stats).map(cat => ({
      name: cat,
      value: stats[cat]
    }));
  };
  
  const categoryStats = getCategoryStats();

  const todayTasks = plan.filter(t => t.dayNumber === currentDay);
  const completedToday = todayTasks.filter(t => progress.includes(t.id)).length;
  const progressPercent = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px' }}>
      <Navbar />
      
      {/* Main Content */}
      <main className="container">
        <header className="d-flex justify-between align-center" style={{ marginBottom: '3rem' }}>
          <div className="scroll-animate">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Hey {user?.name?.split(' ')[0] || 'Student'}! 🚀</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>It's Day {currentDay} of your journey. Let's make it count.</p>
          </div>
          
          <div className="glass-card shadow-vibrant" style={{ padding: '0.8rem 1.8rem', textAlign: 'center', border: '2px solid var(--primary-color)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.2rem', letterSpacing: '1px' }}>COUNTDOWN</p>
            <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{daysLeft || 0} <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>days to goal</span></h3>
          </div>
        </header>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem' }}>
          
          {/* Daily Stack Section */}
          <section>
            <div className="d-flex justify-between align-center" style={{ marginBottom: '1.5rem' }}>
              <div className="d-flex align-center gap-2">
                <TrendingUp size={24} color="var(--primary-color)" />
                <h2 style={{ fontSize: '1.7rem', fontWeight: 700 }}>Today's Stack</h2>
              </div>
              <button 
                className="neo-btn" 
                style={{ fontSize: '0.8rem', color: '#ef4444', border: '1px solid currentColor' }}
                onClick={() => setShowRescheduleModal(true)}
              >
                I Skipped Today
              </button>
            </div>

            <div className="d-flex flex-column gap-4">
              {todayTasks.length > 0 ? todayTasks.map(task => (
                <div key={task.id} className="glass-card tilt-3d shadow-vibrant d-flex align-center justify-between" style={{ padding: '1.5rem', borderLeft: `6px solid ${getCategoryColor(task.category)}` }}>
                  <div className="d-flex align-center gap-4">
                    <div>
                      <div className="d-flex align-center gap-2" style={{ marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: `${getCategoryColor(task.category)}20`, color: getCategoryColor(task.category), textTransform: 'uppercase' }}>
                          {task.category}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>• {task.duration} mins</span>
                      </div>
                      <h3 style={{ margin: 0, textDecoration: progress.includes(task.id) ? 'line-through' : 'none', color: progress.includes(task.id) ? 'var(--text-muted)' : 'inherit', fontSize: '1.25rem' }}>
                        {task.topic}
                      </h3>
                    </div>
                  </div>
                  <button 
                    className={`neo-icon-btn ${progress.includes(task.id) ? 'active' : ''}`}
                    style={{ width: '45px', height: '45px', background: progress.includes(task.id) ? 'var(--green-color)' : 'var(--bg-color)', border: 'none' }}
                    onClick={() => toggleTask(task.id)}
                  >
                    <CheckCircle size={24} color={progress.includes(task.id) ? 'white' : 'var(--text-muted)'} />
                  </button>
                </div>
              )) : (
                <div className="glass-card text-center shadow-vibrant" style={{ padding: '4rem' }}>
                  <Zap size={64} className="spin" color="var(--primary-color)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <h3 className="text-muted">No tasks for today. Rest up!</h3>
                </div>
              )}
            </div>
          </section>

          {/* Right Sidebar Stats */}
          <aside className="d-flex flex-column gap-5">
            
            {/* Daily Motivation */}
            <div className="glass-card shadow-vibrant" style={{ background: 'linear-gradient(135deg, var(--purple-color), var(--pink-color))', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.15 }}>
                <Zap size={80} />
              </div>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 800, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Propel Message</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.4, position: 'relative', zIndex: 1 }}>"{motivation || 'Your potential is endless. Keep pushing forward!'}"</p>
            </div>

            {/* Circular Progress */}
            <div className="glass-card text-center shadow-vibrant" style={{ padding: '2.5rem' }}>
              <h4 style={{ marginBottom: '2rem', fontSize: '1rem', fontWeight: 700 }}>Day Progress</h4>
              <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 2rem auto' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="68" fill="none" stroke="var(--card-border)" strokeWidth="12" />
                  <circle 
                    cx="75" cy="75" r="68" fill="none" 
                    stroke="var(--primary-color)" strokeWidth="12" 
                    strokeDasharray="427.26" 
                    strokeDashoffset={427.26 - (427.26 * progressPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 8px var(--primary-color))' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800 }}>{Math.round(progressPercent)}%</h2>
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{completedToday} of {todayTasks.length} units cleared</p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card shadow-vibrant hover-up" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto' }}>
                  <Flame size={20} color="#f59e0b" />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>{streak}</h2>
                <p className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Streak</p>
              </div>
              <div className="glass-card shadow-vibrant hover-up" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto' }}>
                  <Award size={20} color="var(--purple-color)" />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>4</h2>
                <p className="text-muted" style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Badges</p>
              </div>
            </div>

            {/* Library Quick Access */}
            <div className="glass-card shadow-vibrant tilt-3d" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', cursor: 'pointer' }} onClick={() => navigate('/library')}>
               <div className="d-flex align-center gap-3">
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(var(--primary-color-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                    <Library size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Study Library</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Access 50+ PDF notes & guides</p>
                  </div>
                  <ChevronRight size={20} className="text-muted" />
               </div>
            </div>

            {/* Analytics Chart */}
            {categoryStats.length > 0 && (
              <div className="glass-card shadow-vibrant" style={{ padding: '1.5rem' }}>
                <div className="d-flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                  <BarChart size={20} color="var(--primary-color)" />
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Skill Distribution</h4>
                </div>
                <div style={{ height: '180px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-color)' }}
                        itemStyle={{ color: 'var(--text-color)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
            <div className="text-center" style={{ marginBottom: '1.5rem' }}>
              <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
              <h3>Skipping for today?</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>No worries! Things happen. We'll redistribute today's tasks across the next 3 days.</p>
            </div>
            
            <div className="d-flex flex-column gap-3">
              <button 
                className="primary-btn" 
                style={{ width: '100%' }}
                onClick={handleSkipToday}
                disabled={isRescheduling}
              >
                {isRescheduling ? <><RefreshCw size={18} className="spin" /> Rescheduling...</> : 'Redistribute Tasks'}
              </button>
              <button className="neo-btn" style={{ width: '100%' }} onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav - Bottom Only */}
      <nav className="glass-card mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, borderRadius: 0, display: 'none', padding: '0.5rem 1rem', borderTop: '1px solid var(--card-border)', zIndex: 100 }}>
        {/* Style this in index.css */}
      </nav>
    </div>
  );
}
