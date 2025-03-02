// script.js

// Ensure script runs after page load
document.addEventListener("DOMContentLoaded", function () {

  // ============== LOGIN ==============
  const loginForm = document.querySelector("#login-form");
  const submitButton = document.querySelector("#login-submit");

  if (loginForm) {
    loginForm.addEventListener("input", function () {
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
      submitButton.disabled = !(username && password);
    });

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = document.querySelector("#username").value;
      let password = document.querySelector("#password").value;

      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("username", data.username);
          alert("Login successful!");
          window.location.href = "accounts.html";
        } else {
          alert("Invalid credentials. Try again.");
        }
      })
      .catch(err => console.error(err));
    });
  }

  // ============== ACCOUNTS ==============
  if (document.getElementById("account-details")) {
    let username = localStorage.getItem("username");
    if (username) {
      fetch(`http://localhost:5001/accounts/${username}`)
      .then(response => response.json())
      .then(accounts => {
        let html = `<h3>Welcome, ${username}!</h3>`;
        accounts.forEach(account => {
          html += `<p><strong>${account.bank}:</strong> $${account.balance.toFixed(2)}</p>`;
        });
        document.getElementById("account-details").innerHTML = html;
      })
      .catch(err => console.error(err));
    } else {
      document.getElementById("account-details").innerHTML = "<p>Please <a href='login.html'>login</a> to see your account details.</p>";
    }
  }

  // ============== BILL PAYMENT ==============
  const billForm = document.querySelector("#bill-form");
  if (billForm) {
    billForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = localStorage.getItem("username");
      let biller = document.querySelector("#biller").value;
      let amount = document.querySelector("#amount").value;
      let dueDate = document.querySelector("#due-date").value;

      fetch("http://localhost:5001/pay-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, biller, amount, dueDate })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
      })
      .catch(err => console.error(err));
    });
  }

  // ============== CREDIT SCORE ==============
  if (document.getElementById("credit-score")) {
    let username = localStorage.getItem("username");
    if (username) {
      fetch(`http://localhost:5001/credit-score/${username}`)
      .then(response => response.json())
      .then(data => {
        let scoresHtml = `<p>Current Credit Score: ${data.currentScore}</p>`;
        if (data.previousScores.length) {
          scoresHtml += `<ul>`;
          data.previousScores.forEach(score => {
            scoresHtml += `<li>${score}</li>`;
          });
          scoresHtml += `</ul>`;
        }
        document.getElementById("credit-score").innerHTML = scoresHtml;
      })
      .catch(err => console.error(err));
    }
  }

  // ============== UPDATE PASSWORD ==============
  const updateForm = document.querySelector("#update-form");
  if (updateForm) {
    updateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let username = localStorage.getItem("username");
      let newPassword = document.querySelector("#new-password").value;

      fetch("http://localhost:5001/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword })
      })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(err => console.error(err));
    });
  }

});
