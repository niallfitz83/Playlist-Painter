// getPlaylists.js

const express = require('express');
const fetch = require('node-fetch'); // make sure you've installed node-fetch
const router = express.Router();

// Helper function to get playlists from Spotify API
const getSpotifyPlaylists = async (accessToken) => {
    const url = 'https://api.spotify.com/v1/me/playlists';
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    try {
        const response = await fetch(url, { headers: headers });
        const data = await response.json();
        if (!response.ok) {
            // Handle any errors from the Spotify API
            throw new Error(data.error.message);
        }
        return data.items; // Assuming you want to return just the array of playlist items
    } catch (error) {
        // Handle errors such as network issues or JSON parsing problems
        console.error('Error fetching playlists:', error);
        throw error;
    }
};

// Route to get the playlists
router.get('/', async (req, res) => {
    try {
        // Here you need to have a way to get the access token, for example from the session
        const accessToken = req.session.user.access_token;
        if (!accessToken) {
            return res.status(401).send('Access Token is missing or expired');
        }
        
        const playlists = await getSpotifyPlaylists(accessToken);
        res.json(playlists); // Send the playlists to the client
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
