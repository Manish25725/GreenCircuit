import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const PartnerPending: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [agency, setAgency] = useState<any>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const response = await api.get('/agency/dashboard');
      const data = response.data.data;
      
      setStatus(data.status);
      setAgency(data.agency);
      
      if (data.status === 'rejected') {
        setRejectionReason(data.rejectionReason || '');
      } else if (data.status === 'approved') {
        // If approved, redirect to agency dashboard
        window.location.hash = '#/agency';
      }
    } catch (error: any) {
      console.error('Failed to check status:', error);
      // If no agency found, redirect to registration
      if (error.response?.status === 404) {
        window.location.hash = '#/partner/register';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    window.location.hash = '#/contact';
  };

  const handleReapply = () => {
    window.location.hash = '#/partner/register';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Rejected</h1>
            <p className="text-gray-600">
              Unfortunately, your partner registration has been rejected.
            </p>
          </div>

          {rejectionReason && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Reason for Rejection:</h3>
              <p className="text-red-800">{rejectionReason}</p>
            </div>
          )}

          {agency && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Your Submission Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agency Name:</span>
                  <span className="font-medium">{agency.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{agency.email}</span>
                </div>
                {agency.gstNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST Number:</span>
                    <span className="font-medium">{agency.gstNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleContactSupport}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => window.location.hash = '#/'}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Need Help?</strong> Please contact our support team to understand the rejection reason and
              resubmit your application with the correct information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pending status
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration In Progress</h1>
          <p className="text-gray-600">
            Your partner registration is currently under review by our admin team.
          </p>
        </div>

        {agency && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-3">Submitted Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Agency Name:</span>
                <span className="font-medium">{agency.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{agency.email}</span>
              </div>
              {agency.gstNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">GST Number:</span>
                  <span className="font-medium">{agency.gstNumber}</span>
                </div>
              )}
              {agency.headName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Head Name:</span>
                  <span className="font-medium">{agency.headName}</span>
                </div>
              )}
              {agency.submittedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Submitted On:</span>
                  <span className="font-medium">{new Date(agency.submittedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Verification Progress</span>
            <span className="text-sm text-gray-500">Reviewing...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Application Received</p>
              <p className="text-xs text-blue-700 mt-1">Your registration has been successfully submitted</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-5 h-5 rounded-full border-2 border-yellow-600 mt-0.5 flex-shrink-0 animate-spin">
              <div className="w-2 h-2 bg-yellow-600 rounded-full m-0.5"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900">Under Review</p>
              <p className="text-xs text-yellow-700 mt-1">Admin is verifying your documents and information</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg opacity-50">
            <div className="w-5 h-5 rounded-full border-2 border-gray-400 mt-0.5 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Approval Pending</p>
              <p className="text-xs text-gray-600 mt-1">Awaiting final approval decision</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Verification typically takes 2-3 business days</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>You'll receive an email notification once approved</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>After approval, you can access your partner dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Keep your phone and email accessible for any queries</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={checkRegistrationStatus}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Status
          </button>
          <button
            onClick={handleContactSupport}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.hash = '#/'}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerPending;
