// Elements
const form = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const toggleText = document.getElementById('toggleText');
const toggleLink = document.getElementById('toggleLink');
const submitBtn = document.getElementById('submitBtn');
const extraField = document.getElementById('extraField');
const message = document.getElementById('message');
const passwordStrength = document.getElementById('passwordStrength');
const confirmMessage = document.getElementById('confirmMessage');

let isLogin = true; // tracks mode

// Password requirements checker
const passwordRequirements = {
    length: { regex: /.{8,}/, message: 'At least 8 characters' },
    lowercase: { regex: /[a-z]/, message: 'One lowercase letter' },
    uppercase: { regex: /[A-Z]/, message: 'One uppercase letter' },
    number: { regex: /[0-9]/, message: 'One number' },
    special: { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' }
};

// Switch between Login and Register
function toggleMode(e) {
    if (e) e.preventDefault();
    
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Login';
        submitBtn.textContent = 'Login';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleLink">Register here</a>';
        extraField.classList.add('hidden');
        passwordStrength.classList.add('hidden');
        clearMessage();
        enableSubmitButton();
    } else {
        formTitle.textContent = 'Register';
        submitBtn.textContent = 'Register';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Login here</a>';
        extraField.classList.remove('hidden');
        passwordStrength.classList.remove('hidden');
        clearMessage();
        checkPasswordStrength(); // Check initial state
        checkPasswordMatch(); // Check initial match state
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

// Enable/disable submit button based on password strength
function enableSubmitButton() {
    submitBtn.disabled = false;
}

function disableSubmitButton() {
    submitBtn.disabled = true;
}

// Check password strength and update UI
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.querySelector('.strength-bar');
    const requirements = document.querySelectorAll('.requirement');
    
    let score = 0;
    let totalRequirements = Object.keys(passwordRequirements).length;
    
    // Check each requirement
    Object.keys(passwordRequirements).forEach((key, index) => {
        const requirement = requirements[index];
        const isMet = passwordRequirements[key].regex.test(password);
        
        if (isMet) {
            requirement.classList.add('met');
            requirement.classList.remove('unmet');
            score++;
        } else {
            requirement.classList.add('unmet');
            requirement.classList.remove('met');
        }
    });
    
    // Update strength meter
    strengthBar.className = 'strength-bar';
    if (password.length === 0) {
        strengthBar.style.width = '0%';
    } else if (score === 0) {
        strengthBar.classList.add('strength-weak');
    } else if (score <= 2) {
        strengthBar.classList.add('strength-weak');
    } else if (score <= 3) {
        strengthBar.classList.add('strength-fair');
    } else if (score <= 4) {
        strengthBar.classList.add('strength-good');
    } else {
        strengthBar.classList.add('strength-strong');
    }
    
    // Enable/disable submit button based on password strength
    if (!isLogin) {
        if (score >= 3 && password.length >= 8) {
            enableSubmitButton();
        } else {
            disableSubmitButton();
        }
    }
}

// Check if passwords match
function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!isLogin) {
        if (confirmPassword.length === 0) {
            confirmMessage.classList.add('hidden');
        } else if (password === confirmPassword) {
            confirmMessage.textContent = 'Passwords match!';
            confirmMessage.className = 'confirm-message confirm-match';
            confirmMessage.classList.remove('hidden');
        } else {
            confirmMessage.textContent = 'Passwords do not match!';
            confirmMessage.className = 'confirm-message confirm-mismatch';
            confirmMessage.classList.remove('hidden');
        }
    }
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
                window.location.href = 'neos.html';
            }, 1000);
        } else {
            showMessage('Invalid email or password.');
        }
    } else {
        // REGISTER - Enhanced password validation
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Check password strength
        let strengthScore = 0;
        Object.keys(passwordRequirements).forEach(key => {
            if (passwordRequirements[key].regex.test(password)) {
                strengthScore++;
            }
        });
        
        if (strengthScore < 3) {
            showMessage('Please create a stronger password. Your password should meet at least 3 of the 5 requirements.');
            return;
        }
        
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long.');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
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

// Event listeners for real-time validation
document.getElementById('password').addEventListener('input', function() {
    if (!isLogin) {
        checkPasswordStrength();
        checkPasswordMatch();
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    if (!isLogin) {
        checkPasswordMatch();
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