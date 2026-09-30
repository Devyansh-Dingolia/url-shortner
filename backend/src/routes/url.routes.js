import { Router } from 'express';
import { createShortUrl, redirectToOriginalUrl } from '../controller/url.controller.js';

const router = Router();

router.route('/shorten').post(createShortUrl);
router.route('/:shortCode').get(redirectToOriginalUrl);

export default router;