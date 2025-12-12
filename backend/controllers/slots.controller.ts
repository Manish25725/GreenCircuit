import { Request, Response } from 'express';
import Slot from '../models/Slot';
import { sendSuccess, sendError } from '../utils/response';

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { date, agencyId } = req.query;
    let query: any = {};
    if (date) {
      query.date = parseInt(date as string);
    }
    if (agencyId) {
      query.agencyId = agencyId;
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
    // If user is an agency, auto-assign their agency ID
    if ((req as any).user?.agencyId) {
      slotData.agencyId = (req as any).user.agencyId;
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
    const slot = await Slot.findByIdAndDelete(id);
    if (!slot) {
      return sendError(res, 'Slot not found', 404);
    }
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