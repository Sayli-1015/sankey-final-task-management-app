const btnAddEl = document.getElementById('btnAdd')
btnAddEl.addEventListener('click', () => {
  addNewTask()
})

const taskListEl = document.getElementById('taskList');

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

// func to add new task
function addNewTask() {
  tasks.push({
    taskId: '',
    taskName: '',
    subTasks: [],
    _isEditing: true,
  })
  renderTasks();
}

//function to delete parent task
function deleteTask(taskIdx){
  tasks.splice(taskIdx,1);
  renderTasks();

}

// func to render tasks
function renderTasks() {
  // empty everything
  taskListEl.innerHTML = ''
  for (let i = 0; i < tasks.length; i++) {
    const taskEl = document.createElement('li');
    taskEl.innerHTML = generateTaskHtml(i)
    taskListEl.appendChild(taskEl)
  }
}

// func to generate task (single task) html
function generateTaskHtml(idx) {
  const task = tasks[idx]
  if (task._isEditing) {
    return `<div class="taskForm">
    
    <label for="task.${idx}.taskId">ID</label>
    <input id="task.${idx}.taskId" type="number" value="${task.taskId}"/>
    </br>

    <label for="task.${idx}.taskName">Name</label>
    <input id="task.${idx}.taskName" type="text" value="${task.taskName}"/>
    </br>

    <label for="task.${idx}.taskStartDate">Start</label>
    <input id="task.${idx}.taskStartDate"type="datetime-local" value="${task.taskStartDate}" onchange="onChangeTaskDate(${idx})"/>
    </br>

    <label for="task.${idx}.taskEndDate">End</label>
    <input id="task.${idx}.taskEndDate" type="datetime-local" value="${task.taskEndDate}" onchange="onChangeTaskDate(${idx})"/>
    <p style="color:red;" id="task.${idx}.taskEndDate.error"></p>
    </br>

    <label for="task.${idx}.taskStatus">Status:</label>
      <select id="task.${idx}.taskStatus">
        <option value="InProgress">InProgress</option>
        <option value="Completed">Completed</option>
        <option value="DuePassed">Due Passed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    <button onClick="saveTask(${idx})" class="taskBtn taskSaveBtn">Save Task</button>
    <button onClick="deleteTask(${idx})" class="taskBtn taskDeleteBtn">Delete</button>
    <ul class="sub-task-list">
      ${task.subTasks.map((_, subTaskIdx) => generateSubTaskHtml(idx, subTaskIdx))}
    </ul>
    </div>`
  } else {
    return `<div>
    <h3>TaskID: ${task.taskId}</h3>
    <h3>TaskName: ${task.taskName}</h3>
    <h3>Start Date: ${task.taskStartDate}</h3>
    <h3>End Date: ${task.taskEndDate}</h3>
    <h3>Task Status: ${task.taskStatus}</h3>

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
          <h4>Sub Task Status: ${subTask.subStatus}</h4>
          <button onClick="editSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskEditBtn">Edit Sub Task</button>
          <button onClick="deleteSubTask(${taskIdx}, ${subTaskIdx})" class="taskBtn taskDeleteBtn">Delete Sub Task</button>
        </div>
      </li>
    `
  }
}

// func to set it editing
function editTask(idx) {
  tasks[idx]._isEditing = true
  renderTasks()
}

// func to save task
function saveTask(idx) {
  tasks[idx].taskId = document.getElementById(`task.${idx}.taskId`).value
  tasks[idx].taskName = document.getElementById(`task.${idx}.taskName`).value
  tasks[idx].taskStartDate = document.getElementById(`task.${idx}.taskStartDate`).value
  tasks[idx].taskEndDate = document.getElementById(`task.${idx}.taskEndDate`).value
  tasks[idx].taskStatus = document.getElementById(`task.${idx}.taskStatus`).value
  tasks[idx]._isEditing = false
  renderTasks()
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
  tasks[taskIdx].subTasks[subTaskIdx].subTaskName = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subTaskName`).value
  tasks[taskIdx].subTasks[subTaskIdx].subStartDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStartDate`).value
  tasks[taskIdx].subTasks[subTaskIdx].subEndDate = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subEndDate`).value
  tasks[taskIdx].subTasks[subTaskIdx].subStatus = document.getElementById(`task.${taskIdx}.subtask.${subTaskIdx}.subStatus`).value
  tasks[taskIdx].subTasks[subTaskIdx]._isEditing = false

  renderTasks()
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

