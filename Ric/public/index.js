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

// Retrieve user email from localStorage
function profileOnload(){
    const userEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;

        if (userEmail) {
            // Fetch user data from server
            fetch(`/auth/profile?email=${encodeURIComponent(userEmail)}`)
                .then(response => response.json())
                .then(user => {
                    document.getElementById('profileName').innerText = `Name: ${user.name}`;
                    document.getElementById('profileEmail').innerText = `Email: ${user.email}`;

                    // Load stored profile picture if available
                    const storedPic = localStorage.getItem('profilePic_' + user.email);
                    if (storedPic) {
                        document.getElementById('profilePic').src = storedPic;
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
    // Function to upload profile picture
    function uploadProfilePic() {
        const fileInput = document.getElementById('uploadPic');
        const file = fileInput.files[0];
        
        const userEmail=JSON.parse(localStorage.getItem('currentUser'))?.email;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;

                // Save image to localStorage
                localStorage.setItem('profilePic_' + userEmail, imageUrl);

                // Update profile picture display
                document.getElementById('profilePic').src = imageUrl;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image to upload.');
        }
    }

        function logout() {
            localStorage.removeItem('currentUser');
            window.location.href = '/';
            alert('You have been logged out');
        }

        function exit() {
            alert('Thank you for using our service!');
            window.location.href = '/';
            
        }