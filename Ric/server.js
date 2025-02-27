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
    console.log(req.body)
    if (!req.body.password) {
        return res.status(400).json({ error: "Password is required" });
    }
    let users = loadUsers();
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!req.body.password) {
            return res.status(400).json({ error: "Password is required" });
        }
        users.push({ name, email, password: hashedPassword });
        saveUsers(users);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' });
    }

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
    res.json({ name: user.name, email: user.email, profilePic:user.profilePic});
});

// Update profile picture
app.patch("/auth/updateProfilePic", (req, res) => {
    const { email, profilePic } = req.body;
    let users = loadUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update profile picture in the user's data
    users[userIndex].profilePic = profilePic;
    saveUsers(users);

    res.json({ message: "Profile picture updated successfully!", profilePic });
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
