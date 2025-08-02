const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchAppUsersFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM AppUser');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchPlantsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Plant');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchTasksFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Tasks');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateAppUsers() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE AppUser CASCADE CONSTRAINTS PURGE`); // need to purge existing table for reset to occur
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE AppUser (
                userID INTEGER,
	            firstName VARCHAR(20),
	            lastName VARCHAR(20),
	            PRIMARY KEY (userID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function initiateTasks() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Tasks CASCADE CONSTRAINTS PURGE`); // need to purge existing table for reset to occur
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Tasks (
                taskID INTEGER,
                frequency VARCHAR(20),
                details VARCHAR(20),
                PRIMARY KEY (taskID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function getUserTasks(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT t.taskID, t.frequency, t.details
             FROM Tasks t
             JOIN User_HAS_Task uht ON t.taskID = uht.taskID
             WHERE uht.userID = :userID`,
            [userID] // binds :userID ; ORA-1008
        );

        const tasks = result.rows.map(row => ({
            taskID: row[0],
            frequency: row[1],
            details:   row[2]
        }));

        return { success: true, tasks };
    }).catch((err) => {
        console.error("getUserTasks error:", err);
        return { success: false };
    });
}


async function populateAppUsers() {
    return await withOracleDB(async (connection) => {
        for (const [userID, firstName, lastName] of users) {
            try {
                await connection.execute(
                    `INSERT INTO AppUser (userID, firstName, lastName) VALUES (:userID, :firstName, :lastName)`,
                    [userID, firstName, lastName],
                    { autoCommit: true }
                );
            } catch (err) { // for when there is an existing userID
                if (err.errorNum === 1) {
                    continue;
                } else {
                    console.error(err);
                    throw err;
                }
            }
        }
        return true;
    }).catch(() => {
        return false;
    });
}

async function populateTasks() {
    const tasks = [
        [101, 'Daily'],
        [102, 'Weekly'],
        [103, 'Biweekly'],
        [104, 'Monthly'],
        [105, 'Annually'],
    ];

    return await withOracleDB(async (connection) => {
        for (const [taskID, frequency, details] of tasks) {
            try {
                await connection.execute(
                    `INSERT INTO Tasks (taskID, frequency, details) VALUES (:taskID, :frequency, :details)`,
                    {taskID, frequency, details}, //named object again
                    { autoCommit: true }
                );
            } catch (err) { // for when there is an existing Task
                if (err.errorNum === 1) {
                    continue;
                } else {
                    console.error(err);
                    throw err;
                }
            }
        }
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertAppUser(userID, firstName, lastName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO AppUser (userID, firstName, lastName) VALUES (:userID, :firstName, :lastName)`,
            [userID, firstName, lastName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertPlant(plantID, species, plantName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Plant (plantID, species, plantName) VALUES (:plantID, :species, :plantName)`,
            { plantID, species, plantName },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertTask(taskID, frequency, details) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Tasks (taskID, frequency, details) VALUES (:taskID, :frequency, :details)`,
            {taskID, frequency, details},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertUserTask(userID, taskID, frequency, details) {
    return await withOracleDB(async (connection) => {
        const existing = await connection.execute(
            `SELECT * FROM User_HAS_Task WHERE userID = :userID AND taskID = :taskID`,
            [userID, taskID]
        );

        if (existing.rows.length > 0) {
            throw new Error("User already assigned to this task.");
        }

        const taskExists = await connection.execute( // you dont want to insert an existing task or else error will happen
            `SELECT * FROM Tasks WHERE taskID = :taskID`,
            [taskID]
        );

        if (taskExists.rows.length === 0) {
            await connection.execute(
                `INSERT INTO Tasks (taskID, frequency, details) VALUES (:taskID, :frequency, :details)`,
                {taskID, frequency, details}, // named object; these objects have values
                { autoCommit: false }
            );
        }

        await connection.execute(
            `INSERT INTO User_HAS_Task (userID, taskID) VALUES (:userID, :taskID)`,
            [userID, taskID],
            { autoCommit: false }
        );

        await connection.commit();

        return true;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function searchUsers(filters) {
    return await withOracleDB(async (connection) => {
        const conditions = [];
        const bindVariable = {};
        if (filters.userID) {
            conditions.push("userID = :userID"); // filter the condition in ""; use to build sql's WHERE condition
            bindVariable.userID = parseInt(filters.userID);
        }
        if (filters.firstName) {
            conditions.push("LOWER(firstName) LIKE :firstName");
            bindVariable.firstName = `%${filters.firstName.toLowerCase()}%`;
        }
        if (filters.lastName) {
            conditions.push("LOWER(lastName) LIKE :lastName");
            bindVariable.lastName = `%${filters.lastName.toLowerCase()}%`;
        }
        const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
        const query = `SELECT * FROM AppUser ${where}`;
        const result = await connection.execute(query, bindVariable);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function countAppUsers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM AppUser');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


module.exports = {
    // fetchDemotableFromDb,
    //initiateDemotable,
    //insertDemotable, 
    // countDemotable,
    testOracleConnection,
    initiateAppUsers, 
    updateNameDemotable, 
    countAppUsers,
    fetchAppUsersFromDb,
    insertAppUser,
    populateAppUsers,
    fetchTasksFromDb,
    populateTasks,
    insertTask,
    initiateTasks,
    getUserTasks,
    insertUserTask,
    searchUsers,
    fetchPlantsFromDb,
    insertPlant,
};