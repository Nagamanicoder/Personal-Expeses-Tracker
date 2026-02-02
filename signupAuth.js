document.getElementById('signup-submit').addEventListener('click', (e) => {
    e.preventDefault()
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    // Validate inputs
    if (!validateSignup(name, email, password, confirmPassword)) {
        document.getElementById('signup-form').reset()
        return;
    }

    // Use email as userId
    const userId = email;

    // Create user object
    const user = {
        userId: userId,
        name: name,
        email: email,
        password: password, // In production, hash this on backend!
        createdAt: new Date().toISOString()
    };

    // Save user to localStorage
    saveUser(user);

    // Store current logged-in user
    sessionStorage.setItem('currentUserId', userId);

    alert('Account created successfully!');
    // console.log('User registered:', userId);

    // Redirect to expense tracker
    window.location.href = 'expenseTrackerPage.html';
});

function validateSignup(name, email, password, confirmPassword) {
    // Validate name
    if (!name || name.length < 2) {
        alert('Name must be at least 2 characters long.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Check if email already exists
    if (userExists(email)) {
        alert('This email is already registered. Please login or use a different email.');
        return false;
    }

    // Validate password length
    if (!password || password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return false;
    }

    return true;
}

function userExists(email) {
    const allUsers = sessionStorage.getItem('expenseTracker.users') || '{}';
    const users = JSON.parse(allUsers);
    return users.hasOwnProperty(email);
}

function saveUser(user) {
    const allUsers = sessionStorage.getItem('expenseTracker.users') || '{}';
    const users = JSON.parse(allUsers);
    users[user.email] = {
        // name: user.name, //when database connection happens, then put all information into the database
        email: user.email,
        password: user.password, // In production, hash this!
        // createdAt: user.createdAt
    };
    sessionStorage.setItem('expenseTracker.users', JSON.stringify(users));
    console.log('User saved to localStorage');
}