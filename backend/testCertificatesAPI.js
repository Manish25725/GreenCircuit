// Test the certificates API endpoint
const token = 'YOUR_TOKEN_HERE'; // Get this from localStorage 'token' in browser

const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/business/certificates?page=1&limit=3', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run this in browser console after replacing YOUR_TOKEN_HERE with your actual token
// testAPI();

console.log('To test:');
console.log('1. Open browser console (F12)');
console.log('2. Get token: localStorage.getItem("token")');
console.log('3. Replace YOUR_TOKEN_HERE with your token');
console.log('4. Run testAPI()');
