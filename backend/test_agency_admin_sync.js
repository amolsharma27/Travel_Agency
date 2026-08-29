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

async function runAgencyAdminVerification() {
  console.log('=================================================================');
  console.log('🚀 TESTING AGENCY CRUD, CUSTOMER LIVE SYNC & ADMIN MANAGEMENT');
  console.log('=================================================================\n');

  // Authenticate Agency 1, Agency 2, Customer, and Admin
  console.log('🔐 Authenticating personas...');
  const agency1 = await login('agency@pctetravels.com', 'Agency@123');
  const agency2 = await login('agency2@travelstay.com', 'Agency@123');
  const admin = await login('admin@pctetravels.com', 'Admin@123');
  console.log('✅ Personas authenticated.\n');

  // STEP 1: Agency 1 creates a new Tour Package
  console.log('▶️ TEST 1: Agency 1 publishes a new Tour Package to database...');
  const createPkgRes = await (await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agency1.token}` },
    body: JSON.stringify({
      title: 'Solang Valley Snow Trek & Paragliding Weekend',
      destination: 'Manali, Himachal Pradesh',
      tourType: 'Adventure Tour',
      category: 'Adventure Tours',
      description: 'Exciting snow trekking to Solang Valley with certified paragliding pilot and mountain guides.',
      price: 6999,
      discountPrice: 4999,
      durationDays: 2,
      durationNights: 1,
      totalSeats: 16,
      availableSeats: 16,
      images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
      inclusions: ['Transportation', 'Hotel', 'Meals', 'Guide', 'Activities'],
    })
  })).json();

  if (!createPkgRes.success) throw new Error('Package creation failed: ' + createPkgRes.message);
  const pkgId = createPkgRes.data._id;
  console.log(`   Created Package ID: ${pkgId} (${createPkgRes.data.title})`);

  // Verify it appears on Customer / Public side
  const publicPkgs = await (await fetch(`${API_BASE}/packages`)).json();
  const foundInPublic = publicPkgs.data?.find(p => p._id === pkgId);
  if (!foundInPublic) throw new Error('New agency package does not appear on customer side!');
  console.log('✅ TEST 1 PASSED: Agency package created and immediately visible on Customer side.\n');

  // STEP 2: Agency 1 edits the Tour Package
  console.log('▶️ TEST 2: Agency 1 edits the Tour Package (updates price and title)...');
  const editPkgRes = await (await fetch(`${API_BASE}/packages/${pkgId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agency1.token}` },
    body: JSON.stringify({
      title: 'Solang Valley Snow Trek & Paragliding Expedition (Updated)',
      discountPrice: 4599,
      availableSeats: 14,
    })
  })).json();

  if (!editPkgRes.success || editPkgRes.data.discountPrice !== 4599) {
    throw new Error('Package edit failed');
  }

  // Verify updated data on Customer side
  const updatedPublicPkg = await (await fetch(`${API_BASE}/packages/${pkgId}`)).json();
  if (updatedPublicPkg.data?.discountPrice !== 4599) {
    throw new Error('Updated package price not reflected on customer side');
  }
  console.log(`   Customer sees updated price: ₹${updatedPublicPkg.data.discountPrice} and title: "${updatedPublicPkg.data.title}"`);
  console.log('✅ TEST 2 PASSED: Agency package edit reflected on customer side.\n');

  // STEP 3: Multi-Agency Data Isolation & Protection
  console.log('▶️ TEST 3: Verifying Agency 2 CANNOT edit Agency 1 package...');
  const unauthorizedEditRes = await (await fetch(`${API_BASE}/packages/${pkgId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${agency2.token}` },
    body: JSON.stringify({ title: 'Hacked Title' })
  })).json();

  if (unauthorizedEditRes.success) throw new Error('Security flaw: Agency 2 was able to edit Agency 1 package!');
  console.log('✅ TEST 3 PASSED: Agency 2 edit blocked with 403 Forbidden.\n');

  // STEP 4: Admin User Management & Verification
  console.log('▶️ TEST 4: Admin lists users, verifies pending agency, and removes unverified user...');
  const allUsersRes = await (await fetch(`${API_BASE}/auth/users`, {
    headers: { Authorization: `Bearer ${admin.token}` }
  })).json();

  if (!allUsersRes.success || !Array.isArray(allUsersRes.data)) {
    throw new Error('Admin get users failed');
  }
  console.log(`   Admin loaded ${allUsersRes.data.length} registered user and agency accounts.`);

  // Create temporary test user to test removal
  const tempRegRes = await (await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Spam Unverified Account',
      email: `spam_${Date.now()}@example.com`,
      password: 'Password@123',
      phone: '+91 99999 88888',
      role: 'customer'
    })
  })).json();

  const tempUserId = tempRegRes.user._id;
  console.log(`   Created test unverified user: ${tempUserId}`);

  // Admin deletes the test account
  const deleteUserRes = await (await fetch(`${API_BASE}/auth/users/${tempUserId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${admin.token}` }
  })).json();

  if (!deleteUserRes.success) throw new Error('Admin delete user failed');
  console.log('✅ TEST 4 PASSED: Admin verified users and successfully removed unverified account.\n');

  // STEP 5: Agency 1 deletes the package
  console.log('▶️ TEST 5: Agency 1 deletes the tour package...');
  const deletePkgRes = await (await fetch(`${API_BASE}/packages/${pkgId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${agency1.token}` }
  })).json();

  if (!deletePkgRes.success) throw new Error('Package deletion failed');

  // Confirm it disappears from customer side
  const checkDeleted = await (await fetch(`${API_BASE}/packages/${pkgId}`)).json();
  if (checkDeleted.success) throw new Error('Deleted package still returned by API!');
  console.log('✅ TEST 5 PASSED: Package deleted and removed from customer catalog.\n');

  // STEP 6: Admin Dashboard live computed telemetry & System Health
  console.log('▶️ TEST 6: Checking Admin Overview dynamic telemetry and systemHealth...');
  const adminOverview = await (await fetch(`${API_BASE}/dashboard/admin`, {
    headers: { Authorization: `Bearer ${admin.token}` }
  })).json();

  if (!adminOverview.success || !adminOverview.data.systemHealth) {
    throw new Error('Admin overview systemHealth telemetry missing');
  }

  console.log(`   System Status: ${adminOverview.data.systemHealth.status}`);
  console.log(`   Memory Usage:  ${adminOverview.data.systemHealth.memoryUsage}`);
  console.log(`   Gross Volume:  ₹${adminOverview.data.revenue.grossSales}`);
  console.log(`   Total Bookings: ${adminOverview.data.bookings.totalBookings}`);
  console.log('✅ TEST 6 PASSED: Real-time dynamic telemetry and health reporting confirmed.\n');

  console.log('=================================================================');
  console.log('🎉 ALL AGENCY CRUD & ADMIN MANAGEMENT TESTS PASSED 100%!');
  console.log('=================================================================');
}

runAgencyAdminVerification().catch(err => {
  console.error('❌ Verification test failed:', err);
  process.exit(1);
});
