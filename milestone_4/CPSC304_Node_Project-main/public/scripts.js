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
    const species = document.getElementById('insertSpecies').value;
    const plantName = document.getElementById('plantName').value;

    const plantLogID = parseInt(document.getElementById('plantLogID').value);
    const soilID = document.getElementById('soilID').value || null;
    const growth = document.getElementById('insertGrowth').value || null;
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
    const msg = document.getElementById("insertTaskMsg");

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


// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldFirstName = document.getElementById('updateOldFirstName').value;
    const oldLastName = document.getElementById('updateOldLastName').value;
    const newFirstName = document.getElementById('updateNewFirstName').value;
    const newLastName = document.getElementById('updateNewLastName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldFirstName: oldFirstName,
            oldLastName: oldLastName,
            newFirstName: newFirstName,
            newLastName: newLastName
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

async function countPlantsBySpecies() {
    const response = await fetch('/count-plant-species');
    const data = await response.json();

    const msg = document.getElementById('plantSpeciesCountMsg');
    const tbody = document.getElementById('plantSpeciesCountTable').querySelector('tbody');

    tbody.innerHTML = '';

    if (!data) {
        msg.textContent = 'No species have more than 2 plants.';
        return;
    }

    msg.textContent = '';

    data.forEach(([species, count]) => {
        const row = tbody.insertRow();
        const speciesCell = row.insertCell();
        const countCell = row.insertCell();
        speciesCell.textContent = species;
        countCell.textContent = count;
    });
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
    const speciesRes = await fetch('/species-options');
    const speciesData = await speciesRes.json();

    // Populate species dropdown
    const speciesSelect = document.getElementById('species');
    const speciesInsert = document.getElementById('insertSpecies');

    speciesData.data.forEach(([species]) => {
        const option = document.createElement('option');
        option.value = species;
        option.textContent = species;
        speciesSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = species;
        option2.textContent = species;
        speciesInsert.appendChild(option2);
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

    // Populate growth dropdown
    const growthRes  = await fetch('/growth-options');   // <-- backend route you added
    const growthData = await growthRes.json();

    const growthSelect = document.getElementById('growth');
    growthSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());

    growthData.data.forEach(([stage]) => {
    const opt = document.createElement('option');
    opt.value = stage;
    opt.textContent = stage;
    growthSelect.appendChild(opt);
  });
}

async function populateUpdatePlantDropdown() {
    const plantRes = await fetch('/plants');
    const data = await plantRes.json();

    const plantOptions = data.data.map(([plantID, species, plantName]) => {
        const option = document.createElement('option');
        option.value = plantID;
        option.textContent = `${plantID} – ${plantName} (${species})`;
        return option;
    });

    const plantSelects = [
        document.getElementById('updatePlantID'),      // existing growth updater
        document.getElementById('updateSoilPlantID')   // new soil updater
    ];

    plantSelects.forEach(select => {
        if (select) {
            plantOptions.forEach(opt => select.appendChild(opt.cloneNode(true)));
        }
    });
}

async function populateSoilDropdown() {
    const res = await fetch('/soil-options');
    const data = await res.json();

    const soilSelect = document.getElementById('updatedSoilID');
    data.data.forEach(([soilID, soilType]) => {
        const option = document.createElement('option');
        option.value = soilID;
        option.textContent = `${soilID} (${soilType})`;
        soilSelect.appendChild(option);
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

async function updatePlantSoil(event) {
    event.preventDefault();

    const plantID = document.getElementById('updateSoilPlantID').value;
    const soilID = document.getElementById('updatedSoilID').value;

    const res = await fetch('/update-plant-soil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantID, soilID })
    });

    const result = await res.json();
    const msg = document.getElementById('updatePlantSoilMsg');
    msg.textContent = result.success ? "Soil updated successfully!" : "Failed to update soil.";

    if (result.success) {
        fetchAndDisplayPlantLog();
    }
}
function setupSpeciesThresholdForm() {
  const form = document.getElementById("speciesThresholdForm");
  if (!form) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const threshold = document.getElementById("plantThreshold").value;

    const res = await fetch(`/species-count-having?threshold=${threshold}`);
    const data = await res.json();

    const tableBody = document.querySelector("#speciesResultsTable tbody");
    tableBody.innerHTML = ""; // Clear previous results

    if (data.length === 0) {
      document.getElementById("speciesResultsMsg").textContent = "No species found.";
      return;
    }

    data.forEach(row => {
      const tr = document.createElement("tr");
      const speciesCell = document.createElement("td");
      const countCell = document.createElement("td");
      speciesCell.textContent = row[0];
      countCell.textContent = row[1];
      tr.appendChild(speciesCell);
      tr.appendChild(countCell);
      tableBody.appendChild(tr);
    });
  });
}

document.getElementById("searchPlantForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const plantID = document.getElementById("searchPlantID").value;
    const species = document.getElementById("species").value;
    const plantName = document.getElementById("searchPlantName").value;
    const growth = document.getElementById("growth").value;
    const harvestable = document.getElementById("searchHarvestable").value;
    const prefEnvironment = document.getElementById("prefEnvironment").value;

    const params = new URLSearchParams({
        plantID,
        species,
        plantName,
        growth,
        harvestable,
        prefEnvironment
    });

    const response = await fetch(`/search-plant?${params.toString()}`);
    const data = await response.json();

    const tableBody = document.getElementById("searchPlantResultsTable").querySelector("tbody");
    tableBody.innerHTML = '';

    if (data.length === 0) {
        document.getElementById("searchPlantResultMsg").textContent = "No results found.";
        return;
    }

    document.getElementById("searchPlantResultMsg").textContent = "";

    data.forEach(plant => {
        const row = tableBody.insertRow();
        for (const key in plant) {
            const cell = row.insertCell();
            cell.textContent = plant[key];
        }
    });
});


// end of plantlog related

async function fetchAvgTasks(event) {
    event.preventDefault();
    const minTasks = document.getElementById("minTasks").value;
    const res = await fetch(`/average-tasks-nested?minTasks=${minTasks}`);
    const msg = document.getElementById("avgTasksResultMsg");
    const table = document.getElementById("avgTasksUserTable");
    const tbody = table.querySelector("tbody");

    try {
        const data = await res.json();
        if (data.success) {
            msg.textContent = `Average tasks for users with more than ${minTasks} tasks: ${data.avg.toFixed(2)}`;

            // Populate table
            tbody.innerHTML = '';
            data.users.forEach(user => {
                const row = tbody.insertRow();
                const cell1 = row.insertCell();
                const cell2 = row.insertCell();
                cell1.textContent = user.USERID;
                cell2.textContent = user.TASK_COUNT;
            });

            table.style.display = data.users.length > 0 ? "table" : "none";
        } else {
            msg.textContent = "Error fetching average.";
            table.style.display = "none";
        }
    } catch (err) {
        msg.textContent = "Failed to parse response.";
        table.style.display = "none";
        console.error(err);
    }
}

function updatePlantDetailsForm() {
    const form = document.getElementById("updatePlantDetailsForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const plantID = document.getElementById('updatePlantID').value;
        const newGrowth = document.getElementById('newGrowth').value;
        const soilID = document.getElementById('updatedSoilID').value;
        const harvestDate = document.getElementById('updatedHarvestDate').value;

        if (!plantID) return;

        const res = await fetch('/update-plant-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plantID, newGrowth, soilID, harvestDate})
        });

        const result = await res.json();
        const msg = document.getElementById('updatePlantMsg');
        if (msg) {
            msg.textContent = result.success ? "Plant updated!" : "Update failed.";
        }

        if (result.success) {
            fetchAndDisplayPlantLog();
        }
    });
}

