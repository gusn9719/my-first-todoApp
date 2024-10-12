class TodoApp {
    constructor(listElement, createButtonElement) {
        this.todoList = listElement;
        this.createBtn = createButtonElement;
        this.todos = [];

        this.createBtn.addEventListener('click', () => this.createNewTodo());
        this.loadFromLocalStorage();
    }

    createNewTodo() {
        const item = {
            id: new Date().getTime(),
            text: '',
            complete: false,
        };

        this.todos.unshift(item);
        const { itemEl, inputEl } = this.createTodoEl(item);
        this.todoList.prepend(itemEl);

        inputEl.removeAttribute('disabled');
        inputEl.focus();
        this.saveToLocalStorage();
    }

    createTodoEl(item) {
        const itemEl = document.createElement('div');
        itemEl.classList.add('item');

        const checkboxEl = document.createElement('input');
        checkboxEl.type = 'checkbox';
        checkboxEl.checked = item.complete;
        if (item.complete) {
            itemEl.classList.add('complete');
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

        // Event Listeners
        inputEl.addEventListener('input', () => {
            item.text = inputEl.value;
            this.saveToLocalStorage();
        });

        checkboxEl.addEventListener('change', () => {
            item.complete = checkboxEl.checked;
            if (item.complete) {
                itemEl.classList.add('complete');
            } else {
                itemEl.classList.remove('complete');
            }
            this.saveToLocalStorage();
        });

        inputEl.addEventListener('blur', () => {
            if (inputEl.value.trim() === '') {
                this.todos = this.todos.filter((t) => t.id !== item.id);
                itemEl.remove();
            } else {
                inputEl.setAttribute('disabled', '');
                this.saveToLocalStorage();
            }
        });

        editBtnEl.addEventListener('click', () => {
            inputEl.removeAttribute('disabled');
            inputEl.focus();
            this.saveToLocalStorage();
        });

        removeBtnEl.addEventListener('click', () => {
            this.todos = this.todos.filter((t) => t.id !== item.id);
            itemEl.remove();
            this.saveToLocalStorage();
        });

        actionsEl.appendChild(editBtnEl);
        actionsEl.appendChild(removeBtnEl);

        itemEl.appendChild(checkboxEl);
        itemEl.appendChild(inputEl);
        itemEl.appendChild(actionsEl);

        return { itemEl, checkboxEl, inputEl, actionsEl };
    }

    saveToLocalStorage() {
        const data = JSON.stringify(this.todos);
        localStorage.setItem('my_todos', data);
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('my_todos');
        if (data) {
            this.todos = JSON.parse(data);
            for (const item of this.todos) {
                const { itemEl } = this.createTodoEl(item);
                this.todoList.append(itemEl);
            }
        }
    }
}

// Initialize the TodoApp
const todoListElement = document.getElementById('list');
const createButtonElement = document.getElementById('create-btn');

const app = new TodoApp(todoListElement, createButtonElement);
