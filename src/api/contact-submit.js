const fs = require('fs');
const path = require('path');
const multiparty = require('multiparty');
const contactPath = path.join(__dirname, '../../data/contactMessages.json');

// Control Hub Integration
const CONTROL_HUB_URL = process.env.CONTROL_HUB_URL || 'http://localhost:4000';
const CONTROL_HUB_API_KEY = process.env.CONTROL_HUB_API_KEY || 'dev-secret-key';

/**
 * Send contact form data to Control Hub
 */
async function sendToControlHub(contactData) {
  try {
    const response = await fetch(`${CONTROL_HUB_URL}/api/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONTROL_HUB_API_KEY,
        'X-Source': 'tagteam-website',
      },
      body: JSON.stringify({
        type: 'contact_form',
        timestamp: new Date().toISOString(),
        source: 'website',
        contact: contactData,
        priority: contactData.projectType === 'urgent' ? 'high' : 'normal',
        notifications: {
          email: true,
          sms: false,
          slack: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Control Hub responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Control Hub communication error:', error);
    throw error;
  }
}

/**
 * Fallback: Save to local JSON file if Control Hub is unavailable
 */
function saveToLocalBackup(contactData) {
  try {
    let messages = [];
    if (fs.existsSync(contactPath)) {
      messages = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
    }
    messages.push({
      ...contactData,
      _backup: true,
      _backupTimestamp: new Date().toISOString(),
      _needsControlHubSync: true,
    });
    fs.writeFileSync(contactPath, JSON.stringify(messages, null, 2));
    console.log('✅ Contact saved to local backup');
  } catch (error) {
    console.error('❌ Failed to save local backup:', error);
  }
}

/**
 * Parse multipart form data (for file uploads)
 */
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      // Convert fields from arrays to single values
      const parsedFields = {};
      Object.keys(fields).forEach((key) => {
        parsedFields[key] = fields[key][0];
      });
      resolve({ fields: parsedFields, files });
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse FormData (multipart)
    const { fields, files } = await parseFormData(req);
    const { name, email, projectType, deadline, budget, message } = fields;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const contactData = {
      name,
      email,
      projectType: projectType || 'general',
      deadline: deadline || null,
      budget: budget || null,
      message,
      fileName: files.file ? files.file[0].originalFilename : null,
      submittedAt: new Date().toISOString(),
      source: 'contact_page',
    };

    // Try to send to Control Hub
    try {
      await sendToControlHub(contactData);
      console.log('✅ Contact sent to Control Hub');
      res.status(200).json({ success: true, source: 'control_hub' });
    } catch (controlHubError) {
      console.warn(
        '⚠️ Control Hub unavailable, saving to local backup:',
        controlHubError.message,
      );
      // Fallback to local storage
      saveToLocalBackup(contactData);
      res.status(200).json({
        success: true,
        source: 'local_backup',
        warning: 'Control Hub unavailable',
      });
    }
  } catch (parseError) {
    console.error('❌ Error parsing contact form data:', parseError);
    res.status(400).json({ error: 'Invalid request data' });
  }
};
