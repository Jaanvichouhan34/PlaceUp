import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Calendar, Clock, BookOpen, Star, ChevronRight, ChevronLeft, Zap, CheckCircle, Flame, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generatePlan } from '../services/gemini';

export default function Onboarding() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    companies: [],
    startDate: new Date().toISOString().split('T')[0],
    examDate: '',
    hoursPerDay: 4,
    weakAreas: [],
    skillLevel: '' // Beginner, Intermediate, Strong
  });

  const companiesList = [
    'TCS', 'Infosys', 'Capgemini', 'Wipro', 'Cognizant', 
    'Accenture', 'IBM', 'Google', 'Microsoft', 'Amazon', 
    'Netflix', 'Meta', 'Salesforce', 'Adobe', 'Startups', 'FAANG'
  ];
  const weakAreasList = [
    'DSA', 'Aptitude', 'Reasoning', 'Web Dev', 'Communication', 
    'Resume', 'System Design', 'Networking', 'OS', 'DBMS', 
    'Cloud Computing', 'Cybersecurity'
  ];

  const handleToggle = (listName, item) => {
    setFormData(prev => {
      const list = [...prev[listName]];
      const index = list.indexOf(item);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(item);
      }
      return { ...prev, [listName]: list };
    });
  };

  const calculateDaysLeft = () => {
    if (!formData.examDate) return 30;
    const today = new Date();
    const exam = new Date(formData.examDate);
    const diff = exam.getTime() - today.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleFinish = async () => {
    setLoading(true);
    const daysRemaining = calculateDaysLeft();
    const dataForAPI = { ...formData, daysRemaining };
    
    const result = await generatePlan(dataForAPI);
    
    // Save everything to LocalStorage
    localStorage.setItem('placeup_user', JSON.stringify({ ...user, ...formData }));
    localStorage.setItem('placeup_plan', JSON.stringify(result.plan));
    localStorage.setItem('placeup_progress', JSON.stringify([])); 
    localStorage.setItem('placeup_streaks', JSON.stringify({ count: 0, lastActive: null }));
    localStorage.setItem('placeup_start_date', formData.startDate);
    
    if (result.isFallback) {
      setShowToast(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 2000);
    } else {
      setLoading(false);
      navigate('/dashboard');
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="auth-container" style={{ background: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <div className="hero-glow-container">
        <div className="hero-glow"></div>
      </div>
      
      {/* Progress Bar */}
      <div className="container" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <div style={{ height: '8px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(to right, var(--primary-color), var(--purple-color))', transition: 'width 0.3s ease' }}></div>
        </div>
        <div className="d-flex justify-between" style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Step {step} of 4</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="glass-card scroll-animate" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', minHeight: '400px' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={24} color="var(--primary-color)" /> What's your name?
            </h2>
            <input 
              type="text" 
              className="neo-input" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ marginBottom: '2rem' }}
            />
            
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={24} color="var(--purple-color)" /> Target Companies
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Where do you see yourself working? Select multiple.</p>
            <div className="category-grid" style={{ marginBottom: '2rem' }}>
              {companiesList.map(c => (
                <button 
                  key={c}
                  onClick={() => handleToggle('companies', c)}
                  className={formData.companies.includes(c) ? 'primary-btn shadow-vibrant' : 'neo-btn'}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={24} color="var(--primary-color)" /> Start Date & Exam
            </h2>
            <div className="d-flex gap-4" style={{ marginBottom: '2rem' }}>
              <div style={{ flex: 1 }}>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>When do you want to start?</p>
                <input 
                  type="date" 
                  className="neo-input" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Placement/Exam Date</p>
                <input 
                  type="date" 
                  className="neo-input" 
                  value={formData.examDate}
                  onChange={e => setFormData({...formData, examDate: e.target.value})}
                />
              </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={24} color="var(--purple-color)" /> Daily Commitment
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>How many hours can you realistically dedicate per day?</p>
            <div className="d-flex align-center gap-4">
              <input 
                type="range" 
                min="1" max="8" 
                className="neo-input" 
                style={{ flex: 1, padding: '0.2rem' }}
                value={formData.hoursPerDay}
                onChange={e => setFormData({...formData, hoursPerDay: parseInt(e.target.value)})}
              />
              <div className="neo-btn" style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0 }}>
                {formData.hoursPerDay}h
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={24} color="var(--primary-color)" /> Areas for Improvement
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Select topics where you feel you need more preparation.</p>
            <div className="category-grid" style={{ marginBottom: '2rem' }}>
              {weakAreasList.map(w => (
                <button 
                  key={w}
                  onClick={() => handleToggle('weakAreas', w)}
                  className={formData.weakAreas.includes(w) ? 'primary-btn shadow-vibrant' : 'neo-btn'}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {w}
                </button>
              ))}
            </div>
            {formData.weakAreas.length === 0 && <p className="text-muted text-center" style={{ fontSize: '0.8rem' }}>Select at least one area to continue.</p>}
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={24} color="var(--purple-color)" /> Current Skill Level
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>Be honest! This helps the AI tailor the difficulty of tasks.</p>
            
            <div className="d-flex flex-column gap-4">
              <div 
                className={`glass-card ${formData.skillLevel === 'Beginner' ? 'active' : ''}`}
                style={{ 
                  cursor: 'pointer', 
                  borderColor: formData.skillLevel === 'Beginner' ? 'var(--primary-color)' : 'var(--card-border)',
                  borderWidth: formData.skillLevel === 'Beginner' ? '2px' : '1px'
                }}
                onClick={() => setFormData({...formData, skillLevel: 'Beginner'})}
              >
                <div className="d-flex align-center gap-3">
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} color="var(--primary-color)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>Beginner</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Basic understanding, need structured fundamentals.</p>
                  </div>
                </div>
              </div>

              <div 
                className={`glass-card ${formData.skillLevel === 'Intermediate' ? 'active' : ''}`}
                style={{ 
                  cursor: 'pointer', 
                  borderColor: formData.skillLevel === 'Intermediate' ? 'var(--purple-color)' : 'var(--card-border)',
                  borderWidth: formData.skillLevel === 'Intermediate' ? '2px' : '1px'
                }}
                onClick={() => setFormData({...formData, skillLevel: 'Intermediate'})}
              >
                <div className="d-flex align-center gap-3">
                  <div style={{ background: 'rgba(147, 51, 234, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={20} color="var(--purple-color)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>Intermediate</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Good grip on some topics, need advanced practice.</p>
                  </div>
                </div>
              </div>

              <div 
                className={`glass-card ${formData.skillLevel === 'Strong' ? 'active' : ''}`}
                style={{ 
                  cursor: 'pointer', 
                  borderColor: formData.skillLevel === 'Strong' ? 'var(--green-color)' : 'var(--card-border)',
                  borderWidth: formData.skillLevel === 'Strong' ? '2px' : '1px'
                }}
                onClick={() => setFormData({...formData, skillLevel: 'Strong'})}
              >
                <div className="d-flex align-center gap-3">
                  <div style={{ background: 'rgba(34, 197, 94, 0.1)', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={20} color="var(--green-color)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>Strong</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>Confident in core topics, need polishing and mocks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex justify-between" style={{ marginTop: '3rem' }}>
          <button 
            className="neo-btn" 
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1 || loading}
            style={{ padding: '0.6rem 1.2rem', opacity: step === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          {step < 4 ? (
            <button 
              className="primary-btn" 
              onClick={() => setStep(prev => prev + 1)}
              disabled={step === 1 && !formData.name}
              style={{ padding: '0.6rem 1.5rem' }}
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              className="primary-btn" 
              onClick={handleFinish}
              disabled={!formData.skillLevel || loading}
              style={{ padding: '0.6rem 2rem', background: 'linear-gradient(to right, var(--green-color), #059669)' }}
            >
              {loading ? 'Crafting Plan...' : 'Finish ✨'}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p className="animate-fade-in" style={{ fontWeight: 600 }}>Gemini is crafting your personalized roadmap...</p>
        </div>
      )}

      {/* Fallback Toast */}
      {showToast && (
        <div style={{ position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', padding: '1rem 2rem', borderRadius: '12px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} className="animate-fade-in">
          <div className="d-flex align-center gap-3">
            <Zap size={20} color="var(--primary-color)" />
            <span>AI plan unavailable, loaded default plan</span>
          </div>
        </div>
      )}
    </div>
  );
}
