import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCurrentUser } from '../services/api';
import * as api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    setIsLoggedIn(!!currentUser);
    setUser(currentUser);
    
    // Navbar Scroll Effect
    const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top -50',
            end: 99999,
            onEnter: () => {
              navbarRef.current?.classList.add('shadow-lg', 'scrolled-nav');
            },
            onLeaveBack: () => {
              navbarRef.current?.classList.remove('shadow-lg', 'scrolled-nav');
            }
        });

        // Hero Text Reveal Animation
        const tlHero = gsap.timeline({ defaults: { ease: "power4.out" } });
        tlHero.to(".hero-heading span span", {
            y: 0,
            duration: 1.5,
            stagger: 0.15
        })
        .to(".hero-badge", {
            y: 0,
            opacity: 1,
            duration: 1
        }, "-=1.2")
        .to([".hero-desc", ".hero-actions"], {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1
        }, "-=1")
        .to(".hero-image-container", {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "expo.out"
        }, "-=1.2");

        // Category Cards Animation
        gsap.from(".category-card", {
            scrollTrigger: {
                trigger: "#categories",
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.2)"
        });

        // Locator Section Animation
        const tlLocator = gsap.timeline({
            scrollTrigger: {
                trigger: ".locator-section",
                start: "top 75%",
            }
        });
        tlLocator
        .from(".locator-section > div", {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        .from(".icon-float", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.5)"
        }, "-=0.4")
        .from(".locator-content h2, .locator-content p", {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6
        }, "-=0.4")
        .from(".search-wrapper", {
            scaleX: 0.9,
            y: 10,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out"
        }, "-=0.2");

        // Floating Animations
        gsap.to(".animate-float", {
            y: -12,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        gsap.to(".icon-float", {
            y: -8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1
        });
    });

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const inner = card.querySelector('.card-inner');
    const icon = card.querySelector('.icon-wrapper');
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width - 0.5);
    const yPct = (y / rect.height - 0.5);

    if (inner) {
      gsap.to(inner, {
          rotationY: xPct * 12,
          rotationX: -yPct * 12,
          duration: 0.6,
          ease: "power2.out"
      });
    }
    if (icon) {
      gsap.to(icon, {
          x: xPct * 20,
          y: yPct * 20,
          duration: 0.6,
          ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const inner = card.querySelector('.card-inner');
    const icon = card.querySelector('.icon-wrapper');

    if (inner) {
      gsap.to(inner, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
      });
    }
    if (icon) {
      gsap.to(icon, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
      });
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display bg-[#0B1120] text-slate-300 selection:bg-[#34D399] selection:text-slate-900 overflow-x-hidden">
        {/* Navbar */}
        <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 transition-all duration-300" id="navbar" ref={navbarRef}>
            <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-md border-b border-white/5"></div>
            <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10">
                <header className="flex items-center justify-between h-16 sm:h-20">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                        <div className="size-8 sm:size-10 text-[#34D399] flex items-center justify-center">
                            <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                            </svg>
                        </div>
                        <span className="text-slate-50 text-xl sm:text-2xl font-black tracking-tight">EcoCycle</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/how-it-works'}>{t('howItWorks')}</button>
                        {isLoggedIn && (
                          <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/dashboard'}>{t('dashboard')}</button>
                        )}
                        <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/about'}>{t('about')}</button>
                        <button className="text-slate-400 hover:text-[#34D399] text-sm font-medium transition-colors bg-transparent border-none cursor-pointer" onClick={() => window.location.hash = '#/contact'}>{t('contact')}</button>
                    </nav>
                    <div className="flex items-center gap-4">
                        {!isLoggedIn && (
                          <>
                            <button 
                                onClick={() => window.location.hash = '#/login'}
                                className="hidden sm:flex h-10 px-5 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm font-bold transition-all duration-300 cursor-pointer"
                            >
                                {t('logIn')}
                            </button>
                            <button 
                                onClick={() => window.location.hash = '#/search'}
                                className="h-10 px-6 flex items-center justify-center rounded-full bg-[#34D399] text-slate-900 hover:bg-[#6EE7B7] shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] text-sm font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                            >
                                {t('getStarted')}
                            </button>
                          </>
                        )}
                        {isLoggedIn && (
                          <button 
                              onClick={() => {
                                // Clear all auth data
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                localStorage.removeItem('isLoggedIn');
                                localStorage.removeItem('appLanguage');
                                
                                // Clear cookies
                                document.cookie.split(";").forEach((c) => {
                                  document.cookie = c
                                    .replace(/^ +/, "")
                                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                                });
                                
                                // Redirect to home
                                window.location.href = '/';
                              }}
                              className="flex items-center gap-2 h-10 px-5 rounded-full bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm font-bold transition-all duration-300 cursor-pointer"
                          >
                              <span className="material-symbols-outlined text-[#34D399]">logout</span>
                              <span className="hidden sm:inline">{t('logOut')}</span>
                          </button>
                        )}
                    </div>
                </header>
            </div>
        </div>

        <main className="w-full flex flex-col items-center pt-24 sm:pt-32 pb-20 relative">
            <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none"></div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#34D399]/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-[128px] pointer-events-none"></div>

            {/* Hero Section */}
            <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10 flex flex-col gap-16 lg:gap-24 mb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left order-2 lg:order-1 hero-content">
                        <div className="hero-badge opacity-0 translate-y-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399] w-fit mx-auto lg:mx-0">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider">Sustainable Future</span>
                        </div>
                        <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            <span className="block overflow-hidden"><span className="block translate-y-full">{t('heroTitle1')}</span></span>
                            <span className="block overflow-hidden"><span className="block translate-y-full text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] via-[#6EE7B7] to-[#34D399]">{t('heroTitle2')}</span></span>
                            <span className="block overflow-hidden"><span className="block translate-y-full">{t('heroTitle3')}</span></span>
                        </h1>
                        <p className="hero-desc opacity-0 translate-y-8 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                            {t('heroSubtitle')}
                        </p>
                        <div className="hero-actions opacity-0 translate-y-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                            <div className="relative group w-full sm:w-auto">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#34D399] to-[#3B82F6] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                <button onClick={() => window.location.hash = '#/search'} className="relative w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#1E293B] border border-white/10 text-white font-bold hover:bg-[#1E293B]/80 transition-all group-hover:translate-x-1 cursor-pointer">
                                    <span>{t('startRecycling')}</span>
                                    <span className="material-symbols-outlined text-[#34D399] text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 h-[400px] lg:h-[500px] rounded-3xl overflow-hidden group hero-image-container opacity-0 scale-95">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent z-10"></div>
                        <img alt="Future of recycling technology" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"/>
                        <div className="absolute bottom-6 left-6 right-6 z-20 bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex items-center gap-4 animate-float shadow-2xl">
                            <div className="size-14 rounded-full bg-[#34D399]/20 flex items-center justify-center text-[#34D399] ring-1 ring-[#34D399]/30">
                                <span className="material-symbols-outlined">recycling</span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">12,450+ {t('itemsRecycled')}</p>
                                <p className="text-[#6EE7B7] text-sm font-medium">{t('recycledResponsibly')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium 3-Mode Section - Fixed Visibility */}
            <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10 mb-32">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('tailoredSolutions')}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">{t('tailoredSolutionsDesc')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Resident Card */}
                    <div 
                        className={`group relative h-[420px] rounded-[2.5rem] border p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 mode-card ${
                            user?.role === 'user' 
                                ? 'bg-gradient-to-br from-[#34D399]/30 via-[#10b981]/20 to-[#059669]/30 border-[#34D399] shadow-[0_0_60px_rgba(16,185,129,0.5),inset_0_0_60px_rgba(52,211,153,0.1)] cursor-pointer scale-105' 
                                : user 
                                    ? 'bg-gradient-to-b from-slate-800/20 to-slate-900/20 border-white/5 opacity-40 cursor-not-allowed grayscale'
                                    : 'bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-white/5 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(52,211,153,0.2)]'
                        }`}
                        onClick={() => (!user || user?.role === 'user') && (window.location.hash = '#/search')}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-500 ${
                            user?.role === 'user' 
                                ? 'bg-gradient-to-br from-[#34D399]/20 via-transparent to-[#10b981]/10 opacity-100' 
                                : 'bg-gradient-to-b from-[#34D399]/0 to-[#34D399]/5 opacity-0 group-hover:opacity-100'
                        }`}></div>
                        {user?.role === 'user' && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.15),transparent_70%)] animate-pulse"></div>
                        )}
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                            <span className="material-symbols-outlined text-9xl text-[#34D399]">home</span>
                        </div>
                        
                        <div className="relative z-10">
                            <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                                user?.role === 'user'
                                    ? 'bg-gradient-to-br from-[#34D399] to-[#10b981] text-slate-900 shadow-[0_0_40px_rgba(52,211,153,0.6),0_0_20px_rgba(16,185,129,0.4)] scale-125 rotate-6'
                                    : 'bg-[#34D399]/10 border border-[#34D399]/20 text-[#34D399] shadow-[0_0_20px_rgba(52,211,153,0.15)] group-hover:scale-110 group-hover:rotate-3'
                            }`}>
                                <span className="material-symbols-outlined text-3xl font-bold">person</span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-3 transition-colors ${user?.role === 'user' ? 'text-[#34D399]' : 'text-white'}`}>{t('residents')}</h3>
                            <p className={`leading-relaxed ${user?.role === 'user' ? 'text-slate-300' : 'text-slate-400'}`}>
                                {t('residentsDesc')}
                            </p>
                        </div>

                        <div className={`relative z-10 flex items-center gap-3 font-bold tracking-wide group-hover:gap-5 transition-all ${
                            user?.role === 'user' ? 'text-[#34D399] animate-pulse' : 'text-[#34D399]'
                        }`}>
                            <span>{t('startRecycling')}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>

                    {/* Business Card */}
                    <div 
                        className={`group relative h-[420px] rounded-[2.5rem] border p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 mode-card ${
                            user?.role === 'business' 
                                ? 'bg-gradient-to-br from-[#3B82F6]/30 via-[#2563eb]/20 to-[#1d4ed8]/30 border-[#3B82F6] shadow-[0_0_60px_rgba(59,130,246,0.5),inset_0_0_60px_rgba(59,130,246,0.1)] cursor-pointer scale-105' 
                                : user 
                                    ? 'bg-gradient-to-b from-slate-800/20 to-slate-900/20 border-white/5 opacity-40 cursor-not-allowed grayscale'
                                    : 'bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-white/5 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]'
                        }`}
                        onClick={() => (!user || user?.role === 'business') && (window.location.hash = '#/contact')}
                    >
                         <div className={`absolute inset-0 transition-opacity duration-500 ${
                            user?.role === 'business' 
                                ? 'bg-gradient-to-br from-[#3B82F6]/20 via-transparent to-[#2563eb]/10 opacity-100' 
                                : 'bg-gradient-to-b from-[#3B82F6]/0 to-[#3B82F6]/5 opacity-0 group-hover:opacity-100'
                        }`}></div>
                        {user?.role === 'business' && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)] animate-pulse"></div>
                        )}
                         <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                            <span className="material-symbols-outlined text-9xl text-[#3B82F6]">domain</span>
                        </div>

                        <div className="relative z-10">
                            <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                                user?.role === 'business'
                                    ? 'bg-gradient-to-br from-[#3B82F6] to-[#2563eb] text-white shadow-[0_0_40px_rgba(59,130,246,0.6),0_0_20px_rgba(37,99,235,0.4)] scale-125 rotate-6'
                                    : 'bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-110 group-hover:rotate-3'
                            }`}>
                                <span className="material-symbols-outlined text-3xl font-bold">apartment</span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-3 transition-colors ${user?.role === 'business' ? 'text-[#60A5FA]' : 'text-white'}`}>{t('businesses')}</h3>
                            <p className={`leading-relaxed ${user?.role === 'business' ? 'text-slate-300' : 'text-slate-400'}`}>
                                {t('businessesDesc')}
                            </p>
                        </div>

                        <div className={`relative z-10 flex items-center gap-3 font-bold tracking-wide group-hover:gap-5 transition-all ${
                            user?.role === 'business' ? 'text-[#60A5FA] animate-pulse' : 'text-[#3B82F6]'
                        }`}>
                            <span>{t('businessSolutions')}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>

                    {/* Partner Card */}
                    <div 
                        className={`group relative h-[420px] rounded-[2.5rem] border p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 mode-card ${
                            user?.role === 'agency' 
                                ? 'bg-gradient-to-br from-[#F59E0B]/30 via-[#D97706]/20 to-[#B45309]/30 border-[#F59E0B] shadow-[0_0_60px_rgba(245,158,11,0.5),inset_0_0_60px_rgba(245,158,11,0.1)] cursor-pointer scale-105' 
                                : user 
                                    ? 'bg-gradient-to-b from-slate-800/20 to-slate-900/20 border-white/5 opacity-40 cursor-not-allowed grayscale'
                                    : 'bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-white/5 cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.2)]'
                        }`}
                        onClick={() => (!user || user?.role === 'agency') && (window.location.hash = '#/agency')}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-500 ${
                            user?.role === 'agency' 
                                ? 'bg-gradient-to-br from-[#F59E0B]/20 via-transparent to-[#D97706]/10 opacity-100' 
                                : 'bg-gradient-to-b from-[#A855F7]/0 to-[#A855F7]/5 opacity-0 group-hover:opacity-100'
                        }`}></div>
                        {user?.role === 'agency' && (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.15),transparent_70%)] animate-pulse"></div>
                        )}
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
                            <span className={`material-symbols-outlined text-9xl ${user?.role === 'agency' ? 'text-[#F59E0B]' : 'text-[#A855F7]'}`}>handshake</span>
                        </div>

                        <div className="relative z-10">
                            <div className={`size-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                                user?.role === 'agency'
                                    ? 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-slate-900 shadow-[0_0_40px_rgba(245,158,11,0.6),0_0_20px_rgba(217,119,6,0.4)] scale-125 rotate-6'
                                    : 'bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover:scale-110 group-hover:rotate-3'
                            }`}>
                                <span className="material-symbols-outlined text-3xl font-bold">recycling</span>
                            </div>
                            <h3 className={`text-3xl font-bold mb-3 transition-colors ${user?.role === 'agency' ? 'text-[#FBBF24]' : 'text-white'}`}>{t('partners')}</h3>
                            <p className={`leading-relaxed ${user?.role === 'agency' ? 'text-slate-300' : 'text-slate-400'}`}>
                                {t('partnersDesc')}
                            </p>
                        </div>

                        <div className={`relative z-10 flex items-center gap-3 font-bold tracking-wide group-hover:gap-5 transition-all ${
                            user?.role === 'agency' ? 'text-[#FBBF24] animate-pulse' : 'text-[#A855F7]'
                        }`}>
                            <span>{t('joinNetwork')}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="w-full max-w-7xl px-4 sm:px-6 relative z-10 flex flex-col gap-12 sm:gap-16 scroll-mt-28" id="categories">
                <div className="text-center max-w-3xl mx-auto section-header space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-white/5 mb-2">
                        <span className="block size-1.5 rounded-full bg-[#34D399] animate-pulse"></span>
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Type Selection</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">E-Waste</span> Type</h2>
                    <p className="text-slate-400 text-lg font-light leading-relaxed">Choose a category below to initiate the recycling process. We handle everything from microchips to heavy appliances with certified care.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-0 sm:px-0">
                    {[
                        { icon: 'phone_iphone', title: 'Mobiles & Tablets', desc: 'Smartphones, feature phones, tablets, and e-readers responsibly processed.' },
                        { icon: 'laptop_chromebook', title: 'Laptops & PCs', desc: 'Secure data destruction for laptops, desktops, servers, and peripherals.' },
                        { icon: 'desktop_windows', title: 'TVs & Monitors', desc: 'Eco-friendly disposal of LED, LCD, CRT monitors, and flat screens.' },
                        { icon: 'blender', title: 'Home Appliances', desc: 'Microwaves, blenders, fans, and small kitchen electronics.' },
                        { icon: 'battery_full_alt', title: 'Batteries', desc: 'Safe handling of rechargeable, single-use, and laptop batteries.' },
                        { icon: 'cable', title: 'Cables & Chargers', desc: 'Power cords, data cables, adapters, and chargers sorted properly.' },
                    ].map((item, index) => (
                        <div 
                            key={index} 
                            className="category-card perspective-container group cursor-pointer h-full"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => window.location.hash = '#/search'}
                        >
                            <div className="card-inner preserve-3d relative w-full h-full p-8 rounded-[2rem] bg-gradient-to-b from-[#1E293B] to-[#0B1120] border border-white/5 hover:border-[#34D399]/30 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(52,211,153,0.15)] flex flex-col justify-between">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.08),transparent_50%)] pointer-events-none"></div>
                                <div className="flex flex-col items-start gap-6 relative z-10">
                                    <div className="icon-wrapper size-20 rounded-2xl bg-[#FFFFFF]/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-[#34D399] group-hover:text-slate-900 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 icon-glow" style={{ filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0))' }}>
                                        <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-white text-2xl font-bold group-hover:text-[#34D399] transition-colors">{item.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-[#34D399]/50 transition-colors">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between w-full group-hover:border-white/10 transition-colors">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">Start Recycle</span>
                                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#34D399] group-hover:text-slate-900 transition-all duration-300 transform group-hover:translate-x-1">
                                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Locator Section */}
            <div className="w-full mt-8 sm:mt-16 locator-section px-4 sm:px-6 max-w-7xl">
                <div className="relative rounded-[2.5rem] overflow-hidden bg-[#1E293B]/50 border border-white/5 p-10 sm:p-14 lg:p-20 flex flex-col items-center text-center">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#34D399]/10 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-[80px]"></div>
                    </div>
                    <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-8 locator-content">
                        <div className="size-20 rounded-2xl bg-gradient-to-br from-[#FFFFFF]/10 to-transparent flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md mb-2 icon-float">
                            <span className="material-symbols-outlined text-4xl text-[#34D399] drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">location_on</span>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">Find Recycling Hubs</h2>
                            <p className="text-slate-400 text-lg font-light">Enter your location to discover verified e-waste collection centers near you.</p>
                        </div>
                        <div className="w-full mt-2 search-wrapper">
                            <form className="relative group w-full max-w-lg mx-auto" onSubmit={(e) => { e.preventDefault(); window.location.hash = '#/search'; }}>
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#34D399] via-[#3B82F6] to-[#34D399] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-700 animate-gradient-xy"></div>
                                <div className="relative flex items-center bg-[#0B1116]/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 focus-within:ring-[#34D399]/50 transition-all">
                                    <div className="pl-6 text-slate-400">
                                        <span className="material-symbols-outlined text-xl">search</span>
                                    </div>
                                    <input className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 py-5 px-4 text-lg outline-none" placeholder="Enter postcode or city..." type="text"/>
                                    <button className="m-2 px-8 py-3 bg-[#34D399] hover:bg-[#6EE7B7] text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] active:scale-95 cursor-pointer">
                                        Search
                                    </button>
                                </div>
                            </form>
                            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-6 cursor-pointer group/location" onClick={() => window.location.hash = '#/search'}>
                                <span className="material-symbols-outlined text-lg group-hover/location:text-[#34D399] transition-colors">my_location</span>
                                <span className="group-hover/location:text-white transition-colors border-b border-dashed border-slate-600 group-hover/location:border-[#34D399]">Use my current location</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Us Section */}
            <section className="w-full max-w-7xl px-4 py-10 md:px-10">
                <div className="rounded-[2.5rem] bg-gradient-to-r from-[#1E293B] to-[#0B1120] border border-white/5 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group shadow-2xl">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#34D399]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#34D399]/20 transition-colors duration-700"></div>
                    
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-3 text-[#34D399]">
                            <span className="material-symbols-outlined">support_agent</span>
                            <span className="text-sm font-bold uppercase tracking-wider">24/7 Support</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Questions? We're here to help.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Whether you need help with a bulk order, partnership details, or just want to say hi, our team is ready to assist you.
                        </p>
                    </div>
                    
                    <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                        <button 
                            onClick={() => window.location.hash = '#/contact'}
                            className="h-12 px-8 rounded-full bg-[#34D399] text-[#0B1120] font-bold text-sm shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:bg-[#6EE7B7] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>Contact Us</span>
                            <span className="material-symbols-outlined text-lg">mail</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full px-4 py-20">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#34D399] relative shadow-[0_0_40px_rgba(52,211,153,0.15)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative flex flex-col items-center gap-6 px-4 py-16 text-center md:px-20">
                        <h2 className="text-3xl font-black text-[#0B1120] md:text-5xl max-w-2xl tracking-tight">
                            Ready to make a difference?
                        </h2>
                        <p className="max-w-xl text-lg font-medium text-[#0B1120]/80">
                            Join thousands of eco-conscious individuals and businesses. Schedule your first pickup today.
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button 
                                onClick={() => window.location.hash = '#/search'}
                                className="flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-full bg-[#0B1120] px-6 text-white text-base font-bold transition-transform hover:scale-105"
                            >
                                Book Pickup
                            </button>
                            <button 
                                onClick={() => window.location.hash = '#/contact'}
                                className="flex h-12 min-w-[160px] cursor-pointer items-center justify-center rounded-full border-2 border-[#0B1120] px-6 text-[#0B1120] text-base font-bold transition-colors hover:bg-[#0B1120]/10"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 bg-[#0B1120] pt-16 pb-8 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => window.location.hash = '#/'}>
                            <div className="size-6 text-[#34D399] flex items-center justify-center">
                                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeWidth="3"></path>
                                </svg>
                            </div>
                            <span className="text-white text-lg font-bold">EcoCycle</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">Making e-waste recycling accessible, transparent, and rewarding for everyone.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0" onClick={() => window.location.hash = '#/about'}>About</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Careers</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Impact</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Resources</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Help Center</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Recycling Guide</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0" onClick={() => window.location.hash = '#/agency'}>Partner with Us</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="flex flex-col gap-2 text-sm text-slate-400">
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Privacy Policy</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Terms of Service</button></li>
                            <li><button className="hover:text-[#34D399] transition-colors bg-transparent border-none cursor-pointer p-0">Cookie Policy</button></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2024 EcoCycle. All rights reserved.</p>
                    <div className="flex gap-4">
                        <button className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><span className="sr-only">Twitter</span><svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></button>
                        <button className="text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"><span className="sr-only">GitHub</span><svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path></svg></button>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Landing;