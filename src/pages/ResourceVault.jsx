import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, BookOpen as Library, Calendar, Layers as Layout, User, Plus, Trash2, 
  Zap as Search, Link as LinkIcon, ChevronRight as ExternalLink, Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ResourceVault() {
  const { logout } = useAuth();
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ url: '', topic: 'DSA', note: '' });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('placeup_resources') || '[]');
    setResources(saved);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!newResource.url) return;

    const resource = {
      ...newResource,
      id: Date.now(),
      title: newResource.url.replace('https://', '').replace('www.', '').split('/')[0]
    };

    const updated = [resource, ...resources];
    setResources(updated);
    localStorage.setItem('placeup_resources', JSON.stringify(updated));
    setNewResource({ url: '', topic: 'DSA', note: '' });
  };

  const handleDelete = (id) => {
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    localStorage.setItem('placeup_resources', JSON.stringify(updated));
  };

  const topicsList = ['DSA', 'Aptitude', 'Web Dev', 'Communication', 'Resume', 'Other'];
  const filteredResources = filter === 'All' ? resources : resources.filter(r => r.topic === filter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px' }}>
      <Navbar />

      {/* Main */}
      <main className="container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Resource Vault 📚</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Your personal knowledge base for placement prep.</p>
        </header>

        {/* Add Resource */}
        <section className="glass-card shadow-vibrant" style={{ marginBottom: '4rem', padding: '2rem' }}>
          <form onSubmit={handleSave} className="d-flex align-center gap-4 flex-wrap">
            <div className="d-flex flex-column gap-2" style={{ flex: 2, minWidth: '300px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Resource URL</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }} />
                <input 
                  type="url" 
                  className="neo-input" 
                  placeholder="https://geeksforgeeks.org/..." 
                  style={{ paddingLeft: '40px', borderRadius: '12px' }}
                  value={newResource.url}
                  onChange={e => setNewResource({...newResource, url: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="d-flex flex-column gap-2" style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
              <select 
                className="neo-input" 
                value={newResource.topic}
                onChange={e => setNewResource({...newResource, topic: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '12px' }}
              >
                {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button type="submit" className="primary-btn shadow-vibrant" style={{ height: '50px', marginTop: '1.5rem', minWidth: '140px' }}>
              <Plus size={20} /> Add Unit
            </button>
          </form>
        </section>

        {/* Filter Bar */}
        <div className="d-flex align-center gap-3" style={{ marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          <button className={`neo-btn ${filter === 'All' ? 'active-filter' : ''}`} onClick={() => setFilter('All')} style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', whiteSpace: 'nowrap' }}>All Topics</button>
          {topicsList.map(t => (
            <button 
              key={t}
              className={`neo-btn ${filter === t ? 'active-filter' : ''}`} 
              onClick={() => setFilter(t)} 
              style={{ padding: '0.6rem 1.2rem', borderRadius: '50px', whiteSpace: 'nowrap' }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {filteredResources.map(res => (
            <div key={res.id} className="glass-card tilt-3d shadow-vibrant d-flex flex-column gap-4" style={{ padding: '1.5rem' }}>
              <div className="d-flex justify-between align-start">
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(79, 142, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bookmark size={22} color="var(--primary-color)" />
                </div>
                <button className="neo-icon-btn" style={{ width: '32px', height: '32px', background: 'transparent', boxShadow: 'none' }} onClick={() => handleDelete(res.id)}>
                  <Trash2 size={18} color="#ef4444" />
                </button>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: 'var(--card-border)', color: 'var(--primary-color)', marginBottom: '0.8rem', display: 'inline-block', textTransform: 'uppercase' }}>{res.topic}</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.title}</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{res.note || 'No notes added.'}</p>
              </div>

              <a href={res.url} target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ width: '100%', fontSize: '0.9rem', gap: '8px', background: 'rgba(var(--primary-color-rgb), 0.1)', color: 'var(--primary-color)', boxShadow: 'none' }}>
                Open Resource <ExternalLink size={16} />
              </a>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '6rem 2rem' }}>
              <div style={{ opacity: 0.2, marginBottom: '2rem' }}>
                <Search size={80} />
              </div>
              <h3>No resources in this category</h3>
              <p className="text-muted">Add some links to build your personal library.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
