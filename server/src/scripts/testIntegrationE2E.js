import assert from 'assert';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import emailService from '../services/emailService.js';

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-bypass-rate-limit': 'test-runner',
    ...(options.headers || {}),
  };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

export async function runIntegrationTests() {
  console.log('===============================================================');
  console.log('  CAMPUSPULSE: COMPLETE END-TO-END VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function record(name, condition) {
    if (condition) {
      console.log(`[PASS] ✓ ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ✗ ${name}`);
      failed++;
    }
  }

  // --- 1. Health Endpoint ---
  const healthRes = await request('/health');
  record('Health Check: API is operational and connected to MongoDB', healthRes.ok && healthRes.data.status === 'healthy');

  // --- 2. Administrator Authentication ---
  const adminLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'bhargavpasupuleti5@gmail.com', password: '123456' },
  });
  record('Admin Auth: Bhargav Pasupuleti authenticates with password', adminLogin.ok && adminLogin.data.user.role === 'admin');
  const adminToken = adminLogin.data.token;
  record('Admin Security: Password hash is NOT exposed in response payload', !adminLogin.data.user.passwordHash);

  // --- 3. Invalid Login Rejection ---
  const invalidLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: 'bhargavpasupuleti5@gmail.com', password: 'wrongPassword' },
  });
  record('Security: Invalid credentials rejected with HTTP 401', invalidLogin.status === 401 && !invalidLogin.ok);

  // --- 4. Student Registration Validation ---
  const invalidReg = await request('/auth/register', {
    method: 'POST',
    body: { fullName: 'A', email: 'notanemail' },
  });
  record('Registration Validation: Incomplete academic fields rejected with HTTP 400', invalidReg.status === 400);

  // Register Student 1
  const studentEmail = `priya.sharma.${Date.now()}@campus.edu`;
  const rollNumber = `24CS${Math.floor(1000 + Math.random() * 9000)}`;

  const studentReg = await request('/auth/register', {
    method: 'POST',
    body: {
      fullName: 'Priya Sharma',
      email: studentEmail,
      password: 'StudentSecurePass2026',
      branch: 'CSE — Computer Science and Engineering',
      yearOfStudy: '2nd Year',
      section: 'B',
      rollNumber: rollNumber,
      phone: '+91 98765 43210',
      hostelBlock: 'Gargi Hall of Residence',
      roomNumber: 'Room 208',
    },
  });
  record('Student Registration: Account created with full academic records', studentReg.status === 201 && studentReg.data.user.role === 'student');
  const studentToken = studentReg.data.token;
  const studentId = studentReg.data.user.id;

  // Duplicate email check
  const dupEmail = await request('/auth/register', {
    method: 'POST',
    body: {
      fullName: 'Duplicate Priya',
      email: studentEmail,
      password: 'StudentSecurePass2026',
      branch: 'CSE — Computer Science and Engineering',
      yearOfStudy: '2nd Year',
      section: 'B',
      rollNumber: `24CS${Math.floor(1000 + Math.random() * 9000)}`,
    },
  });
  record('Security: Duplicate email registration rejected with HTTP 409', dupEmail.status === 409);

  // Duplicate roll number check
  const dupRoll = await request('/auth/register', {
    method: 'POST',
    body: {
      fullName: 'Another Student',
      email: `other.${Date.now()}@campus.edu`,
      password: 'StudentSecurePass2026',
      branch: 'CSE — Computer Science and Engineering',
      yearOfStudy: '2nd Year',
      section: 'B',
      rollNumber: rollNumber,
    },
  });
  record('Security: Duplicate roll number registration rejected with HTTP 409', dupRoll.status === 409);

  // Student Login
  const studentLogin = await request('/auth/login', {
    method: 'POST',
    body: { email: studentEmail, password: 'StudentSecurePass2026' },
  });
  record('Student Login: Authenticates and receives valid session token', studentLogin.ok && studentLogin.data.user.email === studentEmail);

  // --- 5. Backend Authorization Security ---
  const studentAttemptAdminApi = await request('/admin/students', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Authorization: Student blocked from Admin API (/admin/students) with HTTP 403', studentAttemptAdminApi.status === 403);

  const studentAttemptAnalytics = await request('/complaints/analytics/overview', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Authorization: Student blocked from Admin Analytics with HTTP 403', studentAttemptAnalytics.status === 403);

  // --- 6. Grievance Submission Flow ---
  const complaintData = {
    title: 'AC Blower and Projector Display Breakdown in Lab 4',
    category: 'Electricity',
    location: 'Sir C.V. Raman Academic Block, 3rd Floor, Lab 4',
    priority: 'High',
    description: 'During morning computer networks lab, the ceiling AC blower stopped working and the central display began flickering vigorously, interrupting lecture slides.',
    attachments: [{ name: 'lab_breaker_photo.jpg', size: '1.2 MB', type: 'image/jpeg' }],
  };

  const submitRes = await request('/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: complaintData,
  });
  record('Complaint Submission: Grievance persisted with tracking ID in MongoDB', submitRes.status === 201 && submitRes.data.complaint.trackingId.startsWith('CP-'));
  const trackingId = submitRes.data.complaint.trackingId;
  const complaintDbId = submitRes.data.complaint._dbId;

  // --- 7. Student Scope & Private Access Validation ---
  // Create Student 2
  const student2Email = `arjun.patel.${Date.now()}@campus.edu`;
  const student2Reg = await request('/auth/register', {
    method: 'POST',
    body: {
      fullName: 'Arjun Patel',
      email: student2Email,
      password: 'ArjunSecurePass2026',
      branch: 'IT — Information Technology',
      yearOfStudy: '3rd Year',
      section: 'A',
      rollNumber: `23IT${Math.floor(1000 + Math.random() * 9000)}`,
    },
  });
  const student2Token = student2Reg.data.token;

  // Student 2 tries to access Priya's complaint
  const unauthorizedComplaintAccess = await request(`/complaints/${trackingId}`, {
    headers: { Authorization: `Bearer ${student2Token}` },
  });
  record('Data Isolation: Student 2 cannot read Student 1 private complaint (HTTP 403)', unauthorizedComplaintAccess.status === 403);

  // --- 8. Administrator Inspection & Triage ---
  const adminComplaintsRes = await request('/complaints', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const foundInAdminList = adminComplaintsRes.data.complaints.some((c) => c.trackingId === trackingId);
  record('Admin Queue: Administrator views newly submitted student grievance in queue', foundInAdminList);

  // Triage to in-progress
  const triageRes = await request(`/complaints/${trackingId}/triage`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'in-progress',
      assignedTo: 'Campus Electrical Services Unit #2',
      priority: 'Urgent',
      resolutionNote: 'Assigned Senior Technician David Vance. Inspection scheduled for 2:30 PM.',
    },
  });
  record('Admin Triage: Status transitioned to "in-progress" and maintenance unit assigned', triageRes.ok && triageRes.data.complaint.status === 'in-progress');

  // Verify Student sees updated status
  const studentViewUpdated = await request(`/complaints/${trackingId}`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Student View: Student sees updated "in-progress" status and audit timeline event', studentViewUpdated.data.complaint.status === 'in-progress' && studentViewUpdated.data.complaint.timeline.length >= 2);

  // Triage to resolved
  const resolveRes = await request(`/complaints/${trackingId}/triage`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      status: 'resolved',
      assignedTo: 'Campus Electrical Services Unit #2',
      resolutionNote: 'Sub-panel breaker replaced, line filter checked and calibrated. All Lab 4 equipment tested functional.',
    },
  });
  record('Admin Resolution: Grievance resolved and official findings recorded', resolveRes.ok && resolveRes.data.complaint.status === 'resolved');

  // Verify resolution reflects in student view
  const studentViewResolved = await request(`/complaints/${trackingId}`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Data Consistency: Student confirms grievance resolved with official findings', studentViewResolved.data.complaint.status === 'resolved' && studentViewResolved.data.complaint.resolutionNote.includes('calibrated'));

  // --- 9. In-App Notification Delivery ---
  const studentNotifs = await request('/notifications', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Notifications: Student receives in-app notifications for submission and resolution', studentNotifs.ok && studentNotifs.data.notifications.length >= 2);

  // --- 10. Dashboard Analytics Integrity ---
  const adminAnalytics = await request('/complaints/analytics/overview', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  record('Analytics Integrity: Admin dashboard reflects real MongoDB metrics (resolution rate > 0%)', adminAnalytics.ok && adminAnalytics.data.analytics.total >= 1 && adminAnalytics.data.analytics.resolved >= 1 && adminAnalytics.data.analytics.resolutionRate > 0);

  // Admin Students Directory
  const adminStudentsDir = await request('/admin/students', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const priyaEntry = adminStudentsDir.data.students.find((s) => s.email === studentEmail);
  record('Students Directory: Admin sees registered student with academic info and complaint count', Boolean(priyaEntry) && priyaEntry.complaintCount >= 1);

  // --- 11. Password Reset System & Email OTP Verification Suite ---
  console.log('\n--- Section 11: Email OTP Password Reset & Security Suite ---');

  // 11.1 Malformed email is rejected with HTTP 400
  const invalidEmailForgot = await request('/auth/forgot-password', {
    method: 'POST',
    body: { email: 'not-an-email' },
  });
  record('Forgot Password: Malformed email rejected with HTTP 400', invalidEmailForgot.status === 400);

  // Clear email service history
  emailService.clearSentEmails();

  // 11.2 Unregistered Account Check: Generic response (HTTP 200) & Privacy Defense
  const unregisteredEmail = `ghost.${Date.now()}@notregistered.edu`;
  const nonExistentForgot = await request('/auth/forgot-password', {
    method: 'POST',
    body: { email: unregisteredEmail },
  });
  record('Privacy Defense: Nonexistent email receives generic response (HTTP 200)', nonExistentForgot.status === 200 && nonExistentForgot.data.success === true);

  // Connect directly to verify DB state
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuspulse';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  // 11.3 Security: Verify no account or OTP was created in MongoDB for unregistered address
  const ghostAccount = await User.findOne({ email: unregisteredEmail });
  record('Security: Unregistered email does NOT create any database account', ghostAccount === null);
  const unregEmailsSent = emailService.getSentEmails().filter((e) => e.to === unregisteredEmail);
  record('Security: Never send OTP email to unregistered email address', unregEmailsSent.length === 0);

  // 11.4 Registered User OTP Request
  emailService.clearSentEmails();
  const existingForgot = await request('/auth/forgot-password', {
    method: 'POST',
    body: { email: studentEmail },
  });
  record('Forgot Password: Real account receives generic response (HTTP 200)', existingForgot.status === 200 && existingForgot.data.success === true);

  const studentInDb = await User.findOne({ email: studentEmail }).select(
    '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts +passwordResetOtpResendAfter'
  );
  record('Token Security: OTP is stored ONLY as SHA-256 hash (64 hex) in MongoDB', Boolean(studentInDb.passwordResetOtpHash) && studentInDb.passwordResetOtpHash.length === 64);
  record('Token Expiration: OTP expiration is set for 5 minutes in the future', Boolean(studentInDb.passwordResetOtpExpiresAt) && studentInDb.passwordResetOtpExpiresAt.getTime() > Date.now());

  // 11.5 Cooldown Enforcement: Requesting resend before 60 seconds without test bypass triggers HTTP 429
  const rapidResend = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: studentEmail }),
  });
  record('Resend Cooldown: Requesting new OTP before 60s cooldown triggers HTTP 429', rapidResend.status === 429);

  // 11.6 Cycle OTP: A new OTP invalidates the previous OTP
  const prevOtpHash = studentInDb.passwordResetOtpHash;
  await request('/auth/forgot-password', {
    method: 'POST',
    body: { email: studentEmail },
  });
  const studentInDbSecond = await User.findOne({ email: studentEmail }).select('+passwordResetOtpHash');
  record('Cycle OTP: Generating a new OTP invalidates the previous OTP hash', studentInDbSecond.passwordResetOtpHash !== prevOtpHash);

  // 11.7 Prepare controlled 6-digit OTP for deterministic verification tests
  const controlledOtp = '849201';
  const controlledOtpHash = crypto.createHash('sha256').update(controlledOtp).digest('hex');
  await User.updateOne(
    { email: studentEmail },
    {
      $set: {
        passwordResetOtpHash: controlledOtpHash,
        passwordResetOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        passwordResetOtpAttempts: 0,
      },
    }
  );

  // 11.8 Verify OTP Validation: Malformed OTP rejected (not 6 digits)
  const badOtpFormat = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: '123' },
  });
  record('Verify Validation: Non-6-digit OTP rejected with HTTP 400', badOtpFormat.status === 400);

  // 11.9 Verify OTP Validation: Incorrect OTP rejected with remaining attempts count
  const wrongOtpRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: '000000' },
  });
  record('Verify Validation: Incorrect OTP rejected with HTTP 400 and remaining count', wrongOtpRes.status === 400 && wrongOtpRes.data.remainingAttempts === 4);

  // 11.10 Attempt Limiting: Excessive incorrect attempts invalidate the OTP completely
  for (let i = 0; i < 4; i++) {
    await request('/auth/verify-otp', {
      method: 'POST',
      body: { email: studentEmail, otp: '111111' },
    });
  }
  const exceededAttemptsRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: controlledOtp }, // Even correct OTP now fails
  });
  record('Security: Excessive incorrect attempts (>5) invalidate the OTP completely', exceededAttemptsRes.status === 400);

  // 11.11 Expired OTP is rejected
  const expiredOtp = '739102';
  const expiredOtpHash = crypto.createHash('sha256').update(expiredOtp).digest('hex');
  await User.updateOne(
    { email: studentEmail },
    {
      $set: {
        passwordResetOtpHash: expiredOtpHash,
        passwordResetOtpExpiresAt: new Date(Date.now() - 5000), // Expired 5 seconds ago
        passwordResetOtpAttempts: 0,
      },
    }
  );
  const expiredOtpRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: expiredOtp },
  });
  record('Security: Expired OTP rejected with HTTP 400', expiredOtpRes.status === 400 && expiredOtpRes.data.isExpired === true);

  // 11.12 Correct OTP is accepted before expiration and returns reset authorization token
  const validOtp = '582910';
  const validOtpHash = crypto.createHash('sha256').update(validOtp).digest('hex');
  await User.updateOne(
    { email: studentEmail },
    {
      $set: {
        passwordResetOtpHash: validOtpHash,
        passwordResetOtpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        passwordResetOtpAttempts: 0,
      },
    }
  );
  const verifySuccessRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: validOtp },
  });
  record('Verify Success: Correct OTP is accepted, granting reset authorization token', verifySuccessRes.status === 200 && Boolean(verifySuccessRes.data.resetToken));
  const resetToken = verifySuccessRes.data.resetToken;

  // 11.13 Single-Use Enforcement: OTP cannot be reused after verification
  const reuseOtpRes = await request('/auth/verify-otp', {
    method: 'POST',
    body: { email: studentEmail, otp: validOtp },
  });
  record('Security: OTP cannot be reused after successful verification', reuseOtpRes.status === 400);

  // 11.14 Direct API bypass prevention: Calling reset-password without valid authorization fails
  const directBypassRes = await request('/auth/reset-password', {
    method: 'POST',
    body: { email: studentEmail, resetToken: 'forged-fake-token-xyz', password: 'BrandNewPass2026!', confirmPassword: 'BrandNewPass2026!' },
  });
  record('Security: Direct API calls cannot bypass OTP verification (HTTP 400)', directBypassRes.status === 400);

  // 11.15 Password Validation: Password mismatch
  const mismatchRes = await request('/auth/reset-password', {
    method: 'POST',
    body: { email: studentEmail, resetToken, password: 'BrandNewPass2026!', confirmPassword: 'DifferentPass2026!' },
  });
  record('Reset Validation: Password mismatch rejected with HTTP 400', mismatchRes.status === 400);

  // 11.16 Password Validation: Short password (<6 chars)
  const shortPassRes = await request('/auth/reset-password', {
    method: 'POST',
    body: { email: studentEmail, resetToken, password: '123', confirmPassword: '123' },
  });
  record('Reset Validation: Short password (<6 chars) rejected with HTTP 400', shortPassRes.status === 400);

  // 11.17 Successful Password Reset
  const resetSuccessRes = await request('/auth/reset-password', {
    method: 'POST',
    body: {
      email: studentEmail,
      resetToken,
      password: 'BrandNewStudentPassword2026!',
      confirmPassword: 'BrandNewStudentPassword2026!',
    },
  });
  record('Reset Success: Password successfully updated in database (HTTP 200)', resetSuccessRes.status === 200 && resetSuccessRes.data.success === true);

  // 11.18 Single-Use Authorization Token: Reusing resetToken must fail immediately
  const reuseTokenRes = await request('/auth/reset-password', {
    method: 'POST',
    body: {
      email: studentEmail,
      resetToken,
      password: 'AnotherPassword2026!',
      confirmPassword: 'AnotherPassword2026!',
    },
  });
  record('Token Invalidation: Reused reset authorization token immediately rejected with HTTP 400', reuseTokenRes.status === 400);

  // 11.19 Credential Security: Old password is no longer valid
  const oldLoginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: studentEmail, password: 'StudentSecurePass2026' },
  });
  record('Credential Security: Login with old password fails with HTTP 401', oldLoginRes.status === 401);

  // 11.20 Authentication: Login with new password succeeds
  const newLoginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: studentEmail, password: 'BrandNewStudentPassword2026!' },
  });
  record('Authentication: Login with new password succeeds with HTTP 200', newLoginRes.status === 200 && Boolean(newLoginRes.data.token));

  // 11.21 Data Preservation: Role and academic info intact
  const updatedStudent = newLoginRes.data.user;
  record('Data Preservation: User role remains "student" and roll number is intact', updatedStudent.role === 'student' && updatedStudent.rollNumber === rollNumber);

  // 11.22 Session Invalidation: Prior session revoked
  const staleSession = await request('/auth/me', {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  record('Session Invalidation: Pre-reset JWT session revoked with HTTP 401', staleSession.status === 401);

  // 11.23 SMTP Failure Safety: Handled safely without reporting false success
  const smtpFailRes = await request('/auth/forgot-password', {
    method: 'POST',
    headers: { 'x-simulate-smtp-failure': 'true' },
    body: { email: studentEmail },
  });
  record('SMTP Failure: Handled safely with HTTP 500 without claiming success', smtpFailRes.status === 500 && smtpFailRes.data.success === false);

  // 11.24 Abuse Protection: Repeated rapid requests trigger rate limiter (HTTP 429)
  let hitRateLimit = false;
  for (let i = 0; i < 8; i++) {
    const r = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rate-limit-test-key': 'otp-abuse-probe-test',
      },
      body: JSON.stringify({ email: 'rate.limit.probe@campus.edu' }),
    });
    if (r.status === 429) {
      hitRateLimit = true;
      break;
    }
  }
  record('Abuse Protection: Repeated rapid requests trigger rate limiter (HTTP 429)', hitRateLimit);

  // Close MongoDB connection from test script
  await mongoose.disconnect();

  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('===============================================================\n');

  return { passed, failed };
}

runIntegrationTests()
  .then((res) => {
    if (res.failed > 0) process.exit(1);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
