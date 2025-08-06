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


// async function populateAppUsers() {
//     return await withOracleDB(async (connection) => {
//         for (const [userID, firstName, lastName] of users) {
//             try {
//                 await connection.execute(
//                     `INSERT INTO AppUser (userID, firstName, lastName) VALUES (:userID, :firstName, :lastName)`,
//                     [userID, firstName, lastName],
//                     { autoCommit: true }
//                 );
//             } catch (err) { // for when there is an existing userID
//                 if (err.errorNum === 1) {
//                     continue;
//                 } else {
//                     console.error(err);
//                     throw err;
//                 }
//             }
//         }
//         return true;
//     }).catch(() => {
//         return false;
//     });
// }

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

async function insertPlant(plantID, species, plantName, plantLogID, soilID, growth, harvestDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Plant (plantID, species, plantName) VALUES (:plantID, :species, :plantName)`,
            { plantID, species, plantName },
            // { autoCommit: true }
        );
        await connection.execute(
                `INSERT INTO PlantLog (
                    plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate
                ) VALUES (
                    :plantLogID, :plantID, :species, :soilID, SYSDATE, :growth, TO_DATE(:harvestDate, 'YYYY-MM-DD')
                )`,
                {
                plantLogID,
                plantID,
                species,
                soilID,
                growth,
                harvestDate: harvestDate || null }
            );
            await connection.commit();
        
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

async function deleteUser(userID) {
    return await withOracleDB(async (connection) => {
        await connection.execute(
            `DELETE FROM User_HAS_TASK WHERE userID = :userID`,
            {userID},
        );

        await connection.execute( // remove all connections where user is gardener
            `DELETE FROM Garden_WORKS_Landplot WHERE userID = :userID or landID IN 
            (SELECT landID FROM Landplot WHERE userID = :userID)`,
            {userID},
        );

        await connection.execute(
            `DELETE FROM Landplot_HAS_GardenType WHERE landID IN 
            (SELECT landID FROM Landplot where userID = :userID)`,
            {userID},
        );

        await connection.execute(
            `DELETE FROM Landplot WHERE userID = :userID`,
            {userID},
        );

        const result = await connection.execute(
            `DELETE FROM AppUser WHERE userID = :userID`,
            {userID},
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldFirstName, oldLastName, newFirstName, newLastName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE AppUser 
             SET firstName=:newFirstName, lastName=:newLastName
             WHERE firstName=:oldFirstName AND lastName=:oldLastName`,
            {oldFirstName, oldLastName, newFirstName, newLastName},
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

async function countAppUsersFrequency() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT LOWER(Tasks.frequency), COUNT(*) AS USER_COUNT 
             FROM Tasks 
             JOIN User_HAS_Task uht ON Tasks.taskID = uht.taskID 
             GROUP BY LOWER(Tasks.frequency) 
             ORDER BY LOWER(Tasks.frequency)`,
             []
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}


async function initiateGardenLog() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE GardenLog CASCADE CONSTRAINTS PURGE`); // need to purge existing table for reset to occur
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE GardenLog (
                gardenLogID INTEGER,
                gardenID INTEGER NOT NULL,
                weather VARCHAR(20),
                monthlyAvgTemp FLOAT,
                controlledTemp FLOAT,
                PRIMARY KEY (gardenLogID),
                UNIQUE (gardenID),
                FOREIGN KEY (gardenID) REFERENCES GardenType(gardenID)
                    ON DELETE CASCADE
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchGardenLogFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM GardenLog ORDER BY gardenLogID ASC',
            [],
            { outFormat: oracledb.OUT_FORMAT_ARRAY });
        return result.rows;
    }).catch(() => {
        return [];
    });
}

//plant related async

async function initiatePlantLog() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE PlantLog CASCADE CONSTRAINTS PURGE`); // need to purge existing table for reset to occur
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE PlantLog (
                plantLogID INTEGER,
                plantID INTEGER,
                species VARCHAR(20) NOT NULL,
                soilID INTEGER,
                datePlanted DATE NOT NULL,
                growth VARCHAR(20),
                harvestDate DATE,
                PRIMARY KEY (plantLogID),
                FOREIGN KEY (plantID, species) REFERENCES Plant(plantID, species),
                FOREIGN KEY (soilID) REFERENCES Soil(soilID)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchPlantLogFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM PlantLog ORDER BY plantLogID ASC',
            [],
            { outFormat: oracledb.OUT_FORMAT_ARRAY });
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchSoilOptions() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT soilID, soilType FROM Soil ORDER BY soilID');
        return result.rows; 
    }).catch(() => []);
}

async function fetchSpeciesOptions() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT species FROM PlantInfo ORDER BY species');
        return result.rows;
    }).catch(() => []);
}

async function deletePlant(plantID, species) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Plant WHERE plantID = :plantID AND species = :species`,
            { plantID, species },
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error deleting plant:", err);
        return false;
    });
}

async function updatePlantGrowth(plantID, newGrowth) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE PlantLog SET growth = :newGrowth WHERE plantID = :plantID`,
            { plantID, newGrowth },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error("Error updating plant growth:", err);
        return false;
    });
}


async function searchPlants(filters) {
    return await withOracleDB(async (connection) => {
        const conditions = [];
        const bindVariable = {};

        if (filters.plantID) {
            conditions.push("P.plantID = :plantID");
            bindVariable.plantID = parseInt(filters.plantID);
        }

        if (filters.species) {
            conditions.push("LOWER(P.species) LIKE :species");
            bindVariable.species = `%${filters.species.toLowerCase()}%`;
        }

        if (filters.plantName) {
            conditions.push("LOWER(P.plantName) LIKE :plantName");
            bindVariable.plantName = `%${filters.plantName.toLowerCase()}%`;
        }

        if (filters.growth) {
            conditions.push("LOWER(PL.growth) = :growth");
            bindVariable.growth = filters.growth.toLowerCase();
        }

        if (filters.familyID) {
            conditions.push("PF.familyID = :familyID");
            bindVariable.familyID = parseInt(filters.familyID);
        }

        if (filters.harvestable) {
            conditions.push("ST.harvestable = :harvestable");
            bindVariable.harvestable = parseInt(filters.harvestable);
        }

        if (filters.prefEnvironment) {
            conditions.push("LOWER(PI.prefEnvironment) = :prefEnvironment");
            bindVariable.prefEnvironment = filters.prefEnvironment.toLowerCase();
        }

        const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

        const query = `
            SELECT
                P.plantID,
                P.plantName,
                P.species,
                PF.familyID,
                PF.floralStructure,
                ST.seedType,
                ST.harvestable,
                PI.prefEnvironment,
                PL.plantLogID,
                PL.datePlanted,
                PL.growth,
                PL.harvestDate,
                PL.soilID
            FROM PlantLog PL
            JOIN Plant P ON PL.plantID = P.plantID AND PL.species = P.species
            JOIN PlantInfo PI ON P.species = PI.species
            JOIN PlantFamily PF ON PI.familyID = PF.familyID
            JOIN SeedType ST ON PF.seedType = ST.seedType
            ${where}
            ORDER BY PL.plantLogID ASC
        `;

        const result = await connection.execute(query, bindVariable, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result.rows;
    }).catch((err) => {
        console.error("Error searching plants:", err);
        return [];
    });
}


// end of plantlog

// Nested Aggregation GROUP BY
async function getAverageTasksForActiveUsers(minTasks) {
    return await withOracleDB(async (connection) => {
        const qualifyingUsersResult = await connection.execute(
            `
            SELECT userID, COUNT(*) AS task_count
            FROM User_HAS_Task
            GROUP BY userID
            HAVING COUNT(*) > :minTasks
            `,
            { minTasks },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const qualifyingUsers = qualifyingUsersResult.rows;

        const avgResult = await connection.execute(
            `
            SELECT AVG(task_count) AS avg_tasks_for_active_users
            FROM (
                SELECT userID, COUNT(*) AS task_count
                FROM User_HAS_Task
                WHERE userID IN (
                    SELECT userID
                    FROM User_HAS_Task
                    GROUP BY userID
                    HAVING COUNT(*) > :minTasks
                )
                GROUP BY userID
            )
            `,
            { minTasks },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return {
            avg: avgResult.rows[0].AVG_TASKS_FOR_ACTIVE_USERS,
            users: qualifyingUsers
        };
    }).catch((err) => {
        console.error("Error in nested aggregation query:", err);
        return false;
    });
}

// Projection Functions
async function fetchAllTableNames() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT table_name 
            FROM user_tables
            WHERE table_name NOT IN 
            ('AUTHORS', 'BOOKS', 'PUBLISHERS', 'TITLEAUTHOR', 'TITLES', 'EDITORS',
             'SALES', 'SALESDETAILS', 'TITLEDITORS', 'TITLEAUTHORS', 'DEMOTABLE', 'ROLLING')`);
        return result.rows.map(r => r[0]);
    }).catch(() => []);
}

async function fetchColumnsForTable(tableName) {
    const upperName = tableName.toUpperCase().trim();
    console.log("Fetching columns for table:", JSON.stringify(upperName));

    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT column_name FROM user_tab_columns WHERE table_name = :tbl`,  
                { tbl: upperName }  
            );
            console.log("Fetched columns:", result.rows);
            return result.rows.map(r => r[0]);
        } catch (err) {
            console.error("Oracle error in fetchColumnsForTable:", err);
            return [];
        }
    });
}

async function runProjection(table, columns) {
    const columnList = columns.map(c => `"${c}"`).join(', ');
    const query = `SELECT ${columnList} FROM "${table}" FETCH FIRST 25 ROWS ONLY`;
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_ARRAY });
        return result.rows;
    }).catch(() => []);
}

// HAVING requirement
async function countPlantsBySpecies() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT LOWER(species), COUNT(*) AS PLANT_COUNT 
             FROM Plant
             GROUP BY LOWER(species)
             HAVING COUNT(*) > 2 `,
             []
        );
        return result.rows;
    }).catch(() => {
        return null;
    });
}

module.exports = {
    testOracleConnection,
    initiateAppUsers, 
    updateNameDemotable, 
    countAppUsers,
    countAppUsersFrequency,
    fetchAppUsersFromDb,
    insertAppUser,
    // populateAppUsers,
    fetchTasksFromDb,
    populateTasks,
    insertTask,
    initiateTasks,
    getUserTasks,
    insertUserTask,
    searchUsers,
    fetchPlantsFromDb,
    insertPlant,
     //plantlog related
    initiatePlantLog,
    fetchPlantLogFromDb,
    deletePlant,
    fetchSoilOptions,
    fetchSpeciesOptions,
    updatePlantGrowth,
    searchPlants,
    //end of plantlog related
    deleteUser,
    initiateGardenLog,
    fetchGardenLogFromDb,
    getAverageTasksForActiveUsers,
    fetchAllTableNames, 
    fetchColumnsForTable,
    runProjection,
    countPlantsBySpecies,
};