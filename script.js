// Load stored data
let members = JSON.parse(localStorage.getItem("members")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let giving = JSON.parse(localStorage.getItem("giving")) || [];

// Register Member
document.getElementById("memberForm").addEventListener("submit", e => {
  e.preventDefault();
  const member = {
    name: name.value,
    phone: phone.value,
    email: email.value,
    location: location.value,
    joinDate: joinDate.value,
    role: role.value,
    birthday: birthday.value
  };
  members.push(member);
  localStorage.setItem("members", JSON.stringify(members));
  alert("✅ Member Registered!");
  showMembers();
  e.target.reset();
});

// Attendance
document.getElementById("attendanceForm").addEventListener("submit", e => {
  e.preventDefault();
  const att = {
    name: attName.value,
    date: attDate.value,
    ministry: ministry.value,
    notes: notes.value
  };
  attendance.push(att);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("📂 Attendance Saved!");
  showAttendance();
  e.target.reset();
});

// Giving
document.getElementById("givingForm").addEventListener("submit", e => {
  e.preventDefault();
  const give = {
    name: giveName.value,
    date: giveDate.value,
    type: giveType.value,
    amount: parseFloat(giveAmount.value)
  };
  giving.push(give);
  localStorage.setItem("giving", JSON.stringify(giving));
  alert("💰 Giving Recorded!");
  showGiving();
  e.target.reset();
});

// View functions
function showMembers() {
  let html = "<table><tr><th>Name</th><th>Phone</th><th>Email</th><th>Role</th></tr>";
  members.forEach(m => {
    html += `<tr><td>${m.name}</td><td>${m.phone}</td><td>${m.email}</td><td>${m.role}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("membersList").innerHTML = html;
}

function showAttendance() {
  let html = "<table><tr><th>Name</th><th>Date</th><th>Ministry</th><th>Notes</th></tr>";
  attendance.forEach(a => {
    html += `<tr><td>${a.name}</td><td>${a.date}</td><td>${a.ministry}</td><td>${a.notes}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("attendanceList").innerHTML = html;
}

function showGiving() {
  let html = "<table><tr><th>Name</th><th>Date</th><th>Type</th><th>Amount</th></tr>";
  giving.forEach(g => {
    html += `<tr><td>${g.name}</td><td>${g.date}</td><td>${g.type}</td><td>${g.amount}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("givingList").innerHTML = html;
}

// Reports
function generateReports() {
  const totalMembers = members.length;
  const totalGiving = giving.reduce((sum, g) => sum + g.amount, 0);
  const monthlyGiving = {};

  giving.forEach(g => {
    const month = g.date.slice(0,7); // YYYY-MM
    monthlyGiving[month] = (monthlyGiving[month] || 0) + g.amount;
  });

  let reportHTML = `
    <p><strong>Total Members:</strong> ${totalMembers}</p>
    <p><strong>Total Giving:</strong> ${totalGiving}</p>
    <p><strong>Monthly Giving:</strong></p>
    <ul>
  `;
  for (let month in monthlyGiving) {
    reportHTML += `<li>${month}: ${monthlyGiving[month]}</li>`;
  }
  reportHTML += "</ul>";

  document.getElementById("reportBox").innerHTML = reportHTML;
}
