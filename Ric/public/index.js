// Handle login form submission
// Validates and submits login credentials to the server
// Stores user data in localStorage on successful login
function emailfetcher(){


    const loginForm = document.getElementById('loginForm');
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', JSON.stringify(result));
            window.location.href = '/profile.html';
        } else {
            alert(result.message || 'Login failed');
        }

    };

}

// Handle registration form submission
// Validates and submits new user registration data
// Stores user data in localStorage on successful registration
function registering(){


    const registerForm = document.getElementById('registerForm');
        registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);

        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', JSON.stringify(result));
            alert('Registration successful! Redirecting to login...');
            window.location.href = '/'; 
        } else {
            alert(result.message || 'Registration failed');
        }
    };
}

// Load and display user profile data on page load
// Retrieves user data from server using stored email
// Updates profile information display


function profileOnload() {
    const userEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;

    if (userEmail) {
        // Fetch user data from server
        fetch(`/auth/profile?email=${encodeURIComponent(userEmail)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                return response.json();
            })
            .then(user => {
                document.getElementById('profileName').innerText = `Name: ${user.name}`;
                document.getElementById('profileEmail').innerText = `Email: ${user.email}`;
                
                // Fixing incorrect property access
                if (user.profilePic) {
                    document.getElementById('profilePic').src = user.profilePic;
                }
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                window.location.href = '/';
            });
    } else {
        // Redirect to login page if no email is found
        window.location.href = '/';
    }
}

    // Handle profile picture upload and update
    // Processes image file upload and updates profile picture
    // Stores image in localStorage and updates server


async function uploadProfilePic() {
    const fileInput = document.getElementById('uploadPic');
    const file = fileInput.files[0];
    
    const userEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;

    if (!userEmail) {
        alert("No user is logged in.");
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = async function (event) {
            const imageUrl = event.target.result;

            // Save image to localStorage
            localStorage.setItem('profilePic_' + userEmail, imageUrl);

            // Update profile picture display
            document.getElementById('profilePic').src = imageUrl;

            // Send profile picture update to the server
            try {
                const response = await fetch("/auth/updateProfilePic", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        profilePic: imageUrl
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                } else {
                    alert("Error: " + data.message);
                }
            } catch (error) {
                console.error("Error updating profile picture:", error);
                alert("An error occurred while updating the profile picture.");
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert("Please select an image to upload.");
    }
}


        // Logout user and clear session data
        // Removes user data from localStorage and redirects to login page
        function logout() {


            localStorage.removeItem('currentUser');
            window.location.href = '/';
            alert('You have been logged out');
        }

        // Exit application with confirmation
        // Shows confirmation message and redirects to login page
        function exit() {


            alert('Thank you for using our service!');
            window.location.href = '/';
            
        }
