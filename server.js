require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// The endpoint your frontend will call
app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'Please provide a TikTok URL' });
    }

    try {
        // Options for your working RapidAPI
        const options = {
            method: 'GET',
            url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/rich_response/index', 
            params: { url: url },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // 1. PRINTING THE DATA TO THE TERMINAL
        console.log("RAW API RESPONSE:", JSON.stringify(response.data, null, 2)); 
        
        // 2. EXTRACTING THE VIDEO LINK
        // Looking into the 'video' array and grabbing the first item [0]
        let cleanVideoUrl = null;
        if (response.data.video && response.data.video.length > 0) {
            cleanVideoUrl = response.data.video[0];
        }
        
        // If we can't find the link, send an error to the frontend
        if (!cleanVideoUrl) {
            return res.status(500).json({ 
                error: 'Connected successfully, but could not find the exact video link. Please check your terminal logs.' 
            });
        }

        // Send the successful link back to the frontend!
        res.json({ downloadUrl: cleanVideoUrl });

    } catch (error) {
        // Detailed error logging
        console.error("API ERROR:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to process the video. Check your server terminal.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));