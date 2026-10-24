import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { hashPassword, verifyPassword } from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export async function cleanupAndProvision() {
  console.log('===============================================================');
  console.log('   CAMPUSPULSE: DATABASE AUDIT, CLEANUP & PROVISIONING');
  console.log('===============================================================\n');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuspulse';
  const env = process.env.NODE_ENV || 'development';
  const targetAdminEmail = (process.env.ADMIN_EMAIL || 'bhargavpasupuleti5@gmail.com').trim().toLowerCase();
  const targetAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || '123456';

  console.log(`[TARGET DATABASE] URI: ${uri}`);
  console.log(`[ENVIRONMENT] NODE_ENV: ${env}`);
  console.log(`[TARGET ADMIN EMAIL] ${targetAdminEmail}`);

  // Safety confirmation
  const isLocalDev = uri.includes('localhost') || uri.includes('127.0.0.1') || env === 'development';
  if (!isLocalDev) {
    throw new Error('Safety guard: Database is not local development. Aborting cleanup to prevent data loss.');
  }

  // Connect
  await mongoose.connect(uri);
  console.log('[CONNECTED] Connected to MongoDB database successfully.\n');

  // --- Step 1: Pre-cleanup Audit ---
  const usersBefore = await User.find({}).select('+passwordHash');
  const complaintsBefore = await Complaint.find({});
  const notificationsBefore = await Notification.find({});

  const studentCountBefore = usersBefore.filter((u) => u.role === 'student').length;
  const adminCountBefore = usersBefore.filter((u) => u.role === 'admin').length;

  console.log('--- PRE-CLEANUP AUDIT SUMMARY ---');
  console.log(`Total User Accounts Before: ${usersBefore.length}`);
  console.log(`- Student Accounts: ${studentCountBefore}`);
  console.log(`- Administrator Accounts: ${adminCountBefore}`);
  console.log(`Total Complaints in DB: ${complaintsBefore.length}`);
  console.log(`Total Notifications in DB: ${notificationsBefore.length}\n`);

  // --- Step 2: Create Secure Local Backup ---
  const backupDir = path.resolve(__dirname, '../data/backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${backupTimestamp}.json`);
  const backupData = {
    metadata: {
      timestamp: new Date().toISOString(),
      database: uri,
      environment: env,
      userCount: usersBefore.length,
      complaintCount: complaintsBefore.length,
    },
    users: usersBefore.map((u) => u.toObject()),
    complaints: complaintsBefore.map((c) => c.toObject()),
    notifications: notificationsBefore.map((n) => n.toObject()),
  };

  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`[BACKUP CREATED] Backup saved securely to: ${backupFile}\n`);

  // --- Step 3: Remove Student Accounts & Their Related Records ---
  const studentDeleteResult = await User.deleteMany({ role: 'student' });
  console.log(`[CLEANUP] Deleted ${studentDeleteResult.deletedCount} ordinary student account(s).`);

  // Remove orphan complaints/notifications created by removed test students
  const complaintDeleteResult = await Complaint.deleteMany({});
  console.log(`[CLEANUP] Cleared ${complaintDeleteResult.deletedCount} test grievance record(s) to guarantee zero orphaned records.`);

  const notifDeleteResult = await Notification.deleteMany({});
  console.log(`[CLEANUP] Cleared ${notifDeleteResult.deletedCount} test notification(s).`);

  // Remove duplicate/unintended admin accounts (not matching targetAdminEmail)
  const duplicateAdminResult = await User.deleteMany({
    role: 'admin',
    email: { $ne: targetAdminEmail },
  });
  console.log(`[CLEANUP] Removed ${duplicateAdminResult.deletedCount} unauthorized / duplicate administrator account(s).\n`);

  // --- Step 4: Provision or Verify Target Administrator Account ---
  let admin = await User.findOne({ email: targetAdminEmail }).select('+passwordHash');
  const hashedSecret = hashPassword(targetAdminPassword);

  if (!admin) {
    console.log(`[PROVISION] Administrator "${targetAdminEmail}" does not exist. Creating secure administrator account...`);
    admin = await User.create({
      name: 'Bhargav Pasupuleti',
      email: targetAdminEmail,
      role: 'admin',
      department: 'Grievance Redressal & Institutional Administration',
      studentId: 'ADMIN-PORTAL-CHIEF',
      phone: '+1 (555) 019-2834',
      hostelBlock: 'Administrative Wing',
      roomNumber: 'Dean Office 101',
      emergencyContact: 'Campus Administration Desk',
      passwordHash: hashedSecret,
      isVerified: true,
    });
    console.log('[PROVISION] Administrator account created successfully.');
  } else {
    console.log(`[PROVISION] Administrator "${targetAdminEmail}" already exists. Ensuring correct role and credentials...`);
    admin.role = 'admin';
    admin.name = 'Bhargav Pasupuleti';
    admin.passwordHash = hashedSecret;
    admin.isVerified = true;
    await admin.save();
    console.log('[PROVISION] Administrator account verified and updated.');
  }

  // Also sync the local file users.json for zero-dependency local utility fallback
  const fallbackUsersFile = path.resolve(__dirname, '../data/users.json');
  const adminObj = admin.toJSON();
  fs.writeFileSync(fallbackUsersFile, JSON.stringify([adminObj], null, 2), 'utf8');

  // --- Step 5: Post-Cleanup Verification & Live Authentication Check ---
  const usersAfter = await User.find({}).select('+passwordHash');
  const studentCountAfter = usersAfter.filter((u) => u.role === 'student').length;
  const adminCountAfter = usersAfter.filter((u) => u.role === 'admin').length;

  console.log('\n--- POST-CLEANUP VERIFICATION ---');
  console.log(`Total User Accounts After: ${usersAfter.length}`);
  console.log(`- Student Accounts: ${studentCountAfter}`);
  console.log(`- Administrator Accounts: ${adminCountAfter}`);
  console.log(`- Primary Admin Email: ${admin.email}`);
  console.log(`- Primary Admin Role: ${admin.role}`);

  // Test authentication
  const authTest = admin.comparePassword(targetAdminPassword);
  console.log(`- Admin Authentication Test (PBKDF2 validation): ${authTest ? 'PASSED (✓ Verified)' : 'FAILED (✗)'}`);

  console.log('\n===============================================================');
  console.log('   CLEANUP & PROVISIONING COMPLETE');
  console.log('===============================================================\n');

  return {
    success: true,
    database: uri,
    environment: env,
    accountsBefore: usersBefore.length,
    studentsRemoved: studentDeleteResult.deletedCount,
    duplicateAdminsRemoved: duplicateAdminResult.deletedCount,
    accountsAfter: usersAfter.length,
    adminEmail: admin.email,
    adminRole: admin.role,
    authVerified: authTest,
    backupFile,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cleanupAndProvision()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal cleanup error:', err);
      process.exit(1);
    });
}

export default cleanupAndProvision;
