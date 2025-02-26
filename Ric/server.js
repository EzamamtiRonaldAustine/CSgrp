const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Load users from JSON file
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
