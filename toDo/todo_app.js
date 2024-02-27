const userNameList = 'https://jsonplaceholder.typicode.com/users';
const toDoList = 'https://jsonplaceholder.typicode.com/todos';

const data = {};

const getUsers = async (url) => {
    try {
        const response = await fetch(url);
        const result = await response.json();
    
        result.forEach(user => {
            data[user.id] = { username: user.username, todosCount: 0 };
        });
    } catch(e) {
        console.log(e, 'Ощибка, ищем getUsers');
    }
};  
getUsers(userNameList);


const getToDo = async (url) => {
    try {
        const response = await fetch(url);
        const res = await response.json();

        res.forEach(todo => {
            if (data[todo.userId]) {
                data[todo.userId].todosCount += 1;
            }
        });

        console.log('### FINAL DATA', data);
    } catch(e) {
        console.log(e, 'Ощибка, ищем getToDo')
    }
    
    Object.values(data).forEach((el) => {
        left.innerHTML += `<div id="create">     
        <span> ${el.username} </span><span>todo: ${el.todosCount}</span></div>`;
    })
        main.append(left);
};
getToDo(toDoList);
