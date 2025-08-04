/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */



// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

async function fetchAndDisplayUsers() {
    console.log('Fetching users');
    const tableElement = document.getElementById('appUser');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/appusers', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTasks() {
    const tableElement = document.getElementById('tasksTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/tasks', {
        method: 'GET'
    });

    const responseData = await response.json();
    const taskData = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    taskData.forEach(task => {
        const row = tableBody.insertRow();
        task.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayPlants() {
    const table = document.getElementById('plantTable');
    const tbody = table.querySelector('tbody');

    const response = await fetch('/plants');
    const data = await response.json();

    tbody.innerHTML = '';
    data.data.forEach(plant => {
        const row = tbody.insertRow();
        plant.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });
}

async function fetchUserTasks() {
    const userID = document.getElementById('userIDInput').value;
    const table = document.getElementById('tasksTable');
    const resultmsg = document.getElementById('userTasksResultMsg')
    const tableBody = table.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    const response = await fetch(`/api/user-tasks/${userID}`, { // we want the userID to be the endpoint to retrieve info
        method: 'GET'
    });
    const responseData = await response.json();
    const taskData = responseData.tasks;
    if (responseData.success && Array.isArray(taskData) && taskData.length > 0) { // if there is a user and there is task data
        table.style.display = 'table';

        taskData.forEach(task => {
            const row = tableBody.insertRow();
            const cell1 = row.insertCell();
            cell1.textContent = task.taskID;
            const cell2 = row.insertCell();
            cell2.textContent = task.frequency;
            const cell3 = row.insertCell();
            cell3.textContent = task.details;
        });
    } else if (responseData.success) {
        resultmsg.textContent = 'This user has no tasks assigned.'; // if len(tasks) = 0
    } else {
        resultmsg.textContent = 'User not found.';                  // if the userID is null
    }
}

// This function resets or initializes the demotable.
// async function resetDemotable() {
//     const response = await fetch("/initiate-demotable", {
//         method: 'POST'
//     });
//     const responseData = await response.json();

//     if (responseData.success) {
//         const messageElement = document.getElementById('resetResultMsg');
//         messageElement.textContent = "demotable initiated successfully!";
//         fetchTableData();
//     } else {
//         alert("Error initiating table!");
//     }
// }

async function resetAppUsers() {
    const response = await fetch("/initiate-appusers", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "appusers initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

async function resetTasks() {
    const response = await fetch("/initiate-tasks", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "tasks initiated successfully!";
        fetchAndDisplayTasks();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new records into the demotable.
// async function insertDemotable(event) {
//     event.preventDefault();

//     const idValue = document.getElementById('insertId').value;
//     const nameValue = document.getElementById('insertName').value;

//     const response = await fetch('/insert-demotable', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: idValue,
//             name: nameValue
//         })
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('insertResultMsg');

//     if (responseData.success) {
//         messageElement.textContent = "Data inserted successfully!";
//         fetchTableData();
//     } else {
//         messageElement.textContent = "Error inserting data!";
//     }
// }

async function insertDemotable(event) {
    event.preventDefault();

    const userID = document.getElementById('insertId').value;
    const firstName = document.getElementById('insertFirstName').value;
    const lastName = document.getElementById('insertLastName').value;

    const response = await fetch('/insert-appuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
            firstName: firstName,
            lastName: lastName
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function deleteAppUser(event) {
    event.preventDefault();

    const userID = document.getElementById('deleteUserID').value;
    const response = await fetch('/delete-appuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userID: userID,
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "User deleted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting data!";
    }
}

async function insertTasks(event) {
    event.preventDefault();

    const taskID = document.getElementById('insertTaskId').value;
    const frequency = document.getElementById('insertFrequency').value;
    const details = document.getElementById('insertDetails').value;

    const response = await fetch('/insert-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taskID: taskID,
            frequency: frequency,
            details: details
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchAndDisplayTasks();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function insertPlant(event) {
    event.preventDefault();

    const plantID = document.getElementById('plantID').value;
    const species = document.getElementById('species').value;
    const plantName = document.getElementById('plantName').value;

    const response = await fetch('/insert-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantID, species, plantName })
    });

    const result = await response.json();
    const msg = document.getElementById('insertPlantMsg');
    msg.textContent = result.success ? "Plant inserted!" : "Error inserting plant.";
    if (result.success) {
        fetchAndDisplayPlants();
        fetchAndDisplayPlantLog();
    };
}

async function insertUserTask(event) { // for viewing user's tasks
    event.preventDefault();

    const userID = document.getElementById("insertUserId").value;
    const taskID = document.getElementById("insertTaskId").value;
    const frequency = document.getElementById("insertFrequency").value;
    const details = document.getElementById("insertDetails").value;

    const response = await fetch("/insert-user-task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            userID: userID, 
            taskID: taskID, 
            frequency: frequency,
            details: details})
    });

    const data = await response.json();
    const msg = document.getElementById("insertResultMsg");

    if (data.success) {
        msg.textContent = "Task inserted and assigned successfully!";
        fetchAndDisplayTasks();
    } else {
        msg.textContent = "Error inserting task.";
    }
}

document.getElementById("searchUserForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const userID = document.getElementById("searchUserId").value;
    const firstName = document.getElementById("searchFirstName").value;
    const lastName = document.getElementById("searchLastName").value;
    const params = new URLSearchParams({ // concatnates user's params into url string
        userID,
        firstName,
        lastName
    });
    const response = await fetch(`/search-user?${params.toString()}`); // fetching inputted data
    const data = await response.json();
    const tableBody = document.getElementById("searchResultsTable").querySelector("tbody");
    
    tableBody.innerHTML = ''; // for clearing prev output
    if (data.length === 0) {
        document.getElementById("searchResultMsg").textContent = "No results found.";
        return;
    }
    document.getElementById("searchResultMsg").textContent = "";
    data.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });
    });
});


async function populateAppUsers() {
    const response = await fetch("/populate-appusers", {
        method: 'POST'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('populateResultMsg');

    if (responseData.success) {
        messageElement.textContent = "AppUser table populated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error populating table.";
    }
}

async function populateTasks() {
    const response = await fetch("/populate-tasks", {
        method: 'POST'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('populateResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Tasks table populated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error populating table.";
    }
}


// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
// async function countDemotable() {
//     const response = await fetch("/count-demotable", {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const messageElement = document.getElementById('countResultMsg');

//     if (responseData.success) {
//         const tupleCount = responseData.count;
//         messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
//     } else {
//         alert("Error in count demotable!");
//     }
// }

async function countAppUsers() {
    const response = await fetch("/count-appusers", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of users: ${tupleCount}`;
    } else {
        alert("Error in count users!");
    }
}


//plantlog related async

async function fetchAndDisplayPlantLog() {
    console.log('Fetching plantlog');
    const tableElement = document.getElementById('plantLogTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/plantlog', {
        method: 'GET'
    });

    const responseData = await response.json();
    const plantLogData = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    plantLogData.forEach(row => {
        const tr = tableBody.insertRow();
        row.forEach((cellData) => {
            const td = tr.insertCell();
            if (cellData instanceof Date) {
                td.textContent = cellData.toISOString().split('T')[0]; // format dates
            } else {
                td.textContent = cellData;
            }
        });
    });
}

// end of plantlog related

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    fetchAndDisplayTasks();
    fetchAndDisplayUsers();
    fetchAndDisplayPlants();
    //plantlog
    fetchAndDisplayPlantLog();
    //end of plantlog
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("resetAppUsers").addEventListener("click", resetAppUsers);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("insertAppUser").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("countAppUsers").addEventListener("click", countAppUsers);
    document.getElementById("populateAppUsers").addEventListener("click", populateAppUsers);
    document.getElementById("populateTasks").addEventListener("click", populateTasks);
    // document.getElementById("insertTask").addEventListener("submit", insertTasks);
    document.getElementById("resetTasks").addEventListener("click", resetTasks);
    document.getElementById("insertUserTask").addEventListener("submit", insertUserTask);
    document.getElementById("insertPlantForm").addEventListener("submit", insertPlant);
    document.getElementById("deleteUser").addEventListener("submit", deleteAppUser);
    document.getElementById("showUserTasksForm").addEventListener("submit", function(event) {
        event.preventDefault(); // to prevent reloading page upon submitting 
        fetchUserTasks();
    });
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