async function fetchPlantsOnAllSoils() {
  const res = await fetch('/plants-on-all-soils');
  const data = await res.json();

  const tableBody = document.querySelector('#allSoilResults tbody');
  tableBody.innerHTML = '';

  if (data.data.length > 0) {
    data.data.forEach(plantID => {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = plantID;
      row.appendChild(cell);
      tableBody.appendChild(row);
    });

    document.getElementById('allSoilResultMsg').textContent = `Found ${data.data.length} plant(s).`;
  } else {
    document.getElementById('allSoilResultMsg').textContent = "No plants found on all soil types.";
  }

  document.getElementById('allSoilResultContainer').style.display = 'block';
}

// Projection Functions
async function initProjectionForm() {
    const tableSelect = document.getElementById('tableSelect');
    const columnSelect = document.getElementById('columnSelect');

    // Load table names
    const tableRes = await fetch('/all-tables');
    const tableData = await tableRes.json();

    const tables = tableData.data;
    tables.forEach(table => {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        tableSelect.appendChild(option);
    });

    // Load columns when table is selected
    tableSelect.addEventListener('change', async () => {
        const table = tableSelect.value.trim();
        console.log("Selected table:", table);

        columnSelect.innerHTML = ''; // Clear old options

        if (!table) return;

        const colRes = await fetch(`/table-columns/${table}`);
        const data = await colRes.json();
        console.log("Fetched columns:", data);

        const columns = data.data;

        columns.forEach(col => {
            const option = document.createElement('option');
            option.value = col;
            option.textContent = col;
            columnSelect.appendChild(option);
        });
    });

    // Submit projection form
    document.getElementById('projectionForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const table = tableSelect.value;
        const selectedCols = [...columnSelect.selectedOptions].map(opt => opt.value);

        if (selectedCols.length === 0) {
            document.getElementById('projectionResultMsg').textContent = "Please select at least one attribute.";
            return;
        }

        const res = await fetch('/project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table, columns: selectedCols })
        });

        const data = await res.json();
        renderProjectionResults(selectedCols, data.data);
    });
}

function renderProjectionResults(columns, rows) {
    const thead = document.querySelector('#projectionTable thead tr');
    const tbody = document.querySelector('#projectionTable tbody');
    const msg = document.getElementById('projectionResultMsg');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Create column headers
    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        thead.appendChild(th);
    });

    // Populate rows
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    msg.textContent = `${rows.length} row(s) returned.`;
}

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
    populateSoilDropdown();
    fetchAndDisplayGardenLog();
    updatePlantDetailsForm();
    setupSpeciesThresholdForm();		
    //plantlog
    fetchAndDisplayPlantLog();
    document.getElementById("findSpeciesButton").addEventListener("click", fetchPlantsOnAllSoils);
    document.getElementById("deletePlantForm").addEventListener("submit", deletePlant);
    //end of plantlog
    document.getElementById("insertAppUser").addEventListener("submit", insertDemotable);
    document.getElementById("updateNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countAppUsers").addEventListener("click", countAppUsers);
    document.getElementById("countAppUsersFrequency").addEventListener("click", countAppUsersFrequency);
    document.getElementById("insertUserTask").addEventListener("submit", insertUserTask);
    document.getElementById("insertPlantForm").addEventListener("submit", insertPlant);
    document.getElementById("deleteUser").addEventListener("submit", deleteAppUser);
    document.getElementById("avgTasksForm").addEventListener("submit", fetchAvgTasks);
    document.getElementById("showUserTasksForm").addEventListener("submit", function(event) {
        event.preventDefault(); // to prevent reloading page upon submitting 
        fetchUserTasks();
    });
    initProjectionForm();
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}
