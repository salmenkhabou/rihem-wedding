const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;
const RSVP_FILE = path.join(__dirname, 'rsvps.json');
const SONGS_FILE = path.join(__dirname, 'songs.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ensure JSON files exist
if (!fs.existsSync(RSVP_FILE)) {
  fs.writeFileSync(RSVP_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SONGS_FILE)) {
  fs.writeFileSync(SONGS_FILE, JSON.stringify([], null, 2));
}

// Submit RSVP
app.post('/api/rsvp', (req, res) => {
  try {
    const { name, email, attendance, guests, dietary, message } = req.body;

    if (!name || !attendance) {
      return res.status(400).json({ error: 'Name and attendance are required fields.' });
    }

    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8') || '[]');

    const newRsvp = {
      id: Date.now().toString(),
      name,
      email: email || '',
      attendance,
      guests: parseInt(guests) || 0,
      dietary: dietary || '',
      message: message || '',
      submittedAt: new Date().toISOString()
    };

    rsvps.push(newRsvp);
    fs.writeFileSync(RSVP_FILE, JSON.stringify(rsvps, null, 2));

    console.log(`New RSVP received: ${name} (${attendance})`);
    return res.status(201).json({ success: true, message: 'Thank you! Your RSVP has been received.' });
  } catch (error) {
    console.error('Error handling RSVP:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit Song Recommendation
app.post('/api/song', (req, res) => {
  try {
    const { name, title, artist } = req.body;

    if (!name || !title) {
      return res.status(400).json({ error: 'Name and song title are required.' });
    }

    const songs = JSON.parse(fs.readFileSync(SONGS_FILE, 'utf8') || '[]');

    const newSong = {
      id: Date.now().toString(),
      name,
      title,
      artist: artist || 'Unknown Artist',
      submittedAt: new Date().toISOString()
    };

    songs.push(newSong);
    fs.writeFileSync(SONGS_FILE, JSON.stringify(songs, null, 2));

    console.log(`New Song suggestion: "${title}" by ${artist} from ${name}`);
    return res.status(201).json({ success: true, message: 'Song suggestion saved successfully.' });
  } catch (error) {
    console.error('Error handling song suggestion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all RSVPs (for owner dashboard)
app.get('/api/rsvp', (req, res) => {
  try {
    const rsvps = JSON.parse(fs.readFileSync(RSVP_FILE, 'utf8') || '[]');
    return res.json(rsvps);
  } catch (error) {
    console.error('Error retrieving RSVPs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all Song Suggestions
app.get('/api/song', (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync(SONGS_FILE, 'utf8') || '[]');
    return res.json(songs);
  } catch (error) {
    console.error('Error retrieving songs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Invitation server running at http://localhost:${PORT}`);
});
