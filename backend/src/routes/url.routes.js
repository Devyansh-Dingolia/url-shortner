import { Router } from 'express';
import { createShortUrl, redirectToOriginalUrl, getUrlStats } from '../controller/url.controller.js';

const router = Router();

router.route('/shorten').post(createShortUrl);
router.route('/:shortCode').get(redirectToOriginalUrl);
router.route('/stats').post(getUrlStats);

export default router;