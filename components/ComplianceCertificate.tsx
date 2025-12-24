import React from 'react';

interface ComplianceCertificateProps {
  certificate: {
    _id?: string;
    certificateId: string;
    businessId?: {
      companyName: string;
    } | string;
    businessName?: string;
    agencyId?: {
      name: string;
    } | string;
    agencyName?: string;
    issuedAt: Date | string;
    validUntil?: Date | string;
    totalWeight: number;
    totalItems: number;
    co2Saved: number;
    items: Array<{
      name: string;
      category: string;
      quantity: number;
      weight: number;
    }>;
    complianceStandards?: string[];
    disposalMethod?: string;
    issuedBy?: {
      name: string;
      designation?: string;
    };
    materialsRecovered?: Array<{
      material: string;
      weight: number;
    }>;
  };
}

const ComplianceCertificate: React.FC<ComplianceCertificateProps> = ({ certificate }) => {
  const issueDate = new Date(certificate.issuedAt);
  const validDate = certificate.validUntil ? new Date(certificate.validUntil) : null;
  
  // Extract business and agency names from the certificate data
  const businessName = certificate.businessName || 
    (typeof certificate.businessId === 'object' && certificate.businessId?.companyName) || 
    'the organization';
  
  const agencyName = certificate.agencyName ||
    certificate.issuedBy?.name ||
    (typeof certificate.agencyId === 'object' && certificate.agencyId?.name) ||
    'Certified E-Waste Recycling Partner';

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white p-12 rounded-2xl shadow-2xl overflow-hidden">
      {/* Decorative Border */}
      <div className="absolute inset-0 border-8 border-double border-amber-600/30 rounded-2xl pointer-events-none"></div>
      <div className="absolute inset-3 border-2 border-amber-500/20 rounded-xl pointer-events-none"></div>
      
      {/* Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-[400px] text-amber-600 rotate-[-15deg]">verified_user</span>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-8 border-b-4 border-amber-600 pb-6">
        {/* Official Stamp - Top Left */}
        <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full border-4 border-red-600 bg-red-50 flex items-center justify-center rotate-[-15deg] shadow-lg">
          <div className="text-center">
            <div className="text-red-600 font-black text-xs uppercase tracking-wider">Certified</div>
            <span className="material-symbols-outlined text-red-600 text-4xl my-1">verified</span>
            <div className="text-red-600 font-black text-xs uppercase tracking-wider">Authentic</div>
          </div>
        </div>

        {/* EPA Stamp - Top Right */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-4 border-green-600 bg-green-50 flex items-center justify-center rotate-[12deg] shadow-lg">
          <div className="text-center">
            <div className="text-green-600 font-black text-xs uppercase tracking-wider">EPA</div>
            <span className="material-symbols-outlined text-green-600 text-4xl my-1">eco</span>
            <div className="text-green-600 font-black text-xs uppercase tracking-wider">Approved</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-5xl">verified_user</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 mb-2 tracking-tight">
          COMPLIANCE CERTIFICATE
        </h1>
        <p className="text-xl font-bold text-gray-700 tracking-wider">E-WASTE DISPOSAL CERTIFICATION</p>
        <div className="mt-4 inline-block px-6 py-2 bg-amber-100 border-2 border-amber-500 rounded-full">
          <p className="text-amber-800 font-mono font-bold text-lg tracking-widest">{certificate.certificateId}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Certificate Statement */}
        <div className="text-center py-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
          <p className="text-gray-800 text-lg leading-relaxed px-6">
            This is to certify that <span className="font-bold text-amber-800">{businessName}</span> has successfully completed 
            environmentally responsible disposal of electronic waste in compliance with all applicable regulations and standards.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Issue Date */}
          <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 font-semibold mb-1">Issue Date</p>
            <p className="text-lg font-bold text-gray-900">
              {issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Valid Until */}
          <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
            <p className="text-sm text-gray-600 font-semibold mb-1">Valid Until</p>
            <p className="text-lg font-bold text-gray-900">
              {validDate ? validDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Lifetime'}
            </p>
          </div>

          {/* Total Weight */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-300">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Weight Disposed</p>
            <p className="text-3xl font-black text-blue-700">{certificate.totalWeight} <span className="text-xl">kg</span></p>
          </div>

          {/* CO2 Saved */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300">
            <p className="text-sm text-gray-600 font-semibold mb-1">CO₂ Emissions Saved</p>
            <p className="text-3xl font-black text-green-700">{Math.round(certificate.co2Saved)} <span className="text-xl">kg</span></p>
          </div>
        </div>

        {/* Items Recycled */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-300">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">inventory_2</span>
            Items Disposed ({certificate.totalItems} items)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {certificate.items?.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-sm">devices</span>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">×{item.quantity}</span>
                  <span className="text-sm font-bold text-gray-800">{item.weight}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Recovered */}
        {certificate.materialsRecovered && certificate.materialsRecovered.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-300">
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">science</span>
              Materials Recovered
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {certificate.materialsRecovered.map((material, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg text-center border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">{material.material}</p>
                  <p className="text-lg font-bold text-purple-700">{material.weight.toFixed(1)} kg</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compliance Standards */}
        {certificate.complianceStandards && certificate.complianceStandards.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border-2 border-amber-400">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">verified</span>
              Compliance Standards Met
            </h3>
            <div className="flex flex-wrap gap-2">
              {certificate.complianceStandards.map((standard, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border-2 border-amber-300 rounded-full text-sm font-semibold text-amber-800">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  {standard}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disposal Method */}
        {certificate.disposalMethod && (
          <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-cyan-500">
            <p className="text-sm text-gray-600 font-semibold mb-1">Disposal Method</p>
            <p className="text-base font-medium text-gray-800">{certificate.disposalMethod}</p>
          </div>
        )}
      </div>

      {/* Footer - Signatures */}
      <div className="relative z-10 mt-10 pt-6 border-t-2 border-amber-600">
        <div className="grid grid-cols-2 gap-8">
          {/* Authorized Agency */}
          <div className="text-center">
            <div className="h-20 flex items-end justify-center mb-2">
              <div className="text-5xl font-['Brush_Script_MT',_cursive] text-amber-700 italic">
                {agencyName}
              </div>
            </div>
            <div className="border-t-2 border-gray-800 pt-2 mx-8">
              <p className="text-sm font-bold text-gray-800">{agencyName}</p>
              <p className="text-xs text-gray-600">{certificate.issuedBy?.designation || 'Authorized E-Waste Recycling Partner'}</p>
            </div>
          </div>

          {/* Official Seal */}
          <div className="text-center">
            <div className="h-20 flex items-center justify-center mb-2">
              <div className="w-24 h-24 rounded-full border-4 border-amber-600 bg-amber-100 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-amber-600 text-5xl">workspace_premium</span>
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-ping opacity-20 border-amber-600"></div>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-bold text-gray-800">Official Seal</p>
              <p className="text-xs text-gray-600">Environmental Compliance Division</p>
            </div>
          </div>
        </div>
      </div>

      {/* ISO Stamp - Bottom Left */}
      <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-blue-600 bg-blue-50 flex items-center justify-center rotate-[-20deg] shadow-lg">
        <div className="text-center">
          <div className="text-blue-600 font-black text-xs uppercase">ISO</div>
          <div className="text-blue-600 font-black text-lg">14001</div>
        </div>
      </div>

      {/* R2 Stamp - Bottom Right */}
      <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full border-4 border-purple-600 bg-purple-50 flex items-center justify-center rotate-[18deg] shadow-lg">
        <div className="text-center">
          <div className="text-purple-600 font-black text-2xl">R2</div>
          <div className="text-purple-600 font-black text-xs uppercase">Certified</div>
        </div>
      </div>

      {/* Verification QR Placeholder */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md border-2 border-gray-300">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded">
          <span className="material-symbols-outlined text-gray-500 text-3xl">qr_code</span>
        </div>
        <p className="text-[8px] text-center text-gray-500 mt-1 font-mono">Verify Online</p>
      </div>

      {/* Footer Note */}
      <div className="relative z-10 mt-6 text-center text-xs text-gray-500 italic">
        This certificate is issued in accordance with environmental regulations and may be used for compliance reporting, 
        audits, and sustainability documentation. Digital verification available at ecocycle.com/verify
      </div>
    </div>
  );
};

export default ComplianceCertificate;
