const userNameList = 'https://jsonplaceholder.typicode.com/users';
const toDoList = 'https://jsonplaceholder.typicode.com/todos';

const title = document.querySelector('.title');
const table = document.querySelector('.table');


// STATE
let totalTodosCout = 0;
const data = {};

// utils
const rerenderTitle = (todosCount) => {
    title.innerText = `Осталось не решенных задач:  ${todosCount}`
}

const getUsers = async (url) => {
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        result.forEach(user => {
            data[user.id] = { username: user.username, todosCount: 0, todos: [] };
        });
    } catch(e) {
        console.log(e, 'Ощибка, ищем getUsers');
    }
};



const getToDo = async (url) => {
    try {
        const response = await fetch(url);
        const res = await response.json();

        res.forEach(({ userId, title  }) => {
            if (data[userId]) {
                data[userId].todosCount += 1;
                data[userId].todos.push({ checked: false, task: title });
            }
        });

    } catch(e) {
        console.log(e, 'Ощибка, ищем getToDo')
    }

    
    Object.values(data).forEach(el => {
        totalTodosCout += el.todosCount;

        table.innerHTML += `<div id="addToDo">     
            <p> ${el.username} </p> 
            
            <h4>Решенных задач: <span class="h4"> ${el.todosCount}</span></h4>
            
            <form class="forms">
                ${el.todos.map(element =>
                    `<p class="input">
                        <input type="checkbox" value="0">${element.task}</input>
                    </p>`).join('')}
            </form>
        </div>
        `;
    })
    rerenderTitle(totalTodosCout);

    main.append(table);
};



const startApplication = async () => {
    await getUsers(userNameList);
    await getToDo(toDoList);
}
startApplication();



table.addEventListener('click', (event) => {
    if (event.target.tagName !== 'INPUT') return;
const prevValue = Number(event.target.getAttribute('value'));
const newValue = prevValue === 0 ? 1 : 0;

event.target.setAttribute('value', newValue);
event.target.checked = Boolean(newValue);

    totalTodosCout = newValue ? totalTodosCout - 1 : totalTodosCout + 1;
    rerenderTitle(totalTodosCout);
});

