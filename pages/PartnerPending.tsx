import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Loader from '../components/Loader';

const PartnerPending: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [agency, setAgency] = useState<any>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/agencies/dashboard/me');
      const responseData = response.data?.data || response.data;
      
      console.log('Partner pending - API response:', response.data);
      console.log('Partner pending - Parsed data:', responseData);
      
      const currentStatus = responseData?.status || 'pending';
      setStatus(currentStatus);
      setAgency(responseData?.agency);
      
      if (currentStatus === 'rejected') {
        setRejectionReason(responseData?.rejectionReason || '');
      } else if (currentStatus === 'approved') {
        // If approved, redirect to agency dashboard
        window.location.hash = '#/agency';
      }
    } catch (error: any) {
      console.error('Failed to check status:', error);
      // If no agency found, redirect to registration
      if (error.response?.status === 404) {
        window.location.hash = '#/partner/register';
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // Not authenticated, redirect to login
        window.location.hash = '#/login';
      }
      // For other errors, just show the pending UI
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleContactSupport = () => {
    window.location.hash = '#/contact';
  };

  const getTrackerSteps = () => {
    const steps = [
      {
        id: 1,
        title: 'Application Received',
        description: 'We have received your partner registration request',
        icon: 'inbox',
        status: 'completed'
      },
      {
        id: 2,
        title: 'Documents Under Review',
        description: 'Our team is verifying your GST, Udyam & business credentials',
        icon: 'fact_check',
        status: status === 'pending' ? 'current' : status === 'approved' ? 'completed' : 'failed'
      },
      {
        id: 3,
        title: 'Awaiting Approval',
        description: 'Your application is being reviewed by our verification team',
        icon: 'hourglass_top',
        status: status === 'pending' ? 'pending' : status === 'approved' ? 'completed' : 'failed'
      },
      {
        id: 4,
        title: status === 'rejected' ? 'Application Declined' : 'Partnership Confirmed',
        description: status === 'rejected' ? 'Unfortunately, your application could not be approved' : 'Congratulations! You are now an EcoCycle Partner',
        icon: status === 'rejected' ? 'cancel' : 'verified',
        status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending'
      }
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] flex items-center justify-center">
        <div className="fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <Loader size="lg" color="#06b6d4" className="mb-4" />
          <p className="text-gray-200">Loading application status...</p>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 py-12 px-4">
        <div className="fixed top-0 left-0 w-full h-[500px] bg-red-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-[500px] bg-orange-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.location.hash = '#/'}>
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332]/90 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Status Icon */}
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/50">
                <span className="material-symbols-outlined text-5xl text-red-400">cancel</span>
              </div>
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Application Rejected
              </h1>
              <p className="text-slate-400 text-lg">
                Unfortunately, your partner registration has been rejected.
              </p>
            </div>

            {/* Rejection Reason */}
            {rejectionReason && (
              <div className="mb-6 p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400 mt-0.5">error</span>
                  <div>
                    <h3 className="font-semibold text-red-400 mb-2">Reason for Rejection</h3>
                    <p className="text-gray-200">{rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submission Details */}
            {agency && (
              <div className="mb-6 p-5 bg-[#0f1823] border border-cyan-500/20 rounded-xl">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">info</span>
                  Your Submission Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400 block mb-1">Agency Name</span>
                    <span className="text-white font-medium">{agency.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Email</span>
                    <span className="text-white font-medium">{agency.email}</span>
                  </div>
                  {agency.gstNumber && (
                    <div>
                      <span className="text-slate-400 block mb-1">GST Number</span>
                      <span className="text-white font-medium">{agency.gstNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleContactSupport}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">support_agent</span>
                Contact Support
              </button>
              <button
                onClick={() => window.location.hash = '#/'}
                className="w-full px-6 py-3.5 border border-cyan-500/30 text-gray-200 rounded-xl hover:bg-cyan-500/10 transition-all"
              >
                Return to Home
              </button>
            </div>

            {/* Help Message */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-sm text-yellow-200 flex items-start gap-2">
                <span className="material-symbols-outlined text-lg mt-0.5">lightbulb</span>
                <span>
                  <strong>Need Help?</strong> Please contact our support team to understand the rejection reason. 
                  You may resubmit your application after addressing the issues.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pending status - Show Tracker
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] font-sans text-gray-100 py-12 px-4">
      <div className="fixed top-0 left-0 w-full h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-full h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.location.hash = '#/'}>
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Application Status Tracker
          </h1>
          <p className="text-slate-400 text-lg">
            Track the progress of your partner registration application
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tracker */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
              {/* Status Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-xl animate-pulse">
                    <span className="material-symbols-outlined text-yellow-400 text-2xl">pending</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Verification In Progress</h2>
                    <p className="text-slate-400 text-sm">We're reviewing your application • Usually takes 24-48 hours</p>
                  </div>
                </div>
                <button
                  onClick={checkRegistrationStatus}
                  disabled={refreshing}
                  className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-all flex items-center gap-2 text-sm"
                >
                  <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>
                    {refreshing ? 'progress_activity' : 'refresh'}
                  </span>
                  Check Status
                </button>
              </div>

              {/* Progress Tracker */}
              <div className="relative">
                {getTrackerSteps().map((step, index) => (
                  <div key={step.id} className="flex gap-4 mb-6 last:mb-0">
                    {/* Step Indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                        ${step.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-400' : ''}
                        ${step.status === 'current' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 animate-pulse' : ''}
                        ${step.status === 'pending' ? 'bg-gray-500/10 border-gray-600 text-gray-500' : ''}
                        ${step.status === 'failed' ? 'bg-red-500/20 border-red-500 text-red-400' : ''}
                      `}>
                        <span className="material-symbols-outlined text-xl">{step.icon}</span>
                      </div>
                      {index < getTrackerSteps().length - 1 && (
                        <div className={`w-0.5 h-16 mt-2 ${
                          step.status === 'completed' ? 'bg-green-500' : 'bg-gray-700'
                        }`}></div>
                      )}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${
                          step.status === 'completed' ? 'text-green-400' :
                          step.status === 'current' ? 'text-yellow-400' :
                          step.status === 'failed' ? 'text-red-400' :
                          'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        {step.status === 'current' && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-400">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        step.status === 'pending' ? 'text-gray-600' : 'text-slate-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Application Details */}
            {agency && (
              <div className="bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400">description</span>
                  Application Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">Agency Name</span>
                    <span className="text-white font-medium">{agency.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-slate-400">Email</span>
                    <span className="text-white font-medium text-right">{agency.email}</span>
                  </div>
                  {agency.gstNumber && (
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-slate-400">GST Number</span>
                      <span className="text-white font-medium">{agency.gstNumber}</span>
                    </div>
                  )}
                  {agency.submittedAt && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400">Submitted</span>
                      <span className="text-white font-medium">
                        {new Date(agency.submittedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-[#1a2332]/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">tips_and_updates</span>
                What's Next?
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg mt-0.5">check_circle</span>
                  <span className="text-gray-200">You'll receive an email once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg mt-0.5">check_circle</span>
                  <span className="text-gray-200">Access your partner dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg mt-0.5">check_circle</span>
                  <span className="text-gray-200">Start managing pickup requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-lg mt-0.5">check_circle</span>
                  <span className="text-gray-200">Grow your recycling business</span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">help</span>
                Need Help?
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Have questions about your application? Our support team is here to help.
              </p>
              <button
                onClick={handleContactSupport}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">support_agent</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Return Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.hash = '#/'}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerPending;
