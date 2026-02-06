const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

// Migrate old string-based todos to objects { text, completed }
todos = todos.map(item => {
  if (typeof item === 'string') return { text: item, completed: false };
  if (item && typeof item === 'object') return { text: item.text ?? String(item), completed: !!item.completed };
  return { text: String(item), completed: false };
});

function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function render() {
  list.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'chk';
    checkbox.checked = !!t.completed;
    checkbox.addEventListener('change', () => {
      todos[i].completed = checkbox.checked;
      save();
      render();
    });

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = t.text;

    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.addEventListener('click', () => {
      todos.splice(i, 1);
      save();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  todos.push({ text: val, completed: false });
  input.value = '';
  save();
  render();
});

render();

// --- Theme toggle + persistence ---
const themeToggle = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
let theme = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(theme);

themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
  applyTheme(theme);
});
