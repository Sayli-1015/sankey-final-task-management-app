const btnAddEl = document.getElementById('btnAdd')
btnAddEl.addEventListener('click', () => {
  addNewTask()
})

const searchButtonEl = document.getElementById('searchButton')

searchButtonEl.addEventListener('click', () => {
  search = document.getElementById('searchInput').value.toLowerCase();
  renderTasks();
})
const taskListEl = document.getElementById('taskList');

let search = ''
const tasks = [
  // {
  //   taskId: '1',
  //   taskName: 'Hello',
  //   taskStartDate: '1',
  //   taskEndDate: '3',
  //   taskStatus: "inprogress",
  //   subTasks: [
  //     {
  //       subId: "task1." + "1",
  //       subTaskName: 'hello',
  //       subStartDate: '2',
  //       subEndDate: '3',
  //       subStatus: "inprogress",
  //       _isEditing: false,
  //     }
  //   ],
  //   _isEditing: false,
  // }
]

const deletedTasks = [];
const editTasks = [];

// func to add new task
function addNewTask() {
  search = ''
  tasks.push({
    taskId: '',
    taskName: '',
    taskStartDate: '',
    taskEndDate: '',
    taskStatus: '',
    subTasks: [],
    _isEditing: true,
  })
  renderTasks();
}

//function to delete parent task
function deleteTask(taskIdx){
  deletedTasks.push(tasks[taskIdx])
  // console.log('deleted tasks ',deletedTasks);
  tasks.splice(taskIdx,1);
  renderTasks();

}

// func to render tasks
function renderTasks() {
  // empty everything
  taskListEl.innerHTML = ''
  for (let i = 0; i < tasks.length; i++) {
    if (isTaskInSearch(tasks[i]) === false) {
      continue;
    }
    const taskEl = document.createElement('li');
    taskEl.innerHTML = generateTaskHtml(i)
    taskListEl.appendChild(taskEl)
  }
}

// func to check if task is in search
function isTaskInSearch(task) {
  if(search.length < 1) {
    return true;
  }
  if (String(task.taskId).toLowerCase().includes(search)) {
    return true
  }
  if (String(task.taskName).toLowerCase().includes(search)) {
    return true
  }
  if (task.taskStartDate && String(task.taskStartDate).toLowerCase().includes(search)) {
    return true
  }
  if (task.taskStartDate && String(task.taskEndDate).toLowerCase().includes(search)) {
    return true
  }
  if (task.taskStatus.toLowerCase().includes(search)) {
    return true
  }
  const filteredSubTasks = task.subTasks.filter((subTask) => {
    if(subTask.subId.toLowerCase().includes(search)) {
      return true
    }
    if(subTask.subTaskName.toLowerCase().includes(search)) {
      return true
    }
    if (subTask.subStartDate && String(task.subStartDate).toLowerCase().includes(search)) {
      return true
    }
    if (subTask.subEndDate && String(task.subEndDate).toLowerCase().includes(search)) {
      return true
    }
    if (subTask.subStatus.toLowerCase().includes(search)) {
      return true
    }
  })
  if (filteredSubTasks.length > 0) {
    return true
  }
  return false
}

// func to generate task (single task) html
function generateTaskHtml(idx) {
  const task = tasks[idx]
  // const currentDate = new Date();

  // Default option
  // let statusOptions = '<option value="Completed">Completed</option>'; 

  // if (currentDate > new Date(task.taskEndDate)) {
  //   // If the current date is after the task's end date
  //   statusOptions += '<option value="Due Passed">Due Passed</option>';
  // }

  // if (currentDate >= new Date(task.taskStartDate) && currentDate <= new Date(task.taskEndDate)) {
  //   // If the current date is within the task's start and end dates
  //   statusOptions += '<option value="In Progress">In Progress</option>';
  // }

  // statusOptions += '<option value="Canceled">Canceled</option>';

  if (task._isEditing) {
    return `<div class="taskForm">
    <form>
    <label for="task.${idx}.taskId">ID</label>
    <input id="task.${idx}.taskId" type="number" value="${task.taskId}" oninput="onChangeTaskId(${idx})" required/>
    <p style="color:red;" id="task.${idx}.taskId.error"></p>
    </br>

    <label for="task.${idx}.taskName">Name</label>
    <input id="task.${idx}.taskName" type="text" value="${task.taskName}" required/>
    <p style="color:red;" id="task.${idx}.taskName.error"></p>
    </br>

    <label for="task.${idx}.taskStartDate">Start</label>
    <input id="task.${idx}.taskStartDate"type="datetime-local" value="${task.taskStartDate}" onchange="onChangeTaskDate(${idx})" required/>
    <p style="color:red;" id="task.${idx}.taskStartDate.error"></p>
    </br>

    <label for="task.${idx}.taskEndDate">End</label>
    <input id="task.${idx}.taskEndDate" type="datetime-local" value="${task.taskEndDate}" onchange="onChangeTaskDate(${idx})" required/>
    <p style="color:red;" id="task.${idx}.taskEndDate.error"></p>
    </br>

    <label for="task.${idx}.taskStatus">Status:</label>
      <select id="task.${idx}.taskStatus" required>
        <option value="InProgress">InProgress</option>
        <option value="Completed">Completed</option>
        <option value="DuePassed">Due Passed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    <button onClick="saveTask(${idx})" class="taskBtn taskSaveBtn" type="submit">Save Task</button>
    <button onClick="deleteTask(${idx})" class="taskBtn taskDeleteBtn">Delete</button>
    <ul class="sub-task-list">
      ${task.subTasks.map((_, subTaskIdx) => generateSubTaskHtml(idx, subTaskIdx))}
    </ul>
    </form>
    </div>`
  } else {
    return `<div>
    <h3>TaskID: ${task.taskId}</h3>
    <h3>TaskName: ${task.taskName}</h3>
    <h3>Start Date: ${task.taskStartDate}</h3>
    <h3>End Date: ${task.taskEndDate}</h3>
    <h3>Task Status: <span style="${getStatusStyle(task.taskStatus)}">${task.taskStatus}</span></h3>

    <ul class="sub-task-list">
      ${task.subTasks.map((_, subTaskIdx) => generateSubTaskHtml(idx, subTaskIdx) )}
    </ul>
    <button onClick="addSubTask(${idx})" class="taskBtn taskSaveBtn">Add Sub Task</button>
    <button onClick="editTask(${idx})" class="taskBtn taskEditBtn">Edit</button>
    <button onClick="deleteTask(${idx})" class="taskBtn taskDeleteBtn">Delete</button>
    </div>`
  }
}

