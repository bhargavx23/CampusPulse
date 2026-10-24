import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword, UserEntity } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env variables if not already injected
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

loadEnv();

/**
 * CampusPulse Administrator Account Provisioning Script
 * Reads credentials from secure environment variables, hashes passwords,
 * and sets up the root administrator account without exposing secrets.
 */
export async function provisionAdminAccount() {
  console.log('--- CampusPulse Secure Administrator Provisioning ---');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminEmail) {
    console.error('ERROR: ADMIN_EMAIL environment variable is missing.');
    return { success: false, reason: 'Missing ADMIN_EMAIL' };
  }

  if (!adminPassword) {
    console.error('ERROR: ADMIN_INITIAL_PASSWORD environment variable is missing.');
    return { success: false, reason: 'Missing ADMIN_INITIAL_PASSWORD' };
  }

  const normalizedEmail = adminEmail.trim().toLowerCase();

  // Storage path for standalone server registry file
  const storageDir = path.resolve(__dirname, '../data');
  const storageFile = path.join(storageDir, 'users.json');

  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  let users = [];
  if (fs.existsSync(storageFile)) {
    try {
      users = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
    } catch (e) {
      console.warn('Warning: Could not read existing users registry, starting fresh.');
      users = [];
    }
  }

  // Check if admin already exists
  const existingAdmin = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingAdmin) {
    console.log(`[INFO] Administrator account "${normalizedEmail}" already exists with role: "${existingAdmin.role}".`);
    console.log('[INFO] Skipping creation to preserve existing credentials. Provisioning complete.');
    return {
      success: true,
      alreadyExists: true,
      email: normalizedEmail,
      role: existingAdmin.role,
    };
  }

  // Create new secure administrator account
  const passwordHash = hashPassword(adminPassword);
  const newAdmin = new UserEntity({
    id: `usr_admin_${Date.now()}`,
    name: 'Bhargav Pasupuleti',
    email: normalizedEmail,
    role: 'admin',
    department: 'Grievance Redressal & Institutional Administration',
    studentId: 'ADMIN-PORTAL-CHIEF',
    passwordHash: passwordHash,
    isVerified: true,
  });

  users.push(newAdmin);
  fs.writeFileSync(storageFile, JSON.stringify(users, null, 2), 'utf8');

  console.log(`[SUCCESS] Administrator account provisioned successfully.`);
  console.log(`[SUCCESS] Account Email: ${normalizedEmail}`);
  console.log(`[SUCCESS] Role: ${newAdmin.role}`);
  console.log(`[SUCCESS] Password has been cryptographically hashed (PBKDF2/SHA-512 with 100,000 iterations).`);
  console.log(`[SECURITY] Raw password was NOT stored in database or public logs.`);

  return {
    success: true,
    created: true,
    email: normalizedEmail,
    role: newAdmin.role,
  };
}

// Execute if run directly from terminal
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  provisionAdminAccount()
    .then((result) => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('Fatal provisioning error:', err);
      process.exit(1);
    });
}
