import { analyticsData } from '../models/store.js';
import { sendSuccess } from '../utils/response.js';
export const getAnalytics = (req, res) => {
    sendSuccess(res, analyticsData);
};
