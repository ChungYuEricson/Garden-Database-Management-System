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


async function fetchAndDisplayGardenLog() {
    console.log('Fetching gardenlog');
    const tableElement = document.getElementById('gardenLogTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/gardenlog', {
        method: 'GET'
    });

    const responseData = await response.json();
    const gardenLogData = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    gardenLogData.forEach(row => {
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

    const plantLogID = parseInt(document.getElementById('plantLogID').value);
    const soilID = document.getElementById('soilID').value || null;
    const growth = document.getElementById('growth').value || null;
    const harvestDate = document.getElementById('harvestDate').value || null;

    const response = await fetch('/insert-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantID, species, plantName, plantLogID,
            soilID: soilID ? parseInt(soilID) : null,
            growth,
            harvestDate})
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

async function countAppUsersFrequency() {
    const response = await fetch(`/count-AppUsersFrequency`);
    const responseData = await response.json();

    if (responseData.success) {
        // const tupleCount = responseData.count;
        // messageElement.textContent = `The number of users: ${tupleCount}`;
        const tbody = document.querySelector('#frequencyTable tbody');
        tbody.innerHTML = responseData.freqTable
            .map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`)
            .join('');
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

async function deletePlant(event) {
    event.preventDefault();

    const plantID = document.getElementById('deletePlantID').value;
    const species = document.getElementById('deleteSpecies').value;

    const response = await fetch('/delete-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantID, species })
    });

    const result = await response.json();
    const msg = document.getElementById('deletePlantMsg');
    msg.textContent = result.success ? "Plant deleted!" : "Error deleting plant.";

    if (result.success) {
        fetchAndDisplayPlants();
        fetchAndDisplayPlantLog();
    }
}

async function populateDropdowns() {
    // Populate species dropdown
    const speciesSelect = document.getElementById('species');
    const speciesRes = await fetch('/species-options');
    const speciesData = await speciesRes.json();
    speciesData.data.forEach(([species]) => {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        speciesSelect.appendChild(option);
    });

    // Populate soil ID dropdown
    const soilSelect = document.getElementById('soilID');
    const soilRes = await fetch('/soil-options');
    const soilData = await soilRes.json();
    soilData.data.forEach(([soilID, soilType]) => {
        const option = document.createElement('option');
        option.value = soilID;
        option.textContent = `${soilID} (${soilType})`;
        soilSelect.appendChild(option);
    });
}

async function populateUpdatePlantDropdown() {
    const select = document.getElementById('updatePlantID');
    const res = await fetch('/plants');
    const data = await res.json();

    data.data.forEach(([plantID, species, plantName]) => {
        const option = document.createElement('option');
        option.value = plantID;
        option.textContent = `${plantID} – ${plantName} (${species})`;
        select.appendChild(option);
    });
}

async function updatePlantGrowth(event) {
    event.preventDefault();

    const plantID = document.getElementById('updatePlantID').value;
    const newGrowth = document.getElementById('newGrowth').value;

    const res = await fetch('/update-plant-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantID, newGrowth })
    });

    const result = await res.json();
    const msg = document.getElementById('updatePlantGrowthMsg');
    msg.textContent = result.success ? "Growth updated successfully!" : "Failed to update growth.";

    if (result.success) {
        fetchAndDisplayPlantLog();
    }
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
    populateDropdowns();
    populateUpdatePlantDropdown();
    fetchAndDisplayGardenLog();
    //plantlog
    fetchAndDisplayPlantLog();
    document.getElementById("deletePlantForm").addEventListener("submit", deletePlant);
    //end of plantlog
    document.getElementById("resetAppUsers").addEventListener("click", resetAppUsers);
    document.getElementById("insertAppUser").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countAppUsers").addEventListener("click", countAppUsers);
    document.getElementById("countAppUsersFrequency").addEventListener("click", countAppUsersFrequency);
    // document.getElementById("populateAppUsers").addEventListener("click", populateAppUsers);
    document.getElementById("populateTasks").addEventListener("click", populateTasks);
    document.getElementById("resetTasks").addEventListener("click", resetTasks);
    document.getElementById("insertUserTask").addEventListener("submit", insertUserTask);
    document.getElementById("insertPlantForm").addEventListener("submit", insertPlant);
    document.getElementById("updatePlantGrowthForm").addEventListener("submit", updatePlantGrowth);
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
