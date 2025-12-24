import React, { useRef } from 'react';

interface PickupCertificateProps {
  userName: string;
  agencyName: string;
  pickupId: string;
  wasteWeight: number;
  wasteTypes: string[];
  issueDate: string;
  ecoPoints: number;
}

const PickupCertificate: React.FC<PickupCertificateProps> = ({
  userName,
  agencyName,
  pickupId,
  wasteWeight,
  wasteTypes,
  issueDate,
  ecoPoints
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Calculate expiry date (6 months from issue date)
  const getExpiryDate = (issueDate: string) => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + 6);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownload = () => {
    if (certificateRef.current) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const certificateHTML = certificateRef.current.innerHTML;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>E-Waste Collection Certificate - ${pickupId}</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: 'Georgia', serif; 
                  padding: 20px; 
                  background: white;
                }
                @media print {
                  body { padding: 0; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${certificateHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1116] via-[#0f1419] to-[#0B1116] py-12 px-4">
      {/* Download Button */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-end no-print">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          <span className="material-symbols-outlined">download</span>
          <span className="font-semibold">Download Certificate</span>
        </button>
      </div>

      {/* Certificate */}
      <div ref={certificateRef} className="max-w-5xl mx-auto bg-white p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative Border */}
        <div className="absolute inset-0 border-[20px] border-double border-[#10b981] pointer-events-none"></div>
        <div className="absolute inset-4 border-2 border-[#10b981]/30 pointer-events-none"></div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-[200px] font-bold text-[#10b981] rotate-[-45deg]">VERIFIED</div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8 border-b-4 border-[#10b981] pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[48px]">recycling</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-[#0B1116] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              CERTIFICATE OF E-WASTE COLLECTION
            </h1>
            <p className="text-xl text-gray-600 italic">Environmental Contribution Recognition</p>
          </div>

          {/* Body */}
          <div className="mb-8 text-center px-8">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              This is to certify that
            </p>
            <h2 className="text-4xl font-bold text-[#10b981] mb-6 border-b-2 border-[#10b981]/30 pb-3 inline-block px-8">
              {userName}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              has successfully contributed to environmental sustainability by responsibly disposing of electronic waste through our certified collection service.
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 my-8 bg-[#10b981]/5 p-8 rounded-lg border-2 border-[#10b981]/20">
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">Collection ID</p>
                <p className="text-lg font-bold text-[#0B1116]">{pickupId}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">Total Weight Collected</p>
                <p className="text-lg font-bold text-[#10b981]">{wasteWeight} kg</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">Waste Categories</p>
                <p className="text-lg font-bold text-[#0B1116]">{wasteTypes.join(', ')}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">EcoPoints Earned</p>
                <p className="text-lg font-bold text-[#10b981]">{ecoPoints} Points</p>
              </div>
            </div>

            <p className="text-base text-gray-600 leading-relaxed mb-4">
              This collection was processed through our authorized e-waste management facility, ensuring proper recycling and disposal in compliance with environmental regulations. Your contribution helps prevent toxic materials from entering landfills and conserves natural resources.
            </p>
          </div>

          {/* Footer with Stamps */}
          <div className="mt-12 pt-8 border-t-2 border-[#10b981]/30">
            <div className="grid grid-cols-3 gap-8 items-end">
              {/* Issue Date */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Issue Date</p>
                <p className="text-base font-bold text-[#0B1116] border-t-2 border-[#10b981] pt-2">
                  {formatDate(issueDate)}
                </p>
              </div>

              {/* Agency Stamp */}
              <div className="relative">
                <div className="w-32 h-32 mx-auto border-4 border-[#10b981] rounded-full flex items-center justify-center bg-[#10b981]/5 transform rotate-[-5deg]">
                  <div className="text-center">
                    <div className="text-xs font-bold text-[#10b981] uppercase leading-tight">Certified by</div>
                    <div className="text-sm font-bold text-[#0B1116] mt-1 leading-tight px-2">{agencyName}</div>
                    <div className="text-[10px] text-gray-600 mt-1">Authorized Agency</div>
                  </div>
                </div>
                {/* Official Stamp Overlay */}
                <div className="absolute top-0 right-0 w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-50 transform rotate-12">
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-red-600">VERIFIED</div>
                    <div className="text-[8px] text-red-600">OFFICIAL</div>
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Valid Until</p>
                <p className="text-base font-bold text-red-600 border-t-2 border-red-500 pt-2">
                  {getExpiryDate(issueDate)}
                </p>
              </div>
            </div>

            {/* Additional Stamps */}
            <div className="flex justify-around items-center mt-8 flex-wrap gap-4">
              {/* Eco-Friendly Stamp */}
              <div className="w-24 h-24 border-3 border-green-600 rounded-lg flex items-center justify-center bg-green-50 transform rotate-[-3deg]">
                <div className="text-center">
                  <span className="material-symbols-outlined text-green-600 text-[32px]">eco</span>
                  <div className="text-[10px] font-bold text-green-600">ECO FRIENDLY</div>
                </div>
              </div>

              {/* Government Approved Stamp */}
              <div className="w-24 h-24 border-3 border-blue-600 rounded-full flex items-center justify-center bg-blue-50 transform rotate-[5deg]">
                <div className="text-center">
                  <span className="material-symbols-outlined text-blue-600 text-[32px]">verified_user</span>
                  <div className="text-[9px] font-bold text-blue-600 leading-tight">GOVT APPROVED</div>
                </div>
              </div>

              {/* Recycled Stamp */}
              <div className="w-24 h-24 border-3 border-[#10b981] rounded-lg flex items-center justify-center bg-[#10b981]/10 transform rotate-[-5deg]">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[#10b981] text-[32px]">recycling</span>
                  <div className="text-[10px] font-bold text-[#10b981]">100% RECYCLED</div>
                </div>
              </div>

              {/* ISO Certified Stamp */}
              <div className="w-24 h-24 border-3 border-purple-600 rounded-full flex items-center justify-center bg-purple-50 transform rotate-[3deg]">
                <div className="text-center">
                  <span className="material-symbols-outlined text-purple-600 text-[32px]">workspace_premium</span>
                  <div className="text-[9px] font-bold text-purple-600 leading-tight">ISO CERTIFIED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Certificate ID: CERT-{pickupId}-{new Date(issueDate).getFullYear()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Verify authenticity at www.ecocycle.com/verify
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupCertificate;
