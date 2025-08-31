const taskList = document.getElementById('task-list');
const input = document.getElementById('new-task');

function addTask() {
  const value = input.value.trim();
  if (value === '') return;

  const li = document.createElement('li');
  li.innerHTML = `<span class="text">${value}</span> <button class="remove">✖</button>`;
  taskList.appendChild(li);
  input.value = '';
  saveTasks();
}

taskList.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove')) {
    e.target.parentElement.remove();
  } else if (e.target.classList.contains('text')) {
    e.target.parentElement.classList.toggle('done');
  }
  saveTasks();
});

// Optional: Save to local storage
function saveTasks() {
  const items = Array.from(taskList.children).map(li => {
    return {
      text: li.querySelector('.text').innerText,
      done: li.classList.contains('done')
    };
  });
  localStorage.setItem('selfcare_tasks', JSON.stringify(items));
}

function loadTasks() {
  const data = localStorage.getItem('selfcare_tasks');
  if (data) {
    JSON.parse(data).forEach(item => {
      const li = document.createElement('li');
      li.classList.toggle('done', item.done);
      li.innerHTML = `<span class="text">${item.text}</span> <button class="remove">✖</button>`;
      taskList.appendChild(li);
    });
  }
}

window.onload = loadTasks;
