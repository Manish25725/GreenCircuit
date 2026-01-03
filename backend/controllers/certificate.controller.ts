import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import Booking from '../models/Booking';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import PDFDocument from 'pdfkit';

// Generate certificate for a completed booking
export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 'Booking not found', 404);
    }

    if (booking.status !== 'completed') {
      return sendError(res, 'Certificate can only be generated for completed bookings', 400);
    }

    if (booking.certificateIssued) {
      const existingCert = await Certificate.findOne({ bookingId });
      return sendSuccess(res, existingCert);
    }

    // Calculate environmental impact (simplified)
    const totalWeight = booking.totalWeight || booking.items.reduce((acc, item) => acc + (item.estimatedWeight || item.quantity * 2), 0);
    
    const certificate = await Certificate.create({
      userId: booking.userId,
      bookingId: booking._id,
      agencyId: booking.agencyId,
      totalWeight,
      itemsRecycled: booking.items.map(item => ({
        type: item.type,
        quantity: item.quantity,
        weight: item.estimatedWeight || item.quantity * 2
      })),
      environmentalImpact: {
        co2Saved: totalWeight * 2.5, // kg of CO2 saved
        waterSaved: totalWeight * 100, // liters
        energySaved: totalWeight * 10 // kWh
      }
    });

    // Update booking
    booking.certificateIssued = true;
    booking.certificateId = certificate.certificateId;
    await booking.save();

    sendSuccess(res, certificate, 201);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get user's certificates
