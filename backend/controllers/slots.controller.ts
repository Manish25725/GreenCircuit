import { Request, Response } from 'express';
import Slot from '../models/Slot';
import Agency from '../models/Agency';
import { sendSuccess, sendError } from '../utils/response';

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { date, agencyId } = req.query;
    const userId = (req as any).user?.id;
    let query: any = {};
    
    // If user is an agency, auto-filter by their agency
    if (userId && (req as any).user?.role === 'agency') {
      const agency = await Agency.findOne({ userId });
      if (agency) {
        query.agencyId = agency._id;
      }
    } else if (agencyId) {
      query.agencyId = agencyId;
    }
    
    if (date) {
      query.date = parseInt(date as string);
    }
    
    const slots = await Slot.find(query).sort({ date: 1, startTime: 1 });
    sendSuccess(res, slots);
  } catch (error: any) {
    sendError(res, 'Failed to fetch slots', 500);
  }
};

export const getSlotIndicators = async (req: Request, res: Response) => {
  try {
    const { agencyId } = req.query;
    const query: any = {};
    if (agencyId) query.agencyId = agencyId;
    
    const slots = await Slot.find(query);
    const indicators = slots.reduce((acc: any, slot: any) => {
      if (!acc[slot.date]) acc[slot.date] = { hasAvailable: false, hasBooked: false };
      if (slot.status === 'Available') acc[slot.date].hasAvailable = true;
      if (slot.status === 'Booked') acc[slot.date].hasBooked = true;
      return acc;
    }, {});
    sendSuccess(res, indicators);
  } catch (error) {
    sendError(res, 'Failed to fetch indicators', 500);
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const slotData = req.body;
    const userId = (req as any).user?.id;
    
    // If user is an agency, find and auto-assign their agency ID
    if (userId && (req as any).user?.role === 'agency') {
      const agency = await Agency.findOne({ userId });
      if (agency) {
        slotData.agencyId = agency._id;
      } else {
        return sendError(res, 'Agency profile not found', 404);
      }
    }
    
    const slot = await Slot.create(slotData);
    sendSuccess(res, slot, 201);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to create slot', 400);
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findByIdAndUpdate(id, req.body, { new: true });
    if (!slot) {
      return sendError(res, 'Slot not found', 404);
    }
    sendSuccess(res, slot);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to update slot', 400);
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findById(id);
    
    if (!slot) {
      return sendError(res, 'Slot not found', 404);
    }
    
    // Prevent deleting booked slots
    if (slot.status === 'Booked') {
      return sendError(res, 'Cannot delete a booked slot. Please cancel the booking first.', 400);
    }
    
    await Slot.findByIdAndDelete(id);
    sendSuccess(res, { success: true });
  } catch (error) {
    sendError(res, 'Failed to delete slot', 500);
  }
};

export const bookSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const userName = (req as any).user?.name || req.body.bookedBy;

    const slot = await Slot.findById(id);
    if (!slot) {
      return sendError(res, 'Slot not found', 404);
    }
    if (slot.status !== 'Available') {
      return sendError(res, 'Slot is not available', 400);
    }

    slot.status = 'Booked';
    slot.bookedBy = userName || userId;
    await slot.save();

    sendSuccess(res, slot);
  } catch (error: any) {
    sendError(res, error.message || 'Failed to book slot', 400);
  }
};