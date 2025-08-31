function showForm(type) {
    document.getElementById("loginForm").style.display = type === "login" ? "block" : "none";
    document.getElementById("signupForm").style.display = type === "signup" ? "block" : "none";
  }
  
  function signup() {
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
  
    if (username && password) {
      localStorage.setItem("auth_user", JSON.stringify({ username, password }));
      alert("Signup successful! Please log in.");
      showForm("login");
    } else {
      alert("Fill in all fields.");
    }
  }
  
  function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const user = JSON.parse(localStorage.getItem("auth_user"));
  
    if (user && username === user.username && password === user.password) {
      localStorage.setItem("is_logged_in", "true");
      alert("Login successful!");
      window.location.href = "journal.html"; // go to your journaling or home
    } else {
      alert("Wrong credentials!");
    }
  }
  