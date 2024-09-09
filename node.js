const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Function to generate a random 10-digit license ID
function generateLicenseID() {
  return Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit number
}

// Function to calculate expiration date (1 month from current date)
function calculateExpirationDate() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1); // Add 1 month
  return date.toISOString().split('T')[0] + 'T23:59:59'; // Return date in ISO format with time set to end of day
}

// Set up nodemailer to send email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password',  // Replace with your email password or use app password
  },
});

app.post('/create-license', async (req, res) => {
  const { email, transactionId } = req.body;

  try {
    // Generate license ID and expiration date
    const licenseID = generateLicenseID();
    const expirationDate = calculateExpirationDate();

    // Make a request to the auth server to create the license
    const response = await axios.post('https://faldon-idle-server-fbfdcd5d8349.herokuapp.com/create_license', {
      license_id: licenseID,
      expiration_date: expirationDate
    });

    if (response.status === 200) {
      // Send email with the license details
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'anthonyreeder123@gmail.com', // For testing, replace with buyer's email later
        subject: 'Your Faldron License Key',
        text: `Thank you for your purchase!\n\nHere is your license key: ${licenseID}\nExpiration Date: ${expirationDate}\n\nEnjoy using Faldron!`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ message: 'License created, but failed to send email' });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).send({ message: 'License created and emailed!' });
        }
      });
    } else {
      throw new Error('Failed to create license');
    }
  } catch (error) {
    console.error('Error creating license:', error);
    res.status(500).send({ message: 'Failed to create license' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});