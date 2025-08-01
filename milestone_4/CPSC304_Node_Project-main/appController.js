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

router.get('/api/user-tasks/:userID', async (req, res) => {
    const userID = parseInt(req.params.userID);
    const result = await appService.getUserTasks(userID);
    res.json(result);
});

// router.post("/initiate-demotable", async (req, res) => {
//     const initiateResult = await appService.initiateDemotable();
//     if (initiateResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

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


// router.post("/insert-demotable", async (req, res) => {
//     const { id, name } = req.body;
//     const insertResult = await appService.insertDemotable(id, name);
//     if (insertResult) {
//         res.json({ success: true });
//     } else {
//         res.status(500).json({ success: false });
//     }
// });

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


module.exports = router;