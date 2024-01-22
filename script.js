let date = new Date()
date = `${date.getDate() > 9 ? date.getDate() : '0' + String(date.getDate())}/${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + String(date.getMonth() + 1)}/${date.getFullYear()}`;
document.getElementById('date').innerText = date

const getTasks = () => {
    let tasks = JSON.parse(localStorage.getItem('tasklist'))
    if (!(tasks)) { tasks = [] }
    return tasks;
}
const getAllTasks = () => {
    let tasks = JSON.parse(localStorage.getItem('alltasklist'))
    if (!(tasks)) { tasks = {} }
    return tasks;
}
let allTasks = getAllTasks();
let tasks = getTasks()

if (tasks.length > 0) {
    if (tasks[0].date !== date) {
        let yesterdate = tasks[0].date
        let obj = `{ "${yesterdate}":"tasks" }`
        obj = JSON.parse(obj)
        obj[yesterdate] = tasks
        let tmp = { ...obj, ...allTasks } 
        let tasklist = {}
        for (let i in tmp) {
            let arr = []
            let arrayofobjs = tmp[i]
            arrayofobjs.map((obj) => {
                let tmpobj = {}
                tmpobj['id'] = obj['id']
                tmpobj['title'] = obj['title']
                tmpobj['desc'] = obj['desc']
                tmpobj['done'] = obj['done']
                arr.push(tmpobj)
            })
            tasklist[i] = arr
        }
        tmp = `${JSON.stringify(tasklist)}`

        localStorage.setItem('alltasklist', tmp)
        localStorage.setItem('tasklist', JSON.stringify([]))
    }

}
const addTask = () => {
    let input = document.querySelectorAll('.input')
    let id = tasks.length > 0 ? tasks[0]['id'] + 1 : 0;
    let title = input[0].value.trim()
    let desc = input[1].value.trim()

    if (title !== "" && desc !== "") {
        let tmp = {
            id, date, title, desc, done: false
        }
        let arr = [tmp, ...tasks]
        localStorage.setItem('tasklist', JSON.stringify(arr))
        window.location.reload();
    }
}
tasks && tasks.map(task => {
    document.querySelector('.tasklist').innerHTML += `
    <div class="task ${task.done && "done"}">
                <h4>${task.title}</h4>
                <hr>
                <h4 class="desc">${task.desc}</h4>
                <div class="item">
                    <button onclick="task_done(${task.id})">Done </button>
                    <button class="red" onclick="delete_task(${task.id})">Delete</button>
                </div>
            </div>
    `
});

const delete_task = (id) => {
    let tmp = tasks.filter(task => id !== task['id'])
    localStorage.setItem('tasklist', JSON.stringify(tmp))
    window.location.reload();
}
const task_done = (id) => {
    let oldtasks = tasks.filter(elem => elem['id'] !== id)
    let task = tasks.filter(elem => elem['id'] === id)
    let tmp = task[0]
    tmp['done'] = true
    let arr = [tmp, ...oldtasks]
    localStorage.setItem('tasklist', JSON.stringify(arr))
    window.location.reload();
}

const show_past_tasks = () => { 
    let tasklist = getAllTasks()
    let parent_container = document.querySelector('.tasklistcontainer')
    let n = 0
    for (let date in allTasks) {
        let dones = 0; 
        let array_of_obj = allTasks[date]
        array_of_obj.map(obj => obj.done&&dones++) 
        parent_container.innerHTML += `
            <div class="taskslist">
                <h3>${date} <span>${dones}</span> of ${array_of_obj.length} are done <span class="arrow down"
                        onclick="toggle_show(${n})"></span></h3>
                <br>
                <div class="list">
                </div>
            </div>
            `
        let tasks_variable = ""
        array_of_obj.map((obj) => {
            tasks_variable += `
                <div class="listitem ${obj.done?'done':'notdone'}">
                    <h4>${obj.title}</h4>
                    <p>${obj.desc}</p>
                </div>`
        })
        document.querySelectorAll('.taskslist > .list')[n].innerHTML = tasks_variable
        n+=1
    }
}
const navigate = (loc) =>{
    if(loc ==="Home"){
        document.querySelector('.addtask').classList.remove('hide')
        document.querySelector('.tasklist').classList.remove('hide')
        document.querySelector('.pasttask').classList.add('hide')
    } else if(loc === "Past"){
        document.querySelector('.addtask').classList.add('hide')
        document.querySelector('.tasklist').classList.add('hide')
        document.querySelector('.pasttask').classList.remove('hide')
        show_past_tasks()
    }
}
const toggle_show = (n) => {
    let div = document.querySelectorAll('.taskslist')[n]
    let arr = document.querySelectorAll('.arrow')[n]
    if (div.style.height === '280px') {
        div.style.height = '20px'
        arr.classList.replace('up', 'down')
    } else {
        div.style.height = '280px'
        arr.classList.replace('down', 'up')
    }
}
