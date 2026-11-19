/**
 * Statutory Enterprise & Compliance Automated Test Suite
 * Tests dynamic company settings, public sanitization, GSTIN/CIN regex validation,
 * Trade Marks Act (R) symbol safeguards, DPDP Act consent enforcement, and Grievance ticket generation.
 */

import dns from 'dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config({ path: './server/.env' });

import SiteSettings from '../models/SiteSettings.js';
import User from '../models/User.js';
import SettingsAuditLog from '../models/SettingsAuditLog.js';
import GrievanceRequest from '../models/GrievanceRequest.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

const API_BASE = 'http://127.0.0.1:5001/api';

async function runTests() {
  console.log('🧪 Starting Statutory Settings & Legal Compliance Test Suite...\n');
  await mongoose.connect(process.env.MONGO_URI);

  // Find or create admin user for testing
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = await User.create({
      name: 'Admin Test Desk',
      email: 'admin-statutory-test@demoinfotech.in',
      password: 'password123',
      role: 'admin',
      company_name: 'Demo Infotech'
    });
  }

  // Create customer user for authorization testing
  let customer = await User.findOne({ role: 'customer' });
  if (!customer) {
    customer = await User.create({
      name: 'Customer Test',
      email: 'customer-test@example.com',
      password: 'password123',
      role: 'customer',
      company_name: 'Client Corp'
    });
  }

  const adminToken = jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET || 'technova_enterprise_secret_2026',
    { expiresIn: '1h' }
  );

  const customerToken = jwt.sign(
    { id: customer._id, email: customer.email, role: customer.role },
    process.env.JWT_SECRET || 'technova_enterprise_secret_2026',
    { expiresIn: '1h' }
  );

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Public Settings Endpoint & Sanitization
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Public Settings Security & Sanitization ---');
  try {
    const res = await fetch(`${API_BASE}/settings/public`);
    const data = await res.json();

    assert(res.status === 200, 'GET /api/settings/public returns HTTP 200');
    assert(data.success === true, 'Public settings response success flag is true');
    assert(data.settings?.brand_name === 'Demo Infotech', `Brand name is "${data.settings?.brand_name}" (Defaults to Demo Infotech)`);
    assert(data.settings?.bank_details === undefined, 'Bank details are strictly EXCLUDED from public settings (Protected against leaks)');
    assert(data.settings?.signature_url === undefined, 'Manager signature URL is EXCLUDED from public settings');
    assert(data.settings?.company_seal_url === undefined, 'Company seal URL is EXCLUDED from public settings');
    assert(data.settings?.grievance_officer?.email !== undefined, 'Statutory Grievance Officer email is provided publicly');
  } catch (err) {
    assert(false, `Test Suite 1 exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: Role Authorization on Admin Settings
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Role-Based Authorization Guards ---');
  try {
    const unauthRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_name: 'Hacked Brand' })
    });
    assert(unauthRes.status === 401, 'Unauthenticated PUT /api/settings is blocked with HTTP 401');

    const customerRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ brand_name: 'Customer Brand' })
    });
    assert(customerRes.status === 403, 'Customer role PUT /api/settings is forbidden with HTTP 403');
  } catch (err) {
    assert(false, `Test Suite 2 exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: Statutory Indian Law Input Validations (GSTIN, CIN, (R))
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Statutory Validations (GSTIN, CIN, Trade Marks Act) ---');
  try {
    // 3a: Invalid GSTIN regex
    const invalidGstRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ gst_number: '123INVALID' })
    });
    const invalidGstData = await invalidGstRes.json();
    assert(invalidGstRes.status === 400, 'Invalid GSTIN format rejected with HTTP 400');
    assert(invalidGstData.message.includes('15 alphanumeric characters'), `GSTIN validation error explains requirement: "${invalidGstData.message}"`);

    // 3b: Invalid CIN regex
    const invalidCinRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ cin_number: 'NOT_A_CIN' })
    });
    const invalidCinData = await invalidCinRes.json();
    assert(invalidCinRes.status === 400, 'Invalid CIN format rejected with HTTP 400');

    // 3c: Trademark (R) symbol without confirmation checkbox
    const tmViolationRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tm_symbol: 'R', is_tm_registered_confirmed: false })
    });
    const tmViolationData = await tmViolationRes.json();
    assert(tmViolationRes.status === 400, 'Trade Marks Act Section 107 safeguard blocks unconfirmed (R) symbol');
  } catch (err) {
    assert(false, `Test Suite 3 exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: DPDP Act Newsletter Consent Enforcement
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: DPDP Act Newsletter Consent Enforcement ---');
  try {
    const noConsentRes = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'noconsent@example.com', consent_given: false })
    });
    const noConsentData = await noConsentRes.json();
    assert(noConsentRes.status === 400, 'Subscription without affirmative consent rejected with HTTP 400');
    assert(noConsentData.message.includes('mandatory under the DPDP Act 2023'), 'Error message cites statutory consent requirement');

    const validConsentRes = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'compliant@clientcorp.in', consent_given: true, source: 'audit_test' })
    });
    const validConsentData = await validConsentRes.json();
    assert(validConsentRes.status === 201 || validConsentRes.status === 200, 'Valid subscription with consent succeeds');

    // Verify record in MongoDB with timestamp and consent audit
    const subRecord = await NewsletterSubscriber.findOne({ email: 'compliant@clientcorp.in' });
    assert(subRecord?.consent_given === true, 'Subscriber record in MongoDB verifies consent_given: true');
    assert(subRecord?.consent_timestamp !== undefined, 'Subscriber record contains statutory consent timestamp');
  } catch (err) {
    assert(false, `Test Suite 4 exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 5: Statutory Grievance Redressal Ticket Generation
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Grievance Redressal & Ticket Generation ---');
  try {
    const grievanceRes = await fetch(`${API_BASE}/grievance/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aman Chopra',
        email: 'aman@enterprisepartners.com',
        phone: '+91 98100 11111',
        company_name: 'Enterprise Partners LLP',
        request_type: 'data_erasure',
        description: 'Statutory request under DPDP Act 2023 Section 12 to purge historical marketing contact records.'
      })
    });
    const grievanceData = await grievanceRes.json();
    assert(grievanceRes.status === 201, 'Grievance submission succeeds with HTTP 201');
    assert(grievanceData.ticket_number?.startsWith('GRV-'), `Generated official ticket number: "${grievanceData.ticket_number}"`);
    assert(grievanceData.statutory_timeline?.acknowledgement_window === 'Within 24 hours', 'Turnaround acknowledgement window is 24 hours');
    assert(grievanceData.statutory_timeline?.resolution_deadline === 'Within 30 days', 'Turnaround resolution deadline is 30 days');

    const grvDoc = await GrievanceRequest.findOne({ ticket_number: grievanceData.ticket_number });
    assert(grvDoc?.status === 'acknowledged', 'Grievance status is acknowledged in database');
    assert(grvDoc?.resolution_deadline !== undefined, 'Statutory 30-day deadline date is computed in database');
  } catch (err) {
    assert(false, `Test Suite 5 exception: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 6: Admin Dynamic Settings Update & One-Click Revert
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 6: Dynamic Brand Mutation & Audit Revert ---');
  try {
    const originalSettings = await SiteSettings.findOne();
    const originalBrand = originalSettings.brand_name;

    // Mutate brand name via Admin PUT
    const updateRes = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        brand_name: 'TestCorp Technologies',
        tagline: 'Verified High-Performance Computing Fleets'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Admin successfully mutated brand name via PUT /api/settings');

    // Verify cache invalidation & public endpoint reflects change immediately
    const publicAfterUpdate = await fetch(`${API_BASE}/settings/public`).then((r) => r.json());
    assert(publicAfterUpdate.settings.brand_name === 'TestCorp Technologies', 'Public endpoint immediately reflects mutated brand without redeploy');

    // Revert back using the audit log
    const latestAudit = await SettingsAuditLog.findOne().sort({ createdAt: -1 });
    assert(latestAudit !== null, 'Settings audit log snapshot created');

    const revertRes = await fetch(`${API_BASE}/settings/revert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ log_id: latestAudit._id })
    });
    const revertData = await revertRes.json();
    assert(revertRes.status === 200, 'One-click revert endpoint succeeds with HTTP 200');

    // Verify restored state
    const publicAfterRevert = await fetch(`${API_BASE}/settings/public`).then((r) => r.json());
    assert(publicAfterRevert.settings.brand_name === originalBrand, `Brand name successfully restored to "${originalBrand}"`);
  } catch (err) {
    assert(false, `Test Suite 6 exception: ${err.message}`);
  }

  console.log('\n======================================================');
  console.log(`🏁 Test Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});
