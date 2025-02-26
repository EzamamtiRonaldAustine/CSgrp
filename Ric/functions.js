const fs = require('fs');
const bcrypt = require('bcrypt');

const usersFile = 'users.json';

// Load users from the JSON file
function loadUsers() {
    if (!fs.existsSync(usersFile)) {
        // If file doesn't exist, create it with an empty array
        fs.writeFileSync(usersFile, JSON.stringify([]));
    }
    
    try {
        // Reading and parsing the file
        const data = fs.readFileSync(usersFile, 'utf8');
        return data ? JSON.parse(data) : []; // Return empty array if file is empty
    } catch (error) {
        console.error("Error reading users file:", error);
        return []; // Return empty array
    }
}

// Save users to the JSON file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

module.exports = { loadUsers, saveUsers };
