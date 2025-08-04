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

// router.get('/demotable', async (req, res) => {
//     const tableContent = await appService.fetchDemotableFromDb();
//     res.json({data: tableContent});
// });

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

router.post("/populate-appusers", async (req, res) => {
    const populateResult = await appService.populateAppUsers();
    if (populateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

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
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
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

// router.get('/count-demotable', async (req, res) => {
//     const tableCount = await appService.countDemotable();
//     if (tableCount >= 0) {
//         res.json({ 
//             success: true,  
//             count: tableCount
//         });
//     } else {
//         res.status(500).json({ 
//             success: false, 
//             count: tableCount
//         });
//     }
// });

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


// end of plantlog related router

module.exports = router;