const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const User = require('../models/User');
const Mood = require('../models/mood');
const Goal = require('../models/Goal');

// ─── Email Transporter ────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Email Template ───────────────────────────────────────────────────────────
const buildReminderEmail = (userEmail, missedMood, incompleteGoals) => {
  const goalsList = incompleteGoals.length > 0
    ? incompleteGoals.map(g => `
        <li style="margin-bottom:8px; padding: 8px 12px; background:#1e1e2e; border-left: 3px solid #8b5cf6; border-radius:4px; color:#e2e8f0;">
          🎯 <strong>${g.title}</strong> — ${g.streak} day streak, ${g.target - (g.completionHistory?.length || 0)} days left
        </li>`).join('')
    : '';

  const moodSection = missedMood ? `
    <div style="background:#2d1f3d; border:1px solid #7c3aed; border-radius:12px; padding:16px; margin-bottom:16px;">
      <p style="color:#c4b5fd; font-size:15px; margin:0;">
        😔 <strong>You haven't logged your mood today.</strong> Taking a moment to check in with yourself makes a real difference!
      </p>
    </div>` : '';

  const goalsSection = incompleteGoals.length > 0 ? `
    <div style="background:#1a2e1a; border:1px solid #16a34a; border-radius:12px; padding:16px; margin-bottom:16px;">
      <p style="color:#86efac; font-size:15px; margin:0 0 10px 0;">
        🎯 <strong>Keep your streak alive!</strong> These goals need your attention today:
      </p>
      <ul style="list-style:none; margin:0; padding:0;">${goalsList}</ul>
    </div>` : '';

  return {
    from: `"MindSpace 🧠" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `💙 Your Daily MindSpace Check-in`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif; max-width:560px; margin:0 auto; background:#0f0f1a; border-radius:16px; overflow:hidden; border:1px solid #2d2d4a;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#7c3aed,#db2777); padding:28px 32px; text-align:center;">
          <h1 style="color:white; margin:0; font-size:24px; letter-spacing:-0.5px;">🧠 MindSpace</h1>
          <p style="color:rgba(255,255,255,0.85); margin:6px 0 0; font-size:14px;">Your daily wellness reminder</p>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <p style="color:#e2e8f0; font-size:16px; margin:0 0 20px;">Hi there! 👋 Here's your daily check-in from MindSpace:</p>

          ${moodSection}
          ${goalsSection}

          <!-- CTA -->
          <div style="text-align:center; margin-top:24px;">
            <a href="${process.env.FRONTEND_URL || 'https://mind-space-web.vercel.app'}"
               style="display:inline-block; background:linear-gradient(135deg,#7c3aed,#db2777); color:white; text-decoration:none; padding:14px 32px; border-radius:12px; font-weight:600; font-size:15px; letter-spacing:0.3px;">
              Open MindSpace ✨
            </a>
          </div>

          <p style="color:#64748b; font-size:12px; text-align:center; margin-top:24px;">
            You're receiving this because you have reminders enabled on MindSpace.<br/>
            Take care of yourself today 💙
          </p>
        </div>
      </div>
    `
  };
};

// ─── Core Reminder Logic ──────────────────────────────────────────────────────
const sendDailyReminders = async () => {
  try {
    console.log('⏰ Running daily reminder job...');

    const users = await User.find({});
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let sent = 0;

    for (const user of users) {
      try {
        // Check if user logged mood today
        const todayMood = await Mood.findOne({
          userId: user._id,
          createdAt: { $gte: startOfToday }
        });
        const missedMood = !todayMood;

        // Check incomplete active goals
        const incompleteGoals = await Goal.find({
          userId: user._id,
          isActive: true,
          completed: false
        }).limit(3);

        // Only send if there's something to remind about
        if (!missedMood && incompleteGoals.length === 0) continue;

        const mailOptions = buildReminderEmail(user.email, missedMood, incompleteGoals);
        await transporter.sendMail(mailOptions);
        sent++;
        console.log(`✅ Reminder sent to ${user.email}`);

      } catch (userErr) {
        console.error(`❌ Failed for ${user.email}:`, userErr.message);
      }
    }

    console.log(`📧 Daily reminders done — sent to ${sent} users`);
  } catch (err) {
    console.error('❌ Reminder job failed:', err.message);
  }
};

// ─── Cron Job — 8:00 AM IST daily (2:30 UTC) ─────────────────────────────────
cron.schedule('30 2 * * *', sendDailyReminders, {
  timezone: 'Asia/Kolkata'
});

console.log('📅 Daily reminder cron scheduled at 8:00 AM IST');

// ─── Manual Trigger Route (for testing) ──────────────────────────────────────
router.post('/trigger', async (req, res) => {
  try {
    await sendDailyReminders();
    res.json({ success: true, message: 'Reminders sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Test Email Route ─────────────────────────────────────────────────────────
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    await transporter.sendMail({
      from: `"MindSpace 🧠" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ MindSpace Email Test',
      html: '<div style="font-family:Arial;padding:20px;background:#0f0f1a;color:white;border-radius:12px;"><h2>🧠 MindSpace</h2><p>Email is working correctly! ✅</p></div>'
    });

    res.json({ success: true, message: `Test email sent to ${email}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;