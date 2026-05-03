import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Brain, Target, Zap, Trophy, Flame, 
  ChevronRight, Quote, HelpCircle, Mail, Calendar, BookOpen,
  Send, GitBranch, LinkIcon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // References for Intersection Observer
  const sectionsRef = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active link on scroll
      const sections = ['home', 'features', 'how-it-works', 'testimonials', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // 3D Tilt Logic
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((centerX - x) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveLink(id);
      setMobileMenuOpen(false);
    }
  };

  const nextTestimonial = () => {
    setCarouselIndex((prev) => (prev + 1) % 6);
  };

  const prevTestimonial = () => {
    setCarouselIndex((prev) => (prev === 0 ? 5 : prev - 1));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const feedbacks = JSON.parse(localStorage.getItem('placeup_feedback') || '[]');
    feedbacks.push({ ...contactForm, date: new Date().toISOString() });
    localStorage.setItem('placeup_feedback', JSON.stringify(feedbacks));
    setShowSuccessToast(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const testimonials = [
    { name: "Rahul S.", role: "Placed at Google", text: "PlaceUp's AI plan was specifically tailored to my weak areas in DSA. Cracked my dream role in 1 month!", avatar: "RS" },
    { name: "Priya M.", role: "Placed at Amazon", text: "The consistency tracker and DailyStack kept me disciplined throughout the placement season.", avatar: "PM" },
    { name: "Anish K.", role: "Placed at TCS Digital", text: "The aptitude section in the roadmap is a lifesaver. No more jumping between 10 different sites.", avatar: "AK" },
    { name: "Sneha V.", role: "Placed at Microsoft", text: "The AI-driven redistribution logic is what makes PlaceUp unique. It adapts to your life, not the other way around.", avatar: "SV" },
    { name: "Vikram R.", role: "Placed at Adobe", text: "Clean, professional, and powerful. The resource vault is my go-to for quick revision before every interview.", avatar: "VR" },
    { name: "Isha G.", role: "Placed at Salesforce", text: "From resume tips to advanced system design, PlaceUp covers everything a B.Tech student needs.", avatar: "IG" }
  ];

  return (
    <div id="home" style={{ background: 'var(--bg-color)', overflow: 'hidden' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '8rem 0', textAlign: 'center', minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-glow-container">
          <div className="hero-glow"></div>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="animate-fade-in" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Your <span className="text-gradient">AI Placement Co-Pilot</span>
          </h1>
          <p className="text-muted animate-fade-in delay-1" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3.5rem auto' }}>
            { "Stop guessing. Start placing. Let AI build your perfect preparation schedule tailored to your weak areas and target companies.".split(' ').map((word, i) => (
              <span key={i} className="animate-fade-in" style={{ display: 'inline-block', marginRight: '5px', animationDelay: `${0.2 + i * 0.05}s`, opacity: 0 }}>{word}</span>
            )) }
          </p>
          <div className="animate-fade-in delay-2">
            <button className="primary-btn" onClick={() => navigate('/signup')}>
              Start Your Journey <ChevronRight size={20} style={{ marginLeft: '5px' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="text-center scroll-animate" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Smart Features</h2>
            <p className="text-muted">Everything you need to crack your dream job.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            
            <div className="glass-card tilt-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Brain size={28} color="var(--primary-color)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>AI Smart Plan</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Dynamic weekly scheduling based on your skill level, targets, and available hours.</p>
            </div>

            <div className="glass-card tilt-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div style={{ background: 'rgba(147, 51, 234, 0.1)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Calendar size={28} color="var(--purple-color)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Daily Stack</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Bite-sized daily tasks to keep you on track without burning out or getting overwhelmed.</p>
            </div>

            <div className="glass-card tilt-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Zap size={28} color="var(--green-color)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Streak Challenge</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Earn badges and build your streak by staying consistent every single day.</p>
            </div>

            <div className="glass-card tilt-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div style={{ background: 'rgba(79, 142, 247, 0.1)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <BookOpen size={28} color="var(--primary-color)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Study Library</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Topic-wise PDF notes for Percentage, Ratio, Average, and more Aptitude essentials.</p>
            </div>

            <div className="glass-card tilt-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
              <div style={{ background: 'rgba(107, 114, 128, 0.1)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <LinkIcon size={28} color="var(--text-muted)" />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>Resource Vault</h3>
              <p className="text-muted" style={{ fontSize: '1rem', lineHeight: 1.6 }}>Save and organize all your study materials, important articles, and YouTube videos.</p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '6rem 0', background: 'rgba(79, 142, 247, 0.02)' }}>
        <div className="container">
          <div className="text-center scroll-animate" style={{ marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How It Works</h2>
            <p className="text-muted">4 simple steps to your dream job.</p>
          </div>

          <div className="timeline scroll-animate">
            <div className="timeline-pulse"></div>
            
            <div className="step-item">
              <div className="step-number">1</div>
              <Target size={32} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Set Your Goals</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Choose your target companies and available hours.</p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <Brain size={32} color="var(--purple-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>AI Builds Plan</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Gemini AI crafts a personalized preparation schedule.</p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <Calendar size={32} color="var(--green-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Follow Daily Stack</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Complete bite-sized tasks every single day.</p>
            </div>

            <div className="step-item">
              <div className="step-number">4</div>
              <Trophy size={32} color="#f59e0b" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Get Placed</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Show up prepared and land your dream offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div className="text-center scroll-animate" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Student Success</h2>
            <p className="text-muted">Hear from students who cracked their dream companies.</p>
          </div>

          <div className="carousel-container scroll-animate">
            <div className="carousel-track" style={{ transform: `translateX(-${carouselIndex * (100 / 3)}%)` }}>
              {testimonials.map((t, idx) => (
                <div key={idx} className="carousel-item" style={{ padding: '0 1rem' }}>
                  <div className="glass-card tilt-3d shadow-vibrant" style={{ padding: '2rem' }}>
                    <Quote size={40} color="var(--primary-color)" style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                    <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.6 }}>"{t.text}"</p>
                    <div className="d-flex align-center gap-3">
                      <div className="primary-btn" style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.avatar}</div>
                      <div>
                        <h4 style={{ margin: 0 }}>{t.name}</h4>
                        <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="neo-icon-btn" onClick={prevTestimonial} style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
              <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className="neo-icon-btn" onClick={nextTestimonial} style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: '6rem 0', background: 'rgba(147, 51, 234, 0.02)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div className="scroll-animate">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Get in Touch</h2>
              <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Have questions? We're here to help you navigate your placement journey. Send us a message!</p>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-center gap-3">
                  <div className="neo-icon-btn" style={{ width: '40px', height: '40px' }}><Mail size={18} color="var(--primary-color)" /></div>
                  <p>support@placeup.ai</p>
                </div>
                <div className="d-flex align-center gap-3">
                  <div className="neo-icon-btn" style={{ width: '40px', height: '40px' }}><HelpCircle size={18} color="var(--purple-color)" /></div>
                  <p>Help Center & FAQ</p>
                </div>
              </div>
            </div>

            <div className="glass-card scroll-animate">
              <form onSubmit={handleContactSubmit} className="d-flex flex-column gap-4">
                <div className="d-flex flex-column gap-2">
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="Your Name" 
                    required 
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Email</label>
                  <input 
                    type="email" 
                    className="neo-input" 
                    placeholder="your@email.com" 
                    required 
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
                </div>
                <div className="d-flex flex-column gap-2">
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Message</label>
                  <textarea 
                    className="neo-input" 
                    placeholder="How can we help?" 
                    rows="4" 
                    required 
                    style={{ resize: 'none' }}
                    value={contactForm.message}
                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '1rem' }}>
                  Send Feedback <Send size={18} style={{ marginLeft: '10px' }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '5rem 0 2rem 0', borderTop: '1px solid var(--card-border)', background: 'var(--bg-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div>
              <div className="d-flex align-center gap-2" style={{ marginBottom: '1.5rem' }}>
                <Brain size={28} color="var(--primary-color)" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>PlaceUp</h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>AI-powered placement prep scheduler for the modern B.Tech student.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
              <div className="d-flex flex-column gap-2">
                <span className="nav-link" onClick={() => scrollToSection('features')}>Features</span>
                <span className="nav-link" onClick={() => scrollToSection('how-it-works')}>How it Works</span>
                <span className="nav-link" onClick={() => scrollToSection('testimonials')}>Testimonials</span>
                <span className="nav-link" onClick={() => scrollToSection('contact')}>Contact</span>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Resources</h4>
              <div className="d-flex flex-column gap-2">
                <span className="nav-link">DSA Guide</span>
                <span className="nav-link">Aptitude Tips</span>
                <span className="nav-link">Resume Builder</span>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1.5rem' }}>Follow Us</h4>
              <div className="d-flex gap-3">
                <div className="neo-icon-btn" style={{ width: '40px', height: '40px' }}><GitBranch size={18} /></div>
                <div className="neo-icon-btn" style={{ width: '40px', height: '40px' }}><LinkIcon size={18} /></div>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '2rem' }}>
            <p className="text-muted" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              Made with <Flame size={14} fill="#ef4444" color="#ef4444" /> for every B.Tech student.
            </p>
          </div>
        </div>
      </footer>

      {/* Success Toast */}
      {showSuccessToast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'var(--green-color)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '10px' }} className="animate-fade-in">
          <Zap size={20} />
          <span>Thanks! We'll get back to you 🙌</span>
        </div>
      )}
    </div>
  );
}
