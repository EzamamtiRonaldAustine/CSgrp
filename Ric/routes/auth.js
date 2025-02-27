// server.js (Backend - Node.js & Express)
// Main dependencies and imports
const express = require('express'); // Web framework
const fs = require('fs'); // File system operations
const bcrypt = require('bcrypt'); // Password hashing
const path = require('path'); // Path utilities
const cors = require('cors'); // Cross-origin resource sharing


// Initialize Express app and configure constants
const app = express(); // Create Express application
const PORT = 3000; // Server port
const USERS_FILE = path.join(__dirname, 'users.json'); // Path to users data file


// Middleware setup
app.use(express.json()); // Parse JSON request bodies

// Enable CORS and serve static files
app.use(cors()); // Allow cross-origin requests
app.use(express.static('public')); // Serve static files from 'public' directory


// Load users from JSON file
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return []; // Return empty array if file doesn't exist
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); // Parse and return user data
}


// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); // Write formatted JSON to file
}


// Register Endpoint
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    let users = loadUsers();
    
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, email, password: hashedPassword });
    saveUsers(users);
    res.json({ message: 'User registered successfully' });
});

// Login Endpoint
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    let users = loadUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ name: user.name, email: user.email });
});

// Profile Endpoint
app.get('/auth/profile', (req, res) => {
    const email = req.query.email;
    let users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name, email: user.email });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
