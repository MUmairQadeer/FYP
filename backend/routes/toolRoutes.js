import express from 'express';
import {
  checkVisa,
  getWeather,
  getCountryInfo,
  getPrayerTimes,
  getCurrencies,
} from '../controllers/toolController.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const router = express.Router();

router.get('/visa', asyncHandler(checkVisa));
router.get('/weather', asyncHandler(getWeather));
router.get('/country-info', asyncHandler(getCountryInfo));
router.get('/prayer-times', asyncHandler(getPrayerTimes));
router.get('/currencies', asyncHandler(getCurrencies));

export default router;
