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
toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = 'Login';
    submitBtn.textContent = 'Login';
    toggleText.innerHTML = 'Don’t have an account? <a href="#" id="toggleLink">Register here</a>';
    extraField.classList.add('hidden');
    message.textContent = '';
  } else {
    formTitle.textContent = 'Register';
    submitBtn.textContent = 'Register';
    toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Login here</a>';
    extraField.classList.remove('hidden');
    message.textContent = '';
  }

  // Reattach event listener to the new link
  document.getElementById('toggleLink').addEventListener('click', arguments.callee);
});

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    message.textContent = 'Please fill in all fields.';
    return;
  }

  if (isLogin) {
    // LOGIN
    const storedUser = JSON.parse(localStorage.getItem('neosUser'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      localStorage.setItem('neosLoggedIn', 'true');
      message.style.color = 'green';
      message.textContent = 'Login successful! Redirecting...';
      setTimeout(() => window.location.href = 'neos.html', 1000);
    } else {
      message.style.color = 'red';
      message.textContent = 'Invalid email or password.';
    }
  } else {
    // REGISTER
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (password !== confirmPassword) {
      message.textContent = 'Passwords do not match.';
      return;
    }
    const newUser = { email, password };
    localStorage.setItem('neosUser', JSON.stringify(newUser));
    message.style.color = 'green';
    message.textContent = 'Registration successful! You can now log in.';
    // Auto-switch to login mode
    isLogin = true;
    formTitle.textContent = 'Login';
    submitBtn.textContent = 'Login';
    extraField.classList.add('hidden');
  }
});
// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', () => {
    const inputId = icon.dataset.target;
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈'; // change icon when visible
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  });
});

