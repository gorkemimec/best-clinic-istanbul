import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://imeclinic.com',
    'https://www.imeclinic.com',
    /\.sslip\.io$/
  ],
  credentials: true
}));
app.use(express.json());

// Static frontend serving (Vite build output)
const distPath = path.join(__dirname, '..', 'dist');
app.use('/best-clinic-istanbul', express.static(distPath, {
  acceptRanges: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));

// Health check
app.get(['/api/health', '/best-clinic-istanbul/api/health'], (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Bitrix24 Lead Submission Endpoint
app.post(['/api/leads', '/best-clinic-istanbul/api/leads'], async (req, res) => {
  try {
    const { name, countryCode, phone } = req.body;

    // Validation
    if (!name || !countryCode || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name, country code, and phone are required'
      });
    }

    // Bitrix24 Webhook URL
    const BITRIX_WEBHOOK = process.env.BITRIX_WEBHOOK_URL;

    if (!BITRIX_WEBHOOK) {
      console.error('BITRIX_WEBHOOK_URL not configured');
      return res.status(500).json({
        success: false,
        error: 'Bitrix24 not configured'
      });
    }

    // Remove leading 0 from phone
    const cleanPhone = phone.replace(/^0+/, '');
    const fullPhone = `${countryCode}${cleanPhone}`;

    // Send lead to Bitrix24
    const bitrixResponse = await axios.post(`${BITRIX_WEBHOOK}crm.lead.add`, {
      fields: {
        TITLE: `${name} - Dental Istanbul`,
        NAME: name,
        PHONE: [{
          VALUE: fullPhone,
          VALUE_TYPE: 'WORK'
        }],
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: 'IME Clinic Dental Istanbul Landing Page',
        STATUS_ID: 'NEW',
        OPENED: 'Y',
        ASSIGNED_BY_ID: 965,
        COMMENTS: 'Dental Istanbul Landing Page Lead',
        UTM_SOURCE: 'website',
        UTM_MEDIUM: 'contact-form',
        UTM_CAMPAIGN: 'best-clinic-istanbul'
      }
    });

    if (bitrixResponse.data && bitrixResponse.data.result) {
      console.log(`✅ Lead created in Bitrix24: ID ${bitrixResponse.data.result}`);

      return res.json({
        success: true,
        leadId: bitrixResponse.data.result,
        message: 'Lead successfully created in Bitrix24'
      });
    } else {
      throw new Error('Invalid Bitrix24 response');
    }

  } catch (error) {
    console.error('❌ Bitrix24 Error:', error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: 'Failed to create lead',
      details: error.response?.data?.error_description || error.message
    });
  }
});

// SPA fallback
app.get('/best-clinic-istanbul/*', (req, res, next) => {
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/best-clinic-istanbul/');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/leads`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/dental-istanbul/`);
});
