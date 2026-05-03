import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, Download, Plus, Search, 
  Filter, MoreVertical, Trash2, File, ChevronRight,
  Book, PieChart, Layers, Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';

const DEFAULT_MATERIALS = [
  {
    id: 'm1',
    title: 'Percentage Concept & Shortcuts',
    category: 'Aptitude',
    topic: 'Percentage',
    type: 'PDF',
    size: '1.2 MB',
    date: '2024-05-01',
    isDefault: true
  },
  {
    id: 'm2',
    title: 'Ratio & Proportion Mastery',
    category: 'Aptitude',
    topic: 'Ratio',
    type: 'PDF',
    size: '850 KB',
    date: '2024-05-01',
    isDefault: true
  },
  {
    id: 'm3',
    title: 'Average Problems (Easy to Hard)',
    category: 'Aptitude',
    topic: 'Average',
    type: 'Notes',
    size: '450 KB',
    date: '2024-05-02',
    isDefault: true
  },
  {
    id: 'm4',
    title: 'Time & Work Formulas',
    category: 'Aptitude',
    topic: 'Time & Work',
    type: 'PDF',
    size: '2.1 MB',
    date: '2024-04-28',
    isDefault: true
  },
  {
    id: 'm5',
    title: 'DSA: Linked List Guide',
    category: 'DSA',
    topic: 'Linked List',
    type: 'PDF',
    size: '3.4 MB',
    date: '2024-04-25',
    isDefault: true
  }
];

export default function Library() {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', category: 'Aptitude', topic: '' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('placeup_library') || '[]');
    if (saved.length === 0) {
      setMaterials(DEFAULT_MATERIALS);
      localStorage.setItem('placeup_library', JSON.stringify(DEFAULT_MATERIALS));
    } else {
      setMaterials(saved);
    }
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    const material = {
      ...newMaterial,
      id: Date.now().toString(),
      type: 'PDF',
      size: 'Custom',
      date: new Date().toISOString().split('T')[0],
      isDefault: false
    };
    const updated = [material, ...materials];
    setMaterials(updated);
    localStorage.setItem('placeup_library', JSON.stringify(updated));
    setShowUploadModal(false);
    setNewMaterial({ title: '', category: 'Aptitude', topic: '' });
  };

  const handleDelete = (id) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    localStorage.setItem('placeup_library', JSON.stringify(updated));
  };

  const filteredMaterials = materials.filter(m => {
    const matchesFilter = filter === 'All' || m.category === filter;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', 'Aptitude', 'DSA', 'Web Dev', 'Core Subjects'];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Aptitude': return <PieChart size={18} />;
      case 'DSA': return <Layers size={18} />;
      case 'Web Dev': return <Globe size={18} />;
      case 'Core Subjects': return <Book size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px', paddingBottom: '50px' }}>
      <Navbar />

      <main className="container">
        <header className="d-flex justify-between align-center" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Study Library 📚</h1>
            <p className="text-muted" style={{ fontSize: '1.1rem' }}>Curated resources for your placement success.</p>
          </div>
          <button className="primary-btn shadow-vibrant d-flex align-center gap-2" onClick={() => setShowUploadModal(true)}>
            <Plus size={20} /> Upload Notes
          </button>
        </header>

        {/* Filters & Search */}
        <section className="glass-card shadow-vibrant" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
          <div className="d-flex justify-between align-center flex-wrap gap-4">
            <div className="d-flex align-center gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem', flex: 1 }}>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`neo-btn ${filter === cat ? 'active-filter' : ''}`}
                  onClick={() => setFilter(cat)}
                  style={{ 
                    whiteSpace: 'nowrap', 
                    padding: '0.6rem 1.2rem', 
                    fontSize: '0.9rem',
                    background: filter === cat ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: filter === cat ? 'white' : 'var(--text-primary)',
                    border: 'none'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="neo-input" 
                placeholder="Search topics..." 
                style={{ paddingLeft: '40px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Materials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredMaterials.length > 0 ? filteredMaterials.map(item => (
            <div key={item.id} className="glass-card tilt-3d shadow-vibrant d-flex flex-column gap-4" style={{ padding: '1.5rem' }}>
              <div className="d-flex justify-between align-start">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: 'rgba(var(--primary-color-rgb), 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary-color)'
                }}>
                  <FileText size={28} />
                </div>
                {!item.isDefault && (
                  <button className="neo-icon-btn" style={{ width: '32px', height: '32px', boxShadow: 'none' }} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                )}
              </div>

              <div>
                <div className="d-flex align-center gap-2" style={{ marginBottom: '0.8rem' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    background: 'rgba(var(--primary-color-rgb), 0.1)', 
                    color: 'var(--primary-color)',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {getCategoryIcon(item.category)} {item.category}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>• {item.type}</span>
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                <div className="d-flex align-center gap-4 text-muted" style={{ fontSize: '0.85rem' }}>
                  <span className="d-flex align-center gap-1"><Book size={14} /> {item.topic}</span>
                  <span>{item.size}</span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="neo-btn" style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem' }}>
                  Preview
                </button>
                <button className="primary-btn" style={{ width: '45px', padding: '0', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download size={18} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center" style={{ gridColumn: '1 / -1', padding: '5rem' }}>
              <div style={{ opacity: 0.1, marginBottom: '1.5rem' }}>
                <BookOpen size={80} />
              </div>
              <h3 className="text-muted">No materials found for this search.</h3>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Upload Study Material</h2>
            <form onSubmit={handleUpload} className="d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Material Title</label>
                <input 
                  type="text" 
                  className="neo-input" 
                  placeholder="e.g., Profit & Loss Shortcuts" 
                  required
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                />
              </div>

              <div className="d-flex gap-4">
                <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Category</label>
                  <select 
                    className="neo-input"
                    value={newMaterial.category}
                    onChange={e => setNewMaterial({...newMaterial, category: e.target.value})}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="d-flex flex-column gap-2" style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Topic</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="e.g., Arithmetic" 
                    required 
                    value={newMaterial.topic}
                    onChange={e => setNewMaterial({...newMaterial, topic: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ 
                border: '2px dashed var(--card-border)', 
                borderRadius: '16px', 
                padding: '3rem 2rem', 
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(var(--primary-color-rgb), 0.02)'
              }}>
                <Plus size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                <p style={{ fontWeight: 600 }}>Click or drag PDF to upload</p>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Max file size: 10MB</p>
              </div>

              <div className="d-flex gap-3" style={{ marginTop: '1rem' }}>
                <button type="submit" className="primary-btn" style={{ flex: 1 }}>Upload Now</button>
                <button type="button" className="neo-btn" style={{ flex: 1 }} onClick={() => setShowUploadModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for active filters */}
      <style>{`
        .active-filter {
          box-shadow: 0 0 15px var(--primary-color) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
