import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  const roundedProgress = Math.round(progress);
  
  let statusText = "Initializing...";
  if (progress > 20) statusText = "Verifying credentials...";
  if (progress > 50) statusText = "Connecting to recyclers...";
  if (progress > 80) statusText = "Optimizing route...";
  if (progress === 100) statusText = "Ready!";

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#0B1116] group/design-root overflow-hidden font-sans selection:bg-[#34D399] selection:text-[#0B1120]">
      {/* Background Ambient Effects - Matching Landing Page */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-[#34D399]/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vh] h-[60vh] bg-[#3B82F6]/5 rounded-full blur-[128px]"></div>
      </div>

      <div className="layout-container flex h-full grow flex-col z-10">
        {/* Main Centered Content */}
        <div className="flex flex-1 flex-col justify-center items-center px-6">
          <div className="layout-content-container flex flex-col w-full max-w-[480px] items-center">
            
            {/* Central Visual Graphic */}
            <div className="relative flex items-center justify-center mb-12">
              {/* Outer pulsing ring simulation */}
              <div className="w-32 h-32 rounded-full border border-[#34D399]/20 flex items-center justify-center relative bg-[#0B1116]/50 backdrop-blur-sm shadow-[0_0_40px_-10px_rgba(52,211,153,0.1)]">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-[#34D399]/5 rounded-full blur-xl animate-pulse"></div>
                
                {/* Official Logo SVG */}
                <div className="size-16 text-[#34D399] relative z-10 flex items-center justify-center">
                    <svg className="w-full h-full drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    </svg>
                </div>

                {/* Orbiting Dot Simulation */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full animate-spin [animation-duration:3s]">
                   <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#34D399] rounded-full shadow-[0_0_10px_#34D399]"></div>
                </div>
              </div>
              {/* Decorative Particles */}
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#34D399]/40 rounded-full animate-ping [animation-duration:2s]"></div>
              <div className="absolute bottom-4 -left-4 w-1 h-1 bg-[#3B82F6]/30 rounded-full animate-pulse"></div>
            </div>

            {/* Typography Section */}
            <div className="flex flex-col items-center gap-3 mb-12 w-full">
              <h2 className="text-white tracking-tight text-3xl font-bold leading-tight text-center">
                Synthesizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#6EE7B7]">Eco-Data</span>
              </h2>
              <p className="text-slate-400 text-base font-normal leading-relaxed text-center max-w-xs">
                Please wait while we connect to nearby recyclers and optimize your route...
              </p>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-3 w-full p-5 rounded-2xl bg-[#1E293B]/50 border border-white/5 backdrop-blur-md shadow-2xl">
              <div className="flex gap-6 justify-between items-end">
                <p className="text-white text-sm font-medium leading-normal tracking-wide">Loading resources</p>
                <p className="text-[#34D399] text-sm font-bold leading-normal">{roundedProgress}%</p>
              </div>
              
              {/* Premium Progress Bar */}
              <div className="rounded-full bg-[#0B1116] h-1.5 w-full overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full bg-[#34D399] shadow-[0_0_12px_rgba(52,211,153,0.6)] relative transition-all duration-300 ease-out" 
                  style={{ width: `${roundedProgress}%` }}
                >
                  {/* Gradient sheen for 'shimmer' effect */}
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/40 to-transparent"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <p className="text-slate-500 text-xs font-normal leading-normal">Est. time: {Math.max(0, 2 - Math.floor(progress / 50))}s</p>
                <p className="text-slate-400 text-xs font-normal leading-normal italic">{statusText}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-center py-8">
          <p className="text-slate-500 text-xs font-medium tracking-wide uppercase opacity-60">
            EcoCycle v2.0 • Sustainable Tech
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;