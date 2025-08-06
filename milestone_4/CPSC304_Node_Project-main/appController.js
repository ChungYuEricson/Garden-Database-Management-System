const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/appusers', async (req, res) => {
    const tableContent = await appService.fetchAppUsersFromDb();
    res.json({data: tableContent});
});

router.get('/tasks', async (req, res) => {
    const tableContent = await appService.fetchTasksFromDb();
    res.json({data: tableContent});
});

router.get('/plants', async (req, res) => {
    const tableContent = await appService.fetchPlantsFromDb();
    res.json({ data: tableContent });
});

router.get('/api/user-tasks/:userID', async (req, res) => {
    const userID = parseInt(req.params.userID);
    const result = await appService.getUserTasks(userID);
    res.json(result);
});

router.get('/soil-options', async (req, res) => {
    const options = await appService.fetchSoilOptions();
    res.json({ data: options });
});

router.get('/species-options', async (req, res) => {
    const options = await appService.fetchSpeciesOptions();
    res.json({ data: options });
});

router.post("/initiate-appusers", async (req, res) => {
    const initiateResult = await appService.initiateAppUsers();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-tasks", async (req, res) => {
    const initiateResult = await appService.initiateTasks();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// router.post("/populate-appusers", async (req, res) => {
//     const populateResult = await appService.populateAppUsers();
//     if (populateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

router.post("/populate-tasks", async (req, res) => {
    const populateResult = await appService.populateTasks();
    if (populateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/populate-plants", async (req, res) => {
    const result = await appService.populatePlants();
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-appuser", async (req, res) => {
    const { userID, firstName, lastName } = req.body;
    const insertResult = await appService.insertAppUser(userID, firstName, lastName);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-task", async (req, res) => {
    const { taskID, frequency, details } = req.body;
    const insertResult = await appService.insertTask(taskID, frequency, details);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-plant", async (req, res) => {
    const { plantID, species, plantName, plantLogID, soilID, growth, harvestDate} = req.body;
    const insertResult = await appService.insertPlant(plantID, species, plantName, plantLogID, soilID, growth, harvestDate);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-user-task", async (req, res) => {
    const { userID, taskID, frequency, details } = req.body;
    const insertResult = await appService.insertUserTask(userID, taskID, frequency, details);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldFirstName, oldLastName , newFirstName, newLastName} = req.body;
    const updateResult = await appService.updateNameDemotable(oldFirstName, oldLastName, newFirstName, newLastName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// delete user
router.post("/delete-appuser", async (req, res) => {
    const { userID } = req.body;
    const updateResult = await appService.deleteUser(userID);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/search-user', async (req, res) => {
    const { userID, firstName, lastName } = req.query;
    const users = await appService.searchUsers({userID, firstName, lastName});
    res.json(users);
});

router.get('/count-appusers', async (req, res) => {
    const tableCount = await appService.countAppUsers();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

router.get('/count-AppUsersFrequency', async (req, res) => {
    const freqTable = await appService.countAppUsersFrequency();
    if (Array.isArray(freqTable)) {
        res.json({ 
            success: true,  
            freqTable
        });
    } else {
        res.status(500).json({ 
            success: false, 
            freqTable: []
        });
    }
});

router.post("/initiate-gardenlog", async (req, res) => {
    const initiateResult = await appService.initiateGardenLog();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/gardenlog', async (req, res) => {
    const tableContent = await appService.fetchGardenLogFromDb();
    res.json({ data: tableContent });
});


// plantlog related router

router.post("/initiate-plantlog", async (req, res) => {
    const initiateResult = await appService.initiatePlantLog();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/plantlog', async (req, res) => {
    const tableContent = await appService.fetchPlantLogFromDb();
    res.json({ data: tableContent });
});

router.post("/delete-plant", async (req, res) => {
    const { plantID, species } = req.body;
    const result = await appService.deletePlant(plantID, species);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-plant-growth", async (req, res) => {
    const { plantID, newGrowth } = req.body;
    const result = await appService.updatePlantGrowth(plantID, newGrowth);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-plant-soil', async (req, res) => {
    const { plantID, soilID } = req.body;
    const success = await appService.updatePlantSoil(plantID, soilID);
    res.json({ success });
});

router.get('/search-plant', async (req, res) => {
    const {
        plantID,
        species,
        plantName,
        growth,
        familyID,
        harvestable,
        prefEnvironment
    } = req.query;

    const plants = await appService.searchPlants({
        plantID,
        species,
        plantName,
        growth,
        familyID,
        harvestable,
        prefEnvironment
    });

    res.json(plants);
});

// end of plantlog related router

router.get("/average-tasks-nested", async (req, res) => {
    const minTasks = parseInt(req.query.minTasks);
    const result = await appService.getAverageTasksForActiveUsers(minTasks);
    if (result !== null) {
        res.json({ success: true, avg: result.avg, users: result.users });
    } else {
        res.status(500).json({ success: false });
    }
});

// count plant by species
router.get('/count-plant-species', async (req, res) => {
    const data = await appService.countPlantsBySpecies();
    if (!data) {
        console.error("Error in /count-plant-species");
        return res.status(500).json([]);
    }
    res.json(data);
});

// Projection Routes

router.get('/all-tables', async (req, res) => {
    const tables = await appService.fetchAllTableNames();
    res.json({ data: tables });
});

router.get('/table-columns/:tableName', async (req, res) => {
    const columns = await appService.fetchColumnsForTable(req.params.tableName);
    res.json({ data: columns });
});

router.post('/project', async (req, res) => {
    const { table, columns } = req.body;
    const result = await appService.runProjection(table, columns);
    res.json({ data: result });
});

router.get("/plants-on-all-soils", async (req, res) => {
    try {
        const data = await appService.findPlantsOnAllSoilTypes();
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/species-count-having", async (req, res) => {
  const threshold = parseInt(req.query.threshold);
  const result = await appService.getSpeciesHavingMoreThan(threshold);
  res.json(result);
});


router.get("/species-count-having", async (req, res) => {
    const threshold = parseInt(req.query.threshold);
    const result = await appService.getSpeciesHavingMoreThan(threshold);
    res.json(result);
});



router.post("/update-plant-details", async (req, res) => {
    const { plantID, newGrowth, soilID, harvestDate } = req.body;

    try {
        if (!plantID) return res.status(400).json({ success: false, message: "Missing plantID" });

        if (newGrowth) {
            await appService.updatePlantGrowth(plantID, newGrowth);
        }

        if (soilID) {
            await appService.updatePlantSoil(plantID, soilID);
        }

        if (harvestDate) {
            await appService.updatePlantHarvestDate(plantID, harvestDate);
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});


module.exports = router;