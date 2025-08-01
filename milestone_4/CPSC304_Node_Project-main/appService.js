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

// async function fetchDemotableFromDb() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT * FROM DEMOTABLE');
//         return result.rows;
//     }).catch(() => {
//         return [];
//     });
// }

async function fetchAppUsersFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM AppUser');
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

// async function initiateDemotable() {
//     return await withOracleDB(async (connection) => {
//         try {
//             await connection.execute(`DROP TABLE DEMOTABLE`);
//         } catch(err) {
//             console.log('Table might not exist, proceeding to create...');
//         }

//         const result = await connection.execute(`
//             CREATE TABLE DEMOTABLE (
//                 id NUMBER PRIMARY KEY,
//                 name VARCHAR2(20)
//             )
//         `);
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

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
            `SELECT t.taskID, t.frequency
             FROM Tasks t
             JOIN User_HAS_Task uht ON t.taskID = uht.taskID
             WHERE uht.userID = :userID`,
            [userID] // binds :userID ; ORA-1008
        );

        const tasks = result.rows.map(row => ({
            taskID: row[0],
            frequency: row[1]
        }));

        return { success: true, tasks };
    }).catch((err) => {
        console.error("getUserTasks error:", err);
        return { success: false };
    });
}


async function populateAppUsers() {
    const users = [
        [1, 'Ericson', 'Ho'],
        [2, 'Justin', 'Galimpin'],
        [3, 'Jacky', 'Wang'],
        [4, 'John', 'Doe'],
        [5, 'Michael', 'Jordan'],
        [6, 'Bob', 'Smith'],
        [7, 'Lebron', 'James'],
        [8, 'Kevin', 'Levin'],
        [9, 'Tom', 'Cruise'],
        [10, 'Jackie', 'Chan']
    ];
    
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
        for (const [taskID, frequency] of tasks) {
            try {
                await connection.execute(
                    `INSERT INTO Tasks (taskID, frequency) VALUES (:taskID, :frequency)`,
                    [taskID, frequency],
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


// async function insertDemotable(id, name) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
//             [id, name],
//             { autoCommit: true }
//         );

//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

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

async function insertTask(taskID, frequency) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Tasks (taskID, frequency) VALUES (:taskID, :frequency)`,
            [taskID, frequency],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertUserTask(userID, taskID, frequency) {
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
                `INSERT INTO Tasks (taskID, frequency) VALUES (:taskID, :frequency)`,
                [taskID, frequency],
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

// async function countDemotable() {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
//         return result.rows[0][0];
//     }).catch(() => {
//         return -1;
//     });
// }

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
    insertUserTask
};