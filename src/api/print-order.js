const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const nodemailer = require('nodemailer');

const ordersPath = path.join(__dirname, '../../data/printOrders.json');
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = formidable({ multiples: false, uploadDir: uploadsDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ error: 'Error parsing form data' });
      return;
    }

    // Save file info if uploaded
    let artFileUrl = null;
    if (files.artFile) {
      const file = files.artFile;
      const newFilePath = path.join(uploadsDir, file.newFilename || file.name);
      fs.renameSync(file.filepath || file.path, newFilePath);
      artFileUrl = `/uploads/${path.basename(newFilePath)}`;
    }

    // Prepare order object
    const order = {
      shirtCount: fields.shirtCount,
      numColors: fields.numColors,
      hasUnderbase: fields.hasUnderbase === 'true' || fields.hasUnderbase === true,
      notes: fields.notes,
      quote: fields.quote ? JSON.parse(fields.quote) : null,
      artFileUrl,
      date: new Date().toISOString(),
    };

    // Save order to JSON file
    let orders = [];
    if (fs.existsSync(ordersPath)) {
      orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    }
    orders.push(order);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your SMTP provider
      auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password', // Use an app password, not your main password
      },
    });

    // Email options
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: 'your_email@gmail.com', // Or your admin/production email
      subject: 'New Print Order Received',
      text: `
        New print order received:
        Shirts: ${order.shirtCount}
        Colors: ${order.numColors}
        Underbase: ${order.hasUnderbase}
        Notes: ${order.notes}
        Quote: ${JSON.stringify(order.quote, null, 2)}
        File: ${order.artFileUrl ? 'Yes' : 'No'}
        Date: ${order.date}
      `,
      // Optionally attach the artwork file
      attachments: order.artFileUrl
        ? [
            {
              filename: order.artFileUrl.split('/').pop(),
              path: path.join(uploadsDir, order.artFileUrl.split('/').pop()),
            },
          ]
        : [],
    };

    // Send email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
        // Don't fail the API if email fails, just log
      }
    });

    res.status(200).json({ success: true });
  });
};