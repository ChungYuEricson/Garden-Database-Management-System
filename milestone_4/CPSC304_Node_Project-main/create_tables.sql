DROP TABLE AppUser CASCADE CONSTRAINT;
DROP TABLE Owner CASCADE CONSTRAINT;
DROP TABLE Gardener CASCADE CONSTRAINT;
drop table Tasks CASCADE CONSTRAINT;
drop table User_HAS_Task CASCADE CONSTRAINT;
drop table Landplot CASCADE CONSTRAINT;
drop table Garden_WORKS_Landplot;
drop table Owner_OWNS_Landplot;
drop table Fertilizer CASCADE CONSTRAINT;
drop table Soil CASCADE CONSTRAINT;
drop table gardenSetting CASCADE CONSTRAINT;
drop table GardenType CASCADE CONSTRAINT;
drop table GardenLog CASCADE CONSTRAINT;
drop table seedType CASCADE CONSTRAINT;
drop table PlantFamily CASCADE CONSTRAINT;
drop table PlantInfo CASCADE CONSTRAINT;
drop table Plant CASCADE CONSTRAINT;
drop table Landplot_HAS_GardenType CASCADE CONSTRAINT;
drop table PlantLog CASCADE CONSTRAINT;
drop table GardenLog_HAS_Plant CASCADE CONSTRAINT;

CREATE TABLE AppUser (
	userID INTEGER,
	firstName VARCHAR(20),
	lastName VARCHAR(20),
	PRIMARY KEY (userID)
);

CREATE TABLE Owner (
	userID INTEGER,
	gardensOwned INTEGER DEFAULT 1 NOT NULL,
	PRIMARY KEY (userID),
	FOREIGN KEY (userID) REFERENCES AppUser(userID)
        ON DELETE CASCADE
);

CREATE TABLE Gardener (
	userID INTEGER,
	experience VARCHAR(20),
	gardensWorked INTEGER,
	availability VARCHAR(20) NOT NULL,
	PRIMARY KEY (userID),
	FOREIGN KEY (userID) REFERENCES AppUser(userID)
        ON DELETE CASCADE
);

CREATE TABLE Tasks (
	taskID INTEGER,
	frequency VARCHAR(20),
	details VARCHAR(20),
	PRIMARY KEY (taskID)
);

CREATE TABLE User_HAS_Task (
	userID INTEGER,
	taskID INTEGER,
	PRIMARY KEY (userID, taskID),
	FOREIGN KEY (userID) REFERENCES AppUser(userID)
        ON DELETE CASCADE,
	FOREIGN KEY (taskID) REFERENCES Tasks(taskID)
);

CREATE TABLE Landplot (
	landID INTEGER,
	location VARCHAR(20) NOT NULL,
	landSize FLOAT NOT NULL,
	PRIMARY KEY (landID)
);

CREATE TABLE Garden_WORKS_Landplot (
	userID INTEGER,
    landID INTEGER,
    PRIMARY KEY (userID, landID),
    FOREIGN KEY (userID) REFERENCES AppUser(userID),
    FOREIGN KEY (landID) REFERENCES Landplot(landID)
);

CREATE TABLE Owner_OWNS_Landplot (
	userID INTEGER,
    landID INTEGER,
    PRIMARY KEY (userID, landID),
    FOREIGN KEY (userID) REFERENCES AppUser(userID),
    FOREIGN KEY (landID) REFERENCES Landplot(landID)
);

CREATE TABLE Fertilizer (
	fertilizerBrand VARCHAR(20),
	fertilizer VARCHAR(20),
	PRIMARY KEY (fertilizerBrand)
);

CREATE TABLE Soil (
 	soilID INTEGER,
 	soilType VARCHAR(20) NOT NULL,
 	fertilizerBrand VARCHAR(20),
 	PRIMARY KEY (soilID),
	FOREIGN KEY (fertilizerBrand) REFERENCES Fertilizer(fertilizerBrand)
        ON DELETE SET NULL
);

CREATE TABLE GardenSetting (
	gardenSetting VARCHAR(20),
    irrigation VARCHAR(20),
	PRIMARY KEY (gardenSetting)
);

CREATE TABLE GardenType (
 	gardenID INTEGER,
	soilID INTEGER NOT NULL,
 	gardenSize FLOAT,
 	gardenSetting VARCHAR(20),
 	PRIMARY KEY (gardenID),
	FOREIGN KEY (gardenSetting) REFERENCES GardenSetting(gardenSetting),
	FOREIGN KEY (soilID) REFERENCES Soil(soilID)
);

CREATE TABLE Landplot_HAS_GardenType (
	landID INTEGER,
	gardenID INTEGER,
	PRIMARY KEY (landID, gardenID),
	FOREIGN KEY (landID) REFERENCES Landplot(landID),
	FOREIGN KEY (gardenID) REFERENCES GardenType(gardenID)
);

CREATE TABLE GardenLog (
 	gardenLogID INTEGER,
 	gardenID INTEGER,
 	weather VARCHAR(20),
 	monthlyAvgTemp FLOAT,
 	controlledTemp FLOAT,
 	PRIMARY KEY (gardenLogID),
 	FOREIGN KEY (gardenID) REFERENCES GardenType(gardenID)
        ON DELETE CASCADE
);

CREATE TABLE SeedType (
	seedType VARCHAR(20),
	harvestable INTEGER NOT NULL,
	PRIMARY KEY (seedType)
);

CREATE TABLE PlantFamily (
    familyID INTEGER,
    seedType VARCHAR(20) NOT NULL,
    floralStructure VARCHAR(20) NOT NULL,
    PRIMARY KEY (familyID),
    FOREIGN KEY (seedType) REFERENCES SeedType(seedType)
);

CREATE TABLE PlantInfo (
	species VARCHAR(20),
    familyID INTEGER,
	prefEnvironment VARCHAR(20),
	PRIMARY KEY (species),
	FOREIGN KEY (familyID) REFERENCES PlantFamily(familyID)
);

CREATE TABLE Plant (
 	plantID INTEGER,
 	species VARCHAR(20) NOT NULL,
	plantName VARCHAR(20) NOT NULL,
 	PRIMARY KEY (plantID, species),
	FOREIGN KEY (species) REFERENCES PlantInfo(species)
);

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
);

CREATE TABLE GardenLog_HAS_Plant (
	gardenLogID INTEGER,
    plantID INTEGER,
    species VARCHAR(20) NOT NULL,
	PRIMARY KEY (plantID, species, gardenLogID),
	FOREIGN KEY (plantID, species) REFERENCES Plant(plantID, species),
	FOREIGN KEY (gardenLogID) REFERENCES GardenLog(gardenLogID)
);

INSERT INTO AppUser (userID, firstName, lastName) VALUES (1, 'Ericson', 'Ho');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (2, 'Justin', 'Galimpin');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (3, 'Jacky', 'Wang');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (4, 'John', 'Doe');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (5, 'Michael', 'Jordan');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (6, 'Bob', 'Smith');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (7, 'LeBron', 'James');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (8, 'Kevin', 'Levin');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (9, 'Tom', 'Cruise');
INSERT INTO AppUser (userID, firstName, lastName) VALUES (10, 'Jackie', 'Chan');

INSERT INTO Owner (userID, gardensOwned) VALUES (1, 2);
INSERT INTO Owner (userID, gardensOwned) VALUES (2, 1);
INSERT INTO Owner (userID, gardensOwned) VALUES (3, 3);
INSERT INTO Owner (userID, gardensOwned) VALUES (4, 2);
INSERT INTO Owner (userID, gardensOwned) VALUES (5, 0);

INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES (6, 'Expert', 5, 'Weekends');
INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES (7, 'Intermediate', 2, 'Weekdays');
INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES (8, 'Beginner', 1, 'Evenings');
INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES (9, 'Expert', 4, 'Weekdays');
INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES (10, 'Intermediate', 3, 'Mornings');

INSERT INTO Tasks (taskID, frequency, details) VALUES (101, 'Daily', 'water');
INSERT INTO Tasks (taskID, frequency, details) VALUES (102, 'Weekly', 'new soil');
INSERT INTO Tasks (taskID, frequency, details) VALUES (103, 'Biweekly', 'water');
INSERT INTO Tasks (taskID, frequency, details) VALUES (104, 'Monthly', 'water');
INSERT INTO Tasks (taskID, frequency, details) VALUES (105, 'Annually', 'harvest');

INSERT INTO User_HAS_Task (userID, taskID) VALUES (1, 101);
INSERT INTO User_HAS_Task (userID, taskID) VALUES (2, 102);
INSERT INTO User_HAS_Task (userID, taskID) VALUES (5, 103);
INSERT INTO User_HAS_Task (userID, taskID) VALUES (6, 104);
INSERT INTO User_HAS_Task (userID, taskID) VALUES (7, 105);

INSERT INTO Landplot (landID, location, landSize) VALUES (201, 'Burnaby', 300.5);
INSERT INTO Landplot (landID, location, landSize) VALUES (202, 'Richmond', 150.0);
INSERT INTO Landplot (landID, location, landSize) VALUES (203, 'Vancouver', 250.0);
INSERT INTO Landplot (landID, location, landSize) VALUES (204, 'Surrey', 100.0);
INSERT INTO Landplot (landID, location, landSize) VALUES (205, 'NorthVancouver', 500.0);

INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES (1, 201);
INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES (2, 202);
INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES (3, 203);
INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES (4, 204);
INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES (5, 205);

INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES (6, 201);
INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES (7, 202);
INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES (8, 203);
INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES (9, 204);
INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES (10, 205);

INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES ('SyntheticFert', 'Compost');
INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES ('EcoBoost', 'Manure');
INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES ('SoilMix', 'Peat');
INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES ('NatureRich', 'Organic');
INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES ('FastGrow', 'Chemical');

INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES (401, 'Loamy', 'SyntheticFert');
INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES (402, 'Sandy', 'EcoBoost');
INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES (403, 'Clay', 'SoilMix');
INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES (404, 'Silty', 'NatureRich');
INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES (405, 'Peaty', 'FastGrow');

INSERT INTO GardenSetting (gardenSetting, irrigation) VALUES ('Urban', 'Drip');
INSERT INTO GardenSetting (gardenSetting, irrigation) VALUES ('Suburban', 'Sprinkler');
INSERT INTO GardenSetting (gardenSetting, irrigation) VALUES ('Natural', 'None');

INSERT INTO GardenType (gardenID, soilID, gardenSize, gardenSetting) VALUES (301, 401, 300.5, 'Suburban');
INSERT INTO GardenType (gardenID, soilID, gardenSize, gardenSetting) VALUES (302, 402, 150.0, 'Suburban');
INSERT INTO GardenType (gardenID, soilID, gardenSize, gardenSetting) VALUES (303, 403, 250.0, 'Urban');
INSERT INTO GardenType (gardenID, soilID, gardenSize, gardenSetting) VALUES (304, 404, 100.0, 'Suburban');
INSERT INTO GardenType (gardenID, soilID, gardenSize, gardenSetting) VALUES (305, 405, 500.0, 'Natural');

INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES (201, 301);
INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES (202, 302);
INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES (203, 303);
INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES (204, 304);
INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES (205, 305);

INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES (501, 301, 'Sunny', 22.5, 21.0);
INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES (502, 302, 'Rainy', 18.0, 17.5);
INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES (503, 303, 'Cloudy', 20.0, 19.5);
INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES (504, 304, 'Windy', 23.0, 22.0);
INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES (505, 305, 'Foggy', 19.0, 18.0);

INSERT INTO SeedType (seedType, harvestable) VALUES ('Seed', 1);
INSERT INTO SeedType (seedType, harvestable) VALUES ('Bulb', 0);
INSERT INTO SeedType (seedType, harvestable) VALUES ('Tuber', 1);
INSERT INTO SeedType (seedType, harvestable) VALUES ('Rhizome', 0);
INSERT INTO SeedType (seedType, harvestable) VALUES ('Root', 1);

INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES (601, 'Seed', 'Simple');
INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES (602, 'Bulb', 'Simple');
INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES (603, 'Tuber', 'Simple');
INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES (604, 'Rhizome', 'Simple');
INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES (605, 'Root', 'Complex');

INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES ('Rose', 601, 'Mild');
INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES ('Tulip', 602, 'Cool');
INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES ('Lily', 603, 'Warm');
INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES ('Fern', 604, 'Shady');
INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES ('Cactus', 605, 'Dry');

INSERT INTO Plant (plantID, species, plantName) VALUES (701, 'Rose', 'Rose');
INSERT INTO Plant (plantID, species, plantName) VALUES (702, 'Tulip', 'Tulip');
INSERT INTO Plant (plantID, species, plantName) VALUES (703, 'Lily', 'Lily');
INSERT INTO Plant (plantID, species, plantName) VALUES (704, 'Fern', 'Fern');
INSERT INTO Plant (plantID, species, plantName) VALUES (705, 'Cactus', 'Cactus');

INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES (601, 701, 'Rose', 401, DATE '2025-04-01', 'Blooming', DATE '2025-05-01');
INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES (602, 702, 'Tulip', 402, DATE '2025-03-15', 'Seedling', null);
INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES (603, 703, 'Lily', 403, DATE '2025-02-20', 'Growing', DATE '2025-04-20');
INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES (604, 704, 'Fern', 404, DATE '2025-01-10', 'Dormant', null);
INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES (605, 705, 'Cactus', 405, DATE '2025-05-05', 'Flowering', DATE '2025-07-20');

INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES (501, 701, 'Rose');
INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES (502, 702, 'Tulip');
INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES (503, 703, 'Lily');
INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES (504, 704, 'Fern');
INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES (505, 705, 'Cactus');