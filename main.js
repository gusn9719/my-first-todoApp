const todoList = document.getElementById('list');
const createBtn = document.getElementById('create-btn');

let todos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
    const item = {
        id: new Date().getTime(),
        text: '',
        complete: false,
    };

    todos.unshift(item);

    const { itemEl, inputEl, editBtnEl, removeBtnEl } = createTodoEl(item);

    todoList.prepend(itemEl);

    inputEl.removeAttribute('disabled');

    inputEl.focus();
    saveToLocalStorage();
}

function createTodoEl(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete;
    if (item.complete) {
        itemEl.classList.add('complete');
        itemEl.checked = true;
    }

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', '');

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.textContent = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons');
    removeBtnEl.textContent = 'delete';

    inputEl.addEventListener('input', () => {
        item.text = inputEl.value;

        saveToLocalStorage();
    });

    checkboxEl.addEventListener('change', () => {
        item.complete = checkboxEl.checked;

        if (item.complete) {
            itemEl.classList.add('complete');
        } else {
            itemEl.classList.remove('complete');
        }
        saveToLocalStorage();
    });

    inputEl.addEventListener('blur', () => {
        if (inputEl.value.trim() === '') {
            todos = todos.filter((t) => t.id !== item.id);
            itemEl.remove();
        } else {
            inputEl.setAttribute('disabled', '');
            saveToLocalStorage();
        }
    });

    editBtnEl.addEventListener('click', () => {
        inputEl.removeAttribute('disabled');
        inputEl.focus();
        saveToLocalStorage();
    });

    removeBtnEl.addEventListener('click', () => {
        todos = todos.filter((t) => t.id !== item.id);
        itemEl.remove();

        saveToLocalStorage();
    });

    actionsEl.appendChild(editBtnEl);
    actionsEl.appendChild(removeBtnEl);

    itemEl.appendChild(checkboxEl);
    itemEl.appendChild(inputEl);
    itemEl.appendChild(actionsEl);

    return { itemEl, checkboxEl, inputEl, actionsEl };
}

function saveToLocalStorage() {
    const data = JSON.stringify(todos);

    localStorage.setItem('my_todos', data);
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('my_todos');

    if (data) {
        todos = JSON.parse(data);
        for (const item of todos) {
            const { itemEl } = createTodoEl(item);
            todoList.append(itemEl);
        }
    }
}

loadFromLocalStorage();
