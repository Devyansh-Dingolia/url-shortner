import { Url } from "../model/url.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";

const createShortUrl = asyncHandler(async (req, res) => {
    const { originalUrl, expiresAt } = req.body;

    // Validate the original URL
    if (!originalUrl) {
        throw new ApiError(400, "Original URL is required");
    }

    try {
        new URL(originalUrl);
    } catch {
        throw new ApiError(400, "Invalid URL");
    }

    // Generate a unique short code
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shortCode;
    let isUnique = false;

    while (!isUnique) {
        shortCode = "";
        for (let i = 0; i < 6; i++) {
            shortCode += chars[Math.floor(Math.random() * chars.length)];
        }

        // Check if the short code is unique
        const url = await Url.findOne({ shortCode });
        if (!url) {
            isUnique = true;
        }
    }

    // Create the short URL
    const shortUrl = await Url.create({
        originalUrl,
        shortCode,
        expiresAt
    });

    shortCode = shortUrl.shortCode;

    // Return the short URL
    res
        .status(201)
        .json(new ApiResponse(201, { shortCode }, "Short URL created successfully"));

});

const redirectToOriginalUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;

    // Find the original URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
        return res
            .status(404)
            .send("<h1>404 - Short URL not found</h1>");
    }

    // Check if the URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
        return res
            .status(410)
            .send("<h1>410 - Short URL has expired</h1>");
    }

    // Update click count and last clicked timestamp
    url.clicks += 1;
    url.lastClickedAt = new Date();
    await url.save();

    // Redirect to the original URL
    res.redirect(url.originalUrl);
});

export { createShortUrl, redirectToOriginalUrl };