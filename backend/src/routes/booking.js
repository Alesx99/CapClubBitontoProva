const express = require('express');
const router = express.Router();
const db = require('../db/index');
const { requireAdmin } = require('../middleware/auth');

// POST /api/booking - Submit a guest booking
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, type, date, time, notes } = req.body;
    
    // Validation
    const errors = [];
    if (!name || typeof name !== 'string' || name.trim().length === 0) errors.push('Name is required.');
    if (!email || typeof email !== 'string' || !email.includes('@')) errors.push('Valid email is required.');
    if (!phone || typeof phone !== 'string' || phone.trim().length < 5) errors.push('Valid phone number is required.');
    if (!type || !['Tavolo Bistrot', 'Campo Padel', 'Beach Volley', 'Calcio', 'Festa Bambini'].includes(type)) {
      errors.push('Invalid booking type.');
    }
    if (!date || typeof date !== 'string' || date.trim().length === 0) errors.push('Date is required.');
    if (!time || typeof time !== 'string' || time.trim().length === 0) errors.push('Time is required.');
    
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation Error', details: errors });
    }

    // Save to Database
    const booking = await db.createBooking({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      type,
      date,
      time,
      notes: notes ? notes.trim() : ''
    });

    // Fetch booking receiver email from settings
    const settings = await db.getAllSettings();
    const receiverEmail = settings.booking_email_receiver || process.env.BOOKING_EMAIL_RECEIVER || 'info@capclub.it';

    // Log reservation in server console
    console.log('\n==================================================');
    console.log(`[NEW BOOKING RECEIVED] ID: ${booking.id}`);
    console.log(`Guest:    ${booking.name} (${booking.email} | ${booking.phone})`);
    console.log(`Type:     ${booking.type}`);
    console.log(`Schedule: ${booking.date} @ ${booking.time}`);
    console.log(`Notes:    ${booking.notes || 'None'}`);
    console.log(`==================================================\n`);

    // Simulated/Nodemailer email sending logic
    const emailSubject = `Nuova Prenotazione Esclusiva CapClub: ${type} - ${name}`;
    const emailBody = `
      Spettabile Gestione CapClub,
      
      È stata registrata una nuova richiesta di prenotazione in attesa di approvazione:
      
      - ID Richiesta: ${booking.id}
      - Cliente: ${name}
      - Email: ${email}
      - Telefono: ${phone}
      - Tipologia: ${type}
      - Data: ${date}
      - Orario: ${time}
      - Note Speciali: ${notes || 'Nessuna nota fornita.'}
      
      Gestisci la richiesta visitando l'area amministratore: /#/admin
      
      Cordiali saluti,
      CapClub Booking Automation System
    `;

    // Try Nodemailer if configured
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        
        await transporter.sendMail({
          from: `"CapClub Booking" <${process.env.SMTP_USER}>`,
          to: receiverEmail,
          subject: emailSubject,
          text: emailBody
        });
        console.log(`[EMAIL SENT] Notification email successfully delivered to ${receiverEmail}`);
      } else {
        // Fallback to simulated log
        console.log(`[EMAIL SIMULATION] Sending email to ${receiverEmail}`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Body: ${emailBody}`);
      }
    } catch (emailErr) {
      console.error('[EMAIL ERROR] Failed to send notification email:', emailErr.message);
    }

    res.status(201).json({ 
      success: true, 
      message: 'La tua richiesta è in attesa di approvazione esclusiva. Riceverai un\'email di conferma.', 
      booking 
    });
  } catch (err) {
    console.error('Error submitting booking:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/bookings - Retrieve all bookings (admin check required)
router.get('/bookings', requireAdmin, async (req, res) => {
  try {
    const bookings = await db.getAllBookings();
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// PUT /api/bookings/:id - Confirm or reject booking (admin check required)
router.put('/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    if (!['pending', 'confirmed', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, confirmed, or declined.' });
    }
    
    const updated = await db.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`[BOOKING STATUS UPDATED] ID: ${id} -> Status: ${status}`);

    // Simulated email customer confirmation logic
    console.log(`[EMAIL SIMULATION] Sending confirmation/rejection to customer: ${updated.email}`);
    console.log(`Subject: Aggiornamento Prenotazione CapClub - ID: ${id}`);
    console.log(`Body: Gentile ${updated.name}, la tua prenotazione per ${updated.type} in data ${updated.date} alle ore ${updated.time} è stata: ${status === 'confirmed' ? 'CONFERMATA' : 'RIFIUTATA'}.`);

    res.json(updated);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// PUT /api/booking/bookings/:id/assign - Assign table to a booking (admin check required)
router.put('/bookings/:id/assign', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { tableNumber } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const updated = await db.assignTable(id, tableNumber);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`[BOOKING TABLE ASSIGNED] ID: ${id} -> Table: ${tableNumber || 'None'}`);
    res.json(updated);
  } catch (err) {
    console.error('Error assigning table to booking:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// GET /api/booking/occupancy - Retrieve manually occupied tables (admin check required)
router.get('/occupancy', requireAdmin, async (req, res) => {
  try {
    const { date, slot } = req.query;
    if (!date || !slot) {
      return res.status(400).json({ error: 'Missing date or slot query parameters' });
    }

    const occupancyList = await db.getTableOccupancy(date, slot);
    res.json(occupancyList);
  } catch (err) {
    console.error('Error fetching table occupancy:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

// POST /api/booking/occupancy/toggle - Toggle manual walk-in table occupancy (admin check required)
router.post('/occupancy/toggle', requireAdmin, async (req, res) => {
  try {
    const { date, slot, tableNumber, status } = req.body;
    
    if (!date || !slot || tableNumber === undefined || !['available', 'occupied'].includes(status)) {
      return res.status(400).json({ error: 'Missing date, slot, tableNumber, or invalid status' });
    }

    const updatedList = await db.toggleTableOccupancy(date, slot, tableNumber, status);
    res.json(updatedList);
  } catch (err) {
    console.error('Error toggling table occupancy:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;
