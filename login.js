// Elements
const form = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const submitBtn = document.getElementById('submitBtn');
const extraField = document.getElementById('extraField');
const message = document.getElementById('message');

let isLogin = true; // tracks mode

// Switch between Login and Register
function toggleMode(e) {
    if (e) e.preventDefault();
    
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleLink">Register here</a>';
        extraField.classList.add('hidden');
        clearMessage();
    } else {
        formTitle.textContent = 'Register';
        submitBtn.textContent = 'Register';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Login here</a>';
        extraField.classList.remove('hidden');
        clearMessage();
    }

    // Reattach event listener to the new link
    document.getElementById('toggleLink').addEventListener('click', toggleMode);
}

// Clear message display
function clearMessage() {
    message.textContent = '';
    message.className = '';
}

// Display message with appropriate styling
function showMessage(text, isError = true) {
    message.textContent = text;
    message.className = isError ? 'message-error' : 'message-success';
}

// Handle form submission
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        showMessage('Please fill in all fields.');
        return;
    }

    if (isLogin) {
        // LOGIN
        const storedUser = JSON.parse(localStorage.getItem('neosUser'));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            localStorage.setItem('neosLoggedIn', 'true');
            showMessage('Login successful! Redirecting...', false);
            setTimeout(() => {
                // Only redirect after successful login
                window.location.href = 'neos.html';
            }, 1000);
        } else {
            showMessage('Invalid email or password.');
        }
    } else {
        // REGISTER
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }
        
        // Basic password strength check
        if (password.length < 6) {
            showMessage('Password should be at least 6 characters long.');
            return;
        }
        
        const newUser = { email, password };
        localStorage.setItem('neosUser', JSON.stringify(newUser));
        showMessage('Registration successful! You can now log in.', false);
        
        // Auto-switch to login mode after a delay
        setTimeout(() => {
            toggleMode();
        }, 1500);
    }
});

// Toggle password visibility
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('toggle-password')) {
        const inputId = e.target.dataset.target;
        const input = document.getElementById(inputId);
        
        if (input.type === 'password') {
            input.type = 'text';
            e.target.textContent = '🙈';
        } else {
            input.type = 'password';
            e.target.textContent = '👁️';
        }
    }
});

// Attach initial event listener
toggleLink.addEventListener('click', toggleMode);

// REMOVED the automatic redirect check - user must always login/register