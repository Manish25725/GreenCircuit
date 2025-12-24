import { Request, Response } from 'express';
import { analyticsData } from '../models/store';
import { sendSuccess } from '../utils/response';


export const getAnalytics = (req: Request, res: Response) => {
  sendSuccess(res, analyticsData);
};