export const getUserCertificates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { page = 1, limit = 10 } = req.query;

    const certificates = await Certificate.find({ userId })
      .populate('agencyId', 'name logo')
      .populate('bookingId', 'bookingId scheduledDate')
      .sort({ issueDate: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Certificate.countDocuments({ userId });

    // Calculate totals
    const totals = await Certificate.aggregate([
      { $match: { userId: (req as any).user._id } },
      {
        $group: {
          _id: null,
          totalWeight: { $sum: '$totalWeight' },
          totalCo2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' },
          totalEnergySaved: { $sum: '$environmentalImpact.energySaved' }
        }
      }
    ]);

    sendSuccess(res, {
      certificates,
      totals: totals[0] || {
        totalWeight: 0,
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalEnergySaved: 0
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Get certificate by ID
export const getCertificateById = async (req: Request, res: Response) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('agencyId', 'name logo address')
      .populate('bookingId', 'bookingId scheduledDate items');

    if (!certificate) {
      return sendError(res, 'Certificate not found', 404);
    }

    sendSuccess(res, certificate);
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Verify certificate by code
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const certificate = await Certificate.findOne({ 
      $or: [
        { verificationCode: code.toUpperCase() },
        { certificateId: code.toUpperCase() }
      ]
    })
    .populate('userId', 'name')
    .populate('agencyId', 'name');

    if (!certificate) {
      return sendError(res, 'Invalid certificate code', 404);
    }

    sendSuccess(res, {
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        issueDate: certificate.issueDate,
        totalWeight: certificate.totalWeight,
        userName: (certificate.userId as any).name,
        agencyName: (certificate.agencyId as any).name
      }
    });
  } catch (error: any) {
    sendError(res, error.message);
  }
};

// Download certificate as PDF (for residents)
export const downloadCertificate = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Certificate ID is required', 400);
    }

    console.log('Download resident certificate request:', { userId, certificateId: id });

    // Try to find certificate by _id, bookingId, or certificateId
    let certificate;
    try {
      // Try as ObjectId first (could be certificate _id or booking _id)
      if (id.length === 24) {
        // First try to find by certificate's own _id
        certificate = await Certificate.findOne({ 
          _id: id,
          userId 
        }).populate('agencyId', 'name email phone logo')
          .populate('userId', 'name email');
        
        // If not found, try to find by bookingId (most common case)
        if (!certificate) {
          certificate = await Certificate.findOne({ 
            bookingId: id,
            userId 
          }).populate('agencyId', 'name email phone logo')
            .populate('userId', 'name email');
        }
      }
      
      // If not found, try by certificateId string
      if (!certificate) {
        certificate = await Certificate.findOne({ 
          certificateId: id,
          userId 
        }).populate('agencyId', 'name email phone logo')
          .populate('userId', 'name email');
      }
    } catch (err) {
      console.error('Error finding certificate:', err);
      return sendError(res, 'Invalid certificate ID format', 400);
    }

    if (!certificate) {
      console.log('Certificate not found:', { id, userId });
      return sendError(res, 'Certificate not found or you do not have access to it', 404);
    }

    console.log('Certificate found, generating PDF:', certificate.certificateId);

    const userName = (certificate.userId as any)?.name || 'User';
    const userEmail = (certificate.userId as any)?.email || '';
    const agencyName = (certificate.agencyId as any)?.name || 'Authorized Agency';
    const issueDate = new Date(certificate.issueDate || certificate.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Calculate expiry date (6 months from issue)
    const expiryDate = new Date(certificate.issueDate || certificate.createdAt);
    expiryDate.setMonth(expiryDate.getMonth() + 6);
    const validUntil = expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      info: {
        Title: `E-Waste Certificate - ${certificate.certificateId}`,
        Author: 'EcoCycle Platform'
      }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${certificate.certificateId}.pdf"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Pipe PDF to response
    doc.pipe(res);

    // Handle stream errors
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        sendError(res, 'Failed to generate PDF');
      }
    });

    // Colors
    const primaryColor = '#10b981';
    const greenDark = '#059669';
    const redColor = '#dc2626';
    const blueColor = '#2563eb';
    const purpleColor = '#9333ea';
    const darkColor = '#0B1116';
    const grayColor = '#6b7280';
    const lightGray = '#f3f4f6';

    // Header with double border effect
    let yPos = 50;
    
    // Outer decorative border
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).lineWidth(8).strokeOpacity(1).stroke(primaryColor);
    doc.rect(48, 48, doc.page.width - 96, doc.page.height - 96).lineWidth(1).strokeOpacity(0.3).stroke(primaryColor);

    // Logo/Icon circle
    yPos = 80;
    doc.circle(doc.page.width / 2, yPos, 35).fill(primaryColor);
    doc.fontSize(40).fillColor('white').text('♻', doc.page.width / 2 - 15, yPos - 20);

    // Main Title
    yPos = 140;
    doc.fontSize(28).fillColor(darkColor).font('Helvetica-Bold')
       .text('CERTIFICATE OF E-WASTE COLLECTION', 70, yPos, { align: 'center', width: doc.page.width - 140 });
    
    yPos += 40;
    doc.fontSize(14).fillColor(grayColor).font('Helvetica-Oblique')
       .text('Environmental Contribution Recognition', 70, yPos, { align: 'center', width: doc.page.width - 140 });

    // Decorative line
    yPos += 30;
    doc.moveTo(100, yPos).lineTo(doc.page.width - 100, yPos).lineWidth(3).stroke(primaryColor);

    // "This is to certify" section
    yPos += 40;
    doc.fontSize(14).fillColor(grayColor).font('Helvetica')
       .text('This is to certify that', 70, yPos, { align: 'center', width: doc.page.width - 140 });

    // User Name - highlighted
    yPos += 35;
    const nameWidth = doc.widthOfString(userName, { fontSize: 24 });
    const nameX = (doc.page.width - nameWidth) / 2;
    doc.rect(nameX - 30, yPos - 5, nameWidth + 60, 40).fill('#f0fdf4');
    doc.fontSize(24).fillColor(primaryColor).font('Helvetica-Bold')
       .text(userName, 70, yPos + 5, { align: 'center', width: doc.page.width - 140 });
    
    // Underline
    doc.moveTo(nameX - 20, yPos + 38).lineTo(nameX + nameWidth + 20, yPos + 38).lineWidth(2).strokeOpacity(0.3).stroke(primaryColor);

    // Description
    yPos += 60;
    doc.fontSize(12).fillColor(grayColor).font('Helvetica')
       .text('has successfully contributed to environmental sustainability by responsibly', 70, yPos, { align: 'center', width: doc.page.width - 140 });
    yPos += 18;
    doc.text('disposing of electronic waste through our certified collection service.', 70, yPos, { align: 'center', width: doc.page.width - 140 });

    // Details Box with background
    yPos += 40;
    doc.roundedRect(80, yPos, doc.page.width - 160, 120, 8).fill('#f0fdf4');
    doc.roundedRect(80, yPos, doc.page.width - 160, 120, 8).lineWidth(2).strokeOpacity(0.2).stroke(primaryColor);

    const detailsY = yPos + 20;
    const col1X = 100;
    const col2X = doc.page.width / 2 + 20;
    const colWidth = (doc.page.width - 200) / 2 - 20;

    // Collection ID
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('Collection ID', col1X, detailsY);
    doc.fontSize(13).fillColor(darkColor).font('Helvetica-Bold').text(certificate.certificateId || pickupId || 'N/A', col1X, detailsY + 15, { width: colWidth });

    // Total Weight
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('Total Weight Collected', col2X, detailsY);
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold').text(`${certificate.totalWeight || 0} kg`, col2X, detailsY + 15, { width: colWidth });

    // Waste Categories
    const wasteTypes = certificate.itemsRecycled?.map((item: any) => item.type).join(', ') || 'E-Waste';
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('Waste Categories', col1X, detailsY + 60);
    doc.fontSize(13).fillColor(darkColor).font('Helvetica-Bold').text(wasteTypes.substring(0, 40) + (wasteTypes.length > 40 ? '...' : ''), col1X, detailsY + 75, { width: colWidth });

    // EcoPoints Earned
    const ecoPoints = Math.round((certificate.totalWeight || 0) * 10);
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('EcoPoints Earned', col2X, detailsY + 60);
    doc.fontSize(13).fillColor(primaryColor).font('Helvetica-Bold').text(`${ecoPoints} Points`, col2X, detailsY + 75, { width: colWidth });

    // Description paragraph
    yPos += 150;
    doc.fontSize(10).fillColor(grayColor).font('Helvetica')
       .text('This collection was processed through our authorized e-waste management facility, ensuring proper recycling', 90, yPos, { align: 'center', width: doc.page.width - 180 });
    yPos += 15;
    doc.text('and disposal in compliance with environmental regulations. Your contribution helps prevent toxic materials', 90, yPos, { align: 'center', width: doc.page.width - 180 });
    yPos += 15;
    doc.text('from entering landfills and conserves natural resources.', 90, yPos, { align: 'center', width: doc.page.width - 180 });

    // Footer section with dates and stamps
    yPos += 50;
    doc.moveTo(100, yPos).lineTo(doc.page.width - 100, yPos).lineWidth(2).strokeOpacity(0.3).stroke(primaryColor);
    yPos += 30;

    const footerY = yPos;
    
    // Issue Date (Left)
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('Issue Date', 100, footerY, { align: 'center', width: 150 });
    doc.moveTo(120, footerY + 30).lineTo(230, footerY + 30).lineWidth(2).stroke(primaryColor);
    doc.fontSize(11).fillColor(darkColor).font('Helvetica-Bold').text(issueDate, 100, footerY + 35, { align: 'center', width: 150 });

    // Central Stamp - Agency
    const centerX = doc.page.width / 2;
    doc.circle(centerX, footerY + 30, 50).lineWidth(3).stroke(primaryColor);
    doc.circle(centerX, footerY + 30, 48).fillOpacity(0.05).fill(primaryColor);
    doc.fontSize(8).fillColor(primaryColor).font('Helvetica-Bold').text('Certified by', centerX - 40, footerY + 10, { align: 'center', width: 80 });
    doc.fontSize(10).fillColor(darkColor).font('Helvetica-Bold').text(agencyName.substring(0, 20), centerX - 40, footerY + 25, { align: 'center', width: 80 });
    doc.fontSize(7).fillColor(grayColor).font('Helvetica').text('Authorized Agency', centerX - 40, footerY + 45, { align: 'center', width: 80 });

    // Verified stamp overlay
    doc.circle(centerX + 35, footerY - 5, 25).lineWidth(3).stroke(redColor);
    doc.circle(centerX + 35, footerY - 5, 23).fillOpacity(0.1).fill(redColor);
    doc.fontSize(8).fillColor(redColor).font('Helvetica-Bold').text('VERIFIED', centerX + 15, footerY - 10, { align: 'center', width: 40 });
    doc.fontSize(6).fillColor(redColor).font('Helvetica').text('OFFICIAL', centerX + 15, footerY + 2, { align: 'center', width: 40 });

    // Valid Until (Right)
    doc.fontSize(9).fillColor(grayColor).font('Helvetica').text('Valid Until', doc.page.width - 250, footerY, { align: 'center', width: 150 });
    doc.moveTo(doc.page.width - 230, footerY + 30).lineTo(doc.page.width - 120, footerY + 30).lineWidth(2).stroke(redColor);
    doc.fontSize(11).fillColor(redColor).font('Helvetica-Bold').text(validUntil, doc.page.width - 250, footerY + 35, { align: 'center', width: 150 });

    // Certification stamps at bottom
    yPos = footerY + 100;
    const stampSize = 60;
    const stampY = yPos;
    const totalStampWidth = stampSize * 4 + 60;
    let stampX = (doc.page.width - totalStampWidth) / 2;

    // ECO FRIENDLY stamp
    doc.roundedRect(stampX, stampY, stampSize, stampSize, 5).lineWidth(2).stroke('#059669');
    doc.roundedRect(stampX, stampY, stampSize, stampSize, 5).fillOpacity(0.05).fill('#059669');
    doc.fontSize(24).fillColor('#059669').text('🌿', stampX + 18, stampY + 8);
    doc.fontSize(7).fillColor('#059669').font('Helvetica-Bold').text('ECO FRIENDLY', stampX, stampY + 42, { align: 'center', width: stampSize });

    // GOVT APPROVED stamp
    stampX += stampSize + 20;
    doc.circle(stampX + stampSize / 2, stampY + stampSize / 2, stampSize / 2).lineWidth(2).stroke(blueColor);
    doc.circle(stampX + stampSize / 2, stampY + stampSize / 2, stampSize / 2).fillOpacity(0.05).fill(blueColor);
    doc.fontSize(24).fillColor(blueColor).text('✓', stampX + 18, stampY + 8);
    doc.fontSize(6).fillColor(blueColor).font('Helvetica-Bold').text('GOVT', stampX, stampY + 35, { align: 'center', width: stampSize });
    doc.fontSize(6).fillColor(blueColor).font('Helvetica-Bold').text('APPROVED', stampX, stampY + 43, { align: 'center', width: stampSize });

    // 100% RECYCLED stamp
    stampX += stampSize + 20;
    doc.roundedRect(stampX, stampY, stampSize, stampSize, 5).lineWidth(2).stroke(primaryColor);
    doc.roundedRect(stampX, stampY, stampSize, stampSize, 5).fillOpacity(0.05).fill(primaryColor);
    doc.fontSize(24).fillColor(primaryColor).text('♻', stampX + 18, stampY + 8);
    doc.fontSize(6).fillColor(primaryColor).font('Helvetica-Bold').text('100%', stampX, stampY + 35, { align: 'center', width: stampSize });
    doc.fontSize(6).fillColor(primaryColor).font('Helvetica-Bold').text('RECYCLED', stampX, stampY + 43, { align: 'center', width: stampSize });

    // ISO CERTIFIED stamp
    stampX += stampSize + 20;
    doc.circle(stampX + stampSize / 2, stampY + stampSize / 2, stampSize / 2).lineWidth(2).stroke(purpleColor);
    doc.circle(stampX + stampSize / 2, stampY + stampSize / 2, stampSize / 2).fillOpacity(0.05).fill(purpleColor);
    doc.fontSize(24).fillColor(purpleColor).text('★', stampX + 18, stampY + 8);
    doc.fontSize(6).fillColor(purpleColor).font('Helvetica-Bold').text('ISO', stampX, stampY + 35, { align: 'center', width: stampSize });
    doc.fontSize(6).fillColor(purpleColor).font('Helvetica-Bold').text('CERTIFIED', stampX, stampY + 43, { align: 'center', width: stampSize });

    // Certificate ID at bottom
    yPos = stampY + 80;
    doc.fontSize(8).fillColor('#9ca3af').font('Helvetica')
       .text(`Certificate ID: CERT-${certificate.certificateId || pickupId}-${new Date(issueDate).getFullYear()}`, 70, yPos, { align: 'center', width: doc.page.width - 140 });
    yPos += 12;
    doc.fontSize(8).fillColor('#9ca3af').font('Helvetica')
       .text('Verify authenticity at www.ecocycle.com/verify', 70, yPos, { align: 'center', width: doc.page.width - 140 });

    // Finalize PDF
    doc.end();
    console.log('PDF generated successfully for resident certificate:', certificate.certificateId);
  } catch (error: any) {
    console.error('Error generating resident certificate PDF:', error);
    if (!res.headersSent) {
      sendError(res, error.message || 'Failed to generate certificate');
    }
  }
};