function generateSubTaskHtml(taskIdx, subTaskIdx) {
  const subTask = tasks[taskIdx].subTasks[subTaskIdx]
  if (subTask._isEditing) {
    return `
    <li>
      <div>
        <label for="task.${taskIdx}.subtask.${subTaskIdx}.subTaskName">Name</label>
        <input id="task.${taskIdx}.subtask.${subTaskIdx}.subTaskName" value="${subTask.subTaskName}"/>
      </br>

      <label for="task.${taskIdx}.subtask.${subTaskIdx}.subStartDate">Start</label>
        <input id="task.${taskIdx}.subtask.${subTaskIdx}.subStartDate" type="datetime-local" value="${subTask.subStartDate}" onChange="onChangeSubTaskDate(${taskIdx}, ${subTaskIdx})"/>
      </br>

      <label for="task.${taskIdx}.subtask.${subTaskIdx}.subEndDate">End</label>
        <input id="task.${taskIdx}.subtask.${subTaskIdx}.subEndDate" type="datetime-local" value="${subTask.subEndDate}" onChange="onChangeSubTaskDate(${taskIdx}, ${subTaskIdx})"/>
        <p style="color:red;" id="task.${taskIdx}.subtask.${subTaskIdx}.subEndDate.error"></p>
        </br>

    

      <label for="task.${taskIdx}.subtask.${subTaskIdx}.subStatus">Status:</label>
      <select id="task.${taskIdx}.subtask.${subTaskIdx}.subStatus">
        <option value="InProgress">InProgress</option>
        <option value="Completed">Completed</option>
        <option value="DuePassed">Due Passed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <button onClick="saveSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskSaveBtn">Save Sub Task</button>
              <button onClick="deleteSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskDeleteBtn">Delete Sub Task</button>
      </div>
    </li>
    `
  } else {
    return `
      <li>
        <div>
          <h4>Sub ID: ${subTask.subId}</h4>
          <h4>Sub TaskName: ${subTask.subTaskName}</h4>
          <h4>Sub Task Start Date: ${subTask.subStartDate}</h4>
          <h4>Sub Task End Date: ${subTask.subEndDate}</h4>
          <h4>Sub Task Status: <span style="${getStatusStyle(subTask.subStatus)}">${subTask.subStatus}<span/></h4>
          <button onClick="editSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskEditBtn">Edit Sub Task</button>
          <button onClick="deleteSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskDeleteBtn">Delete Sub Task</button>
        </div>
      </li>
    `
  }
}

// func to get status class name
function getStatusStyle(status) {
  if (status === 'InProgress') {
    return "color: yellow;"
  } else if (status === 'Completed') {
    return "color: green;"
  } else if (status === 'Due Passed') {
    return "color: red;"
  } else if (status === 'Cancelled') {
    return "color: gray;"
  }
  return "color: red;"
}

// func to set it editing
function editTask(idx) {
  tasks[idx]._isEditing = true
  renderTasks()
}


// func to save task
function saveTask(idx) {
  //new code by me of save
  const taskIdInput = document.getElementById(`task.${idx}.taskId`);
  const taskNameInput = document.getElementById(`task.${idx}.taskName`);
  const taskStartDateInput = document.getElementById(`task.${idx}.taskStartDate`);
  const taskEndDateInput = document.getElementById(`task.${idx}.taskEndDate`);

  if (
    !taskIdInput.value ||
    !taskNameInput.value ||
    !taskStartDateInput.value ||
    !taskEndDateInput.value
  ) {
    alert("Please fill in all inputs required for Tasks fields.");
    return;
  } else {
    tasks[idx].taskId = taskIdInput.value;
    tasks[idx].taskName = taskNameInput.value;
    tasks[idx].taskStartDate = taskStartDateInput.value;
    tasks[idx].taskEndDate = taskEndDateInput.value;
    tasks[idx].taskStatus = document.getElementById(`task.${idx}.taskStatus`).value;
    tasks[idx]._isEditing = false;
    renderTasks();
  }
  //new code ends here


  //previous code starts here

  // tasks[idx].taskId = document.getElementById(`task.${idx}.taskId`).value
  // tasks[idx].taskName = document.getElementById(`task.${idx}.taskName`).value
  // tasks[idx].taskStartDate = document.getElementById(`task.${idx}.taskStartDate`).value
  // tasks[idx].taskEndDate = document.getElementById(`task.${idx}.taskEndDate`).value
  // tasks[idx].taskStatus = document.getElementById(`task.${idx}.taskStatus`).value
  // tasks[idx]._isEditing = false
  // renderTasks()

  //previous code ends here
}


// func to add sub task
function addSubTask(idx) {
  tasks[idx].subTasks.push({
    subId: `${tasks[idx].taskId}.${tasks[idx].subTasks.length + 1}`,
    subTaskName: '',
    _isEditing: true,
  })
  renderTasks()
}

//func to delete subtask
function deleteSubTask(taskIdx, subTaskIdx) {
  tasks[taskIdx].subTasks.splice(subTaskIdx, 1);
  renderTasks()
}

// func to set sub task editing
function editSubTask(taskIdx, subTaskIdx) {
  tasks[taskIdx].subTasks[subTaskIdx]._isEditing = true
  renderTasks()
}


