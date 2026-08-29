import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(`Login failed for ${email}: ${data.message}`);
  return { token: data.token, user: data.user };
}

async function runFeatureTests() {
  console.log('=====================================================');
  console.log('🚀 TESTING NEW TRAVEL AGENCY DYNAMIC FEATURES');
  console.log('=====================================================\n');

  // Authenticate personas
  console.log('🔐 Authenticating Customer, Agency, and Admin...');
  const customer = await login('customer@pctetravels.com', 'Customer@123');
  const agency = await login('agency@pctetravels.com', 'Agency@123');
  const admin = await login('admin@pctetravels.com', 'Admin@123');
  console.log('✅ Personas authenticated.\n');

  // 1. Test Passport Assistance Request
  console.log('▶️ TEST 1: Customer submits Passport Assistance Request...');
  const passRes = await (await fetch(`${API_BASE}/passport/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customer.token}` },
    body: JSON.stringify({
      serviceTitle: 'Tatkaal Express Passport Assistance',
      applicantName: 'Rohit Sharma',
      dob: '1998-05-27',
      contactPhone: '+91 98765 43210',
      contactEmail: 'customer@pctetravels.com',
      preferredPSK: 'PSK Ludhiana (Model Town)',
      govtFee: 3500,
      agencyFee: 899,
      totalAmount: 4399,
    })
  })).json();

  if (!passRes.success) throw new Error('Passport request submission failed: ' + passRes.message);
  console.log(`   Passport tracking generated: ${passRes.data?.id}`);

  // Admin lists passport requests
  const adminPassRes = await (await fetch(`${API_BASE}/passport/requests`, {
    headers: { Authorization: `Bearer ${admin.token}` }
  })).json();

  const foundDossier = adminPassRes.data?.find(d => d.id === passRes.data?.id);
  if (!foundDossier) throw new Error('Passport dossier did not reflect in Admin Passport desk!');
  console.log('✅ TEST 1 PASSED: Passport assistance submitted and verified in Admin Desk.\n');

  // 2. Test Customer Support Desk & Admin Response
  console.log('▶️ TEST 2: Customer creates Support Ticket & Admin responds...');
  const supportRes = await (await fetch(`${API_BASE}/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customer.token}` },
    body: JSON.stringify({
      name: customer.user.name,
      email: customer.user.email,
      subject: '[Booking Amendment] Change departure pickup to Majnu Ka Tila Gate 2',
      message: 'Kindly update boarding spot from Tribune Chowk to Majnu Ka Tila Gate 2 for 2 passengers.',
    })
  })).json();

  if (!supportRes.success) throw new Error('Support ticket creation failed: ' + supportRes.message);
  const ticketId = supportRes.data._id;
  console.log(`   Created Support Ticket ID: ${ticketId}`);

  // Admin responds to support ticket
  const replyRes = await (await fetch(`${API_BASE}/support/${ticketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.token}` },
    body: JSON.stringify({
      status: 'resolved',
      adminReply: 'Pickup spot updated to Majnu Ka Tila Gate 2. Driver contact will be shared 4 hours prior.',
    })
  })).json();

  if (!replyRes.success || replyRes.data.status !== 'resolved') {
    throw new Error('Admin support reply failed');
  }

  // Customer fetches own tickets
  const mySupport = await (await fetch(`${API_BASE}/support/my`, {
    headers: { Authorization: `Bearer ${customer.token}` }
  })).json();

  const myTkt = mySupport.data?.find(t => t._id === ticketId);
  if (!myTkt || myTkt.status !== 'resolved' || !myTkt.adminReply) {
    throw new Error('Customer did not receive real-time admin resolution reply!');
  }
  console.log(`   Verified Customer received resolution: "${myTkt.adminReply}"`);
  console.log('✅ TEST 2 PASSED: Customer support and Admin resolution cycle verified.\n');

  // 3. Test Customer Profile Update Persistence
  console.log('▶️ TEST 3: Customer updates profile with passport and Aadhaar...');
  const updateProfRes = await (await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customer.token}` },
    body: JSON.stringify({
      name: 'Rohit Sharma (Verified Traveler)',
      city: 'Ludhiana',
      state: 'Punjab',
      passportNumber: 'Z8923412',
      passportExpiry: '2032-11-15',
      aadhaarLast4: '8821',
      emergencyContact: { name: 'Vikram Sharma', relationship: 'Brother', phone: '+91 98765 11223' },
    })
  })).json();

  if (!updateProfRes.success || updateProfRes.user?.passportNumber !== 'Z8923412') {
    throw new Error('Customer profile persistence failed in database');
  }
  console.log('✅ TEST 3 PASSED: Customer profile fields persisted to MongoDB.\n');

  // 4. Test Services Endpoints (Activities, Transportation, Getaways)
  console.log('▶️ TEST 4: Fetching Public Activities, Transportation & Nearby Getaways...');
  const [actRes, transRes, getRes] = await Promise.all([
    fetch(`${API_BASE}/activities`).then(r => r.json()),
    fetch(`${API_BASE}/transportation`).then(r => r.json()),
    fetch(`${API_BASE}/getaways`).then(r => r.json()),
  ]);

  if (!actRes.success || actRes.data.length === 0) throw new Error('Activities endpoint returned empty data');
  if (!transRes.success || !transRes.data.flights) throw new Error('Transportation endpoint returned empty data');
  if (!getRes.success || getRes.data.length === 0) throw new Error('Getaways endpoint returned empty data');

  console.log(`   Activities loaded: ${actRes.data.length}, Getaways loaded: ${getRes.data.length}`);
  console.log('✅ TEST 4 PASSED: Public travel catalogs are fully dynamic.\n');

  console.log('=====================================================');
  console.log('🎉 ALL FEATURE TESTS PASSED 100% SUCCESSFULLY!');
  console.log('=====================================================');
}

runFeatureTests().catch(err => {
  console.error('❌ Feature test error:', err);
  process.exit(1);
});
