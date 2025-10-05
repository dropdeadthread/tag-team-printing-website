// This is a mock endpoint. In production, integrate with an email/SMS service.
module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const { to, subject, message } = JSON.parse(body);
      if (!to || !subject || !message) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }
      // In production, send email/SMS here.
      res.status(200).json({ success: true });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
};