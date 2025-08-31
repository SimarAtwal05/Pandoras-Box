document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Fake auth: You can hook Firebase, etc. later
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username === "admin" && password === "1234") {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', username);
      window.location.href = 'index.html';
    } else {
      alert("Wrong credentials 💀 (hint: admin / 1234)");
    }
  });
  