/********************************************************************
 * server.js - Minimal Node/Express server that:
 *   - Serves index.html (and any static files) from same directory
 *   - Saves/loads .jm files to/from a "stored jm" folder
 *   - Lists .jm files in that folder
 ********************************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// The folder in which we store .jm mindmaps
const STORED_JM = path.join(__dirname, 'stored jm');

// Ensure "stored jm" folder exists
if (!fs.existsSync(STORED_JM)) {
  fs.mkdirSync(STORED_JM);
}

// Serve this entire directory (for index.html, etc.)
app.use(express.static(__dirname));
app.use(bodyParser.json({ limit: '10mb' }));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * GET /api/loadMindmap?filename=XYZ
 * Return { success, fileContent } if found, else { success: false }
 */
app.get('/api/loadMindmap', (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(STORED_JM, filename + '.jm');
  try {
    if (!fs.existsSync(filePath)) {
      return res.json({ success: false, error: 'File does not exist' });
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return res.json({ success: true, fileContent: content });
  } catch (err) {
    console.error('Error loading mindmap:', err);
    return res.json({ success: false, error: err.message });
  }
});

/**
 * POST /api/saveMindmap
 * Body: { filename, fileContent }
 * Writes fileContent to stored jm/<filename>.jm
 */
app.post('/api/saveMindmap', (req, res) => {
  const { filename, fileContent } = req.body;
  if (!filename || !filename.trim()) {
    return res.json({ success: false, error: 'No filename provided' });
  }
  try {
    const filePath = path.join(STORED_JM, filename + '.jm');
    fs.writeFileSync(filePath, fileContent, 'utf8');
    return res.json({ success: true });
  } catch (err) {
    console.error('Error saving mindmap:', err);
    return res.json({ success: false, error: err.message });
  }
});

/**
 * GET /api/listMindmaps
 * Return {success, maps: [...filenames without .jm]}
 */
app.get('/api/listMindmaps', (req, res) => {
  try {
    const files = fs.readdirSync(STORED_JM);
    const jmFiles = files.filter((f) => f.toLowerCase().endsWith('.jm'));
    const mapNames = jmFiles.map((f) => f.replace(/\.jm$/, ''));
    return res.json({ success: true, maps: mapNames });
  } catch (err) {
    console.error('Error listing mindmaps:', err);
    return res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
