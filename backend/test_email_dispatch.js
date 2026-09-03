import axios from 'axios';

async function testEmailDispatch() {
  const BASE_URL = 'https://pcte-travel-agency.onrender.com';

  console.log('--- 1. Testing Student Tour Registration Email API (POST /api/enquiries) ---');
  try {
    const enquiryRes = await axios.post(`${BASE_URL}/api/enquiries`, {
      studentName: 'Test Student Rahul',
      rollNumber: 'PCTE-2024-8899',
      email: 'rahul.test@gmail.com',
      phone: '+91 98765 43210',
      course: 'B.Tech CSE Semester 5',
      packageTitle: 'Mussoorie – Kempty Water Fall',
      destination: 'Mussoorie, Uttarakhand',
      requestType: 'Booking Request',
      tourDuration: '11 Sep – 13 September (2 Nights / 3 Days)',
      tourPrice: 'INR 3800',
      notes: 'Please allocate window seats for 2 friends.',
    });
    console.log('✅ Enquiry API Result:', enquiryRes.data);
  } catch (e) {
    console.error('❌ Enquiry API Error:', e.response?.data || e.message);
  }

  console.log('\n--- 2. Testing Contact / Student Question Email API (POST /api/support) ---');
  try {
    const questionRes = await axios.post(`${BASE_URL}/api/support`, {
      name: 'Simran Kaur',
      email: 'simran.kaur@gmail.com',
      phone: '+91 99881 22334',
      subject: 'Is food included during the bus journey to Mussoorie?',
      message: 'Hi team, I would like to know if breakfast and lunch during the bus travel from Punjab to Mussoorie are included in the package fee?',
    });
    console.log('✅ Question/Support API Result:', questionRes.data);
  } catch (e) {
    console.error('❌ Question/Support API Error:', e.response?.data || e.message);
  }
}

testEmailDispatch();
