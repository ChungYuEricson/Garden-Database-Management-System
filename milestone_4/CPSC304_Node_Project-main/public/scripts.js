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

// Fetches data from the demotable and displays it.
// async function fetchAndDisplayUsers() {
//     const tableElement = document.getElementById('demotable');
//     const tableBody = tableElement.querySelector('tbody');

//     const response = await fetch('/demotable', {
//         method: 'GET'
//     });

//     const responseData = await response.json();
//     const demotableContent = responseData.data;

//     // Always clear old, already fetched data before new fetching process.
//     if (tableBody) {
//         tableBody.innerHTML = '';
//     }

//     demotableContent.forEach(user => {
//         const row = tableBody.insertRow();
//         user.forEach((field, index) => {
//             const cell = row.insertCell(index);
//             cell.textContent = field;
//         });
//     });
// }

async function fetchAndDisplayUsers() {
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

async function insertTasks(event) {
    event.preventDefault();

    const taskID = document.getElementById('insertTaskId').value;
    const frequency = document.getElementById('insertFrequency').value;

    const response = await fetch('/insert-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taskID: taskID,
            frequency: frequency
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


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    fetchAndDisplayTasks();
    // document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("resetAppUsers").addEventListener("click", resetAppUsers);
    // document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("insertAppUser").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    // document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("countAppUsers").addEventListener("click", countAppUsers);
    document.getElementById("populateAppUsers").addEventListener("click", populateAppUsers);
    document.getElementById("populateTasks").addEventListener("click", populateTasks);
    document.getElementById("insertTask").addEventListener("submit", insertTasks);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