// func to save sub tasdk
function saveSubTask(taskIdx, subTaskIdx) {

  const subTaskNameInput = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subTaskName`);
  const subTaskStartDateInput = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStartDate`);
  const subTaskEndDateInput = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subEndDate`);

  if (
    !subTaskNameInput.value ||
    !subTaskStartDateInput.value ||
    !subTaskEndDateInput.value
  ) {
    alert("Please fill in all input required for sub tasks fields.");
    return;
  } else {
    tasks[taskIdx].subTasks[subTaskIdx].subTaskName = subTaskNameInput.value;
    tasks[taskIdx].subTasks[subTaskIdx].subStartDate = subTaskStartDateInput.value;
    tasks[taskIdx].subTasks[subTaskIdx].subEndDate = subTaskEndDateInput.value;
    tasks[taskIdx].subTasks[subTaskIdx].subStatus = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStatus`).value;
    tasks[taskIdx].subTasks[subTaskIdx]._isEditing = false;
    renderTasks();
  }

  //previous code start

  // tasks[taskIdx].subTasks[subTaskIdx].subTaskName = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subTaskName`).value
  // tasks[taskIdx].subTasks[subTaskIdx].subStartDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStartDate`).value
  // tasks[taskIdx].subTasks[subTaskIdx].subEndDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subEndDate`).value
  // tasks[taskIdx].subTasks[subTaskIdx].subStatus = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStatus`).value
  // tasks[taskIdx].subTasks[subTaskIdx]._isEditing = false

  // renderTasks()

  //previous code ends here
}


//function to validate id
function onChangeTaskId(taskIdx) {
  const taskIdValue = document.getElementById(`task.${taskIdx}.taskId`).value
  const errorElement = document.getElementById(`task.${taskIdx}.taskId.error`)
  if (!errorElement) return
  const idx = tasks.findIndex(t => t.taskId === taskIdValue)
  if (idx >= 0 && idx !== taskIdx){
    errorElement.innerHTML = "Task with id " + taskIdValue + " already exists."
  } else {
    errorElement.innerHTML = ''
  }
}


// func to handle date change
function onChangeTaskDate(taskIdx) {
  const startDate = document.getElementById(`task.${taskIdx}.taskStartDate`).value
  const endDate = document.getElementById(`task.${taskIdx}.taskEndDate`).value
  const errorElement = document.getElementById(`task.${taskIdx}.taskEndDate.error`)
  if (!errorElement) return
  if(!startDate|| !endDate) {
    errorElement.innerText = 'Please select valid dates'
    return
  }
  if (startDate > endDate) {
    errorElement.innerText = 'End date can\'t be smaller than start date.'
  } else {
    errorElement.innerText = ''
  }
}

function onChangeSubTaskDate(taskIdx, subTaskIdx) {
  const taskStartDate = tasks[taskIdx].taskStartDate
  const taskEndDate = tasks[taskIdx].taskEndDate
  const subTaskStartDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStartDate`).value
  const subTaskEndDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subEndDate`).value
  const errorElement = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subEndDate.error`)
  if(!errorElement) {
    return
  }
  if (!subTaskStartDate || !subTaskEndDate) {
    errorElement.innerText = 'Please select valid dates'
    return
  }
  if (subTaskStartDate > subTaskEndDate) {
    errorElement.innerText = 'End date can\'t be smaller than start date.'
    return
  }
  if (subTaskStartDate <= taskStartDate || subTaskStartDate >= taskEndDate) {
    errorElement.innerText = 'Start Date should be between parent task start and end date.'
    return
  }
  if (subTaskEndDate <= taskStartDate || subTaskEndDate >= taskEndDate) {
    errorElement.innerText = 'End Date should be between parent task start and end date.'
    return
  }
  errorElement.innerText = ''
}






// intital render
document.addEventListener('DOMContentLoaded', () => {
  renderTasks()
})

