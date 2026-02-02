document.getElementById('login-submit').addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validate inputs
    if (!validateLogin(email, password)) {
        return;
    }

    // Verify user credentials
    if (!authenticateUser(email, password)) {
        alert('Invalid email or password. Please try again.');
        return;
    }

    // Use email as userId
    const userId = email;

    // Store current logged-in user
    sessionStorage.setItem('currentUserId', userId);

    alert('Login successful!');
    console.log('User logged in:', userId);

    // Redirect to expense tracker
    window.location.href = 'expenseTrackerPage.html';
});

function validateLogin(email, password) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Validate password not empty
    if (!password || password.length === 0) {
        alert('Please enter your password.');
        return false;
    }

    return true;
}

function authenticateUser(email, password) {
    // Retrieve all users from localStorage
    const allUsers = sessionStorage.getItem('expenseTracker.users') || '{}';
    const users = JSON.parse(allUsers);

    // Check if user exists
    if (!users.hasOwnProperty(email)) {
        return false;
    }

    // Verify password matches
    const user = users[email];
    return user.password === password;
}
