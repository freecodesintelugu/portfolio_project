const form = document.getElementById('studentForm');
const statusMsg = document.getElementById('statusMsg');
const studentsBody = document.getElementById('studentsBody');

async function loadStudents() {
  try {
    const res = await fetch('/students');
    const students = await res.json();

    studentsBody.innerHTML = '';
    students
      .sort((a, b) => (a.CreatedAt < b.CreatedAt ? 1 : -1))
      .forEach((s) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${s.Name}</td>
          <td>${s.Age}</td>
          <td>${s.Course}</td>
          <td>${s.Email}</td>
          <td>${new Date(s.CreatedAt).toLocaleString()}</td>
          <td><button class="delete-btn" data-id="${s.StudentId}">Delete</button></td>
        `;
        studentsBody.appendChild(row);
      });
  } catch (err) {
    statusMsg.textContent = 'Failed to load students.';
    statusMsg.style.color = 'red';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    course: document.getElementById('course').value,
    email: document.getElementById('email').value
  };

  try {
    const res = await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add student');
    }

    statusMsg.textContent = 'Student added successfully!';
    statusMsg.style.color = 'green';
    form.reset();
    loadStudents();
  } catch (err) {
    statusMsg.textContent = err.message;
    statusMsg.style.color = 'red';
  }
});

studentsBody.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    try {
      await fetch(`/students/${id}`, { method: 'DELETE' });
      loadStudents();
    } catch (err) {
      statusMsg.textContent = 'Failed to delete student.';
      statusMsg.style.color = 'red';
    }
  }
});

loadStudents();
