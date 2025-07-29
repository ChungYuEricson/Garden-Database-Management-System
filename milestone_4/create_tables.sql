CREATE TABLE User (
	userID INTEGER,
	firstName VARCHAR(20),
	lastName VARCHAR(20),
	PRIMARY KEY (userID)
);

CREATE TABLE Owner (
	userID INTEGER,
	gardensOwned INTEGER NOT NULL,
	PRIMARY KEY (userID),
	FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Gardener (
	userID INTEGER,
	experience VARCHAR(20),
	gardensWorked INTEGER,
	availability VARCHAR(20) NOT NULL,
	PRIMARY KEY (userID),
	FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Tasks (
	taskID INTEGER,
	frequency VARCHAR(20),
	PRIMARY KEY (taskID)
);

CREATE TABLE User_HAS_Task (
	userID INTEGER,
	taskID INTEGER,
	PRIMARY KEY (userID, taskID),
	FOREIGN KEY (userID) REFERENCES User(userID),
	FOREIGN KEY (taskID) REFERENCES Tasks(taskID)
);

CREATE TABLE Landplot (
	landID INTEGER,
	location VARCHAR(20) NOT NULL,
	size FLOAT NOT NULL,
	PRIMARY KEY (landID)
);

CREATE TABLE Garden_WORKS_Landplot (
	userID INTEGER,
    landID INTEGER,
    PRIMARY KEY (userID, landID),
    FOREIGN KEY (userID) REFERENCES User(userID),
    FOREIGN KEY (landID) REFERENCES Landplot(landID)
);

CREATE TABLE Owner_OWNS_Landplot (
	userID INTEGER,
    landID INTEGER,
    PRIMARY KEY (userID, landID),
    FOREIGN KEY (userID) REFERENCES User(userID),
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
);

CREATE TABLE GardenSetting (
	gardenSetting VARCHAR(20),
    irrigation VARCHAR(20),
	PRIMARY KEY (gardenSetting)
);

CREATE TABLE GardenType (
 	gardenID INTEGER,
	soilID INTEGER NOT NULL,
 	size FLOAT,
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
);

CREATE TABLE SeedType (
	seedType VARCHAR(20),
	harvestable BOOLEAN NOT NULL,
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

INSERT INTO User (userID, firstName, lastName) VALUES
(1, 'Ericson', 'Ho'),
(2, 'Justin', 'Galimpin'),
(3, 'Jacky', 'Wang'),
(4, 'John', 'Doe'),
(5, 'Michael', 'Jordan'),
(6, 'Bob', 'Smith'),
(7, 'LeBron', 'James'),
(8, 'Kevin', 'Levin'),
(9, 'Tom', 'Cruise'),
(10, 'Jackie', 'Chan');

INSERT INTO Owner (userID, gardensOwned) VALUES
(1, 2),
(2, 1),
(3, 3),
(4, 2),
(5, 0);

INSERT INTO Gardener (userID, experience, gardensWorked, availability) VALUES
(6, 'Expert', 5, 'Weekends'),
(7, 'Intermediate', 2, 'Weekdays'),
(8, 'Beginner', 1, 'Evenings'),
(9, 'Expert', 4, 'Weekdays'),
(10, 'Intermediate', 3, 'Mornings');

INSERT INTO Tasks (taskID, frequency) VALUES
(101, 'Daily'),
(102, 'Weekly'),
(103, 'Biweekly'),
(104, 'Monthly'),
(105, 'Annually');

INSERT INTO User_HAS_Task (userID, taskID) VALUES 
(1, 101),
(2, 102),
(5, 103),
(6, 104),
(7, 105);




INSERT INTO Landplot (landID, location, size) VALUES
(201, 'Burnaby', 300.5),
(202, 'Richmond', 150.0),
(203, 'Vancouver', 250.0),
(204, 'Surrey', 100.0),
(205, 'NorthVancouver', 500.0);

INSERT INTO Owner_OWNS_Landplot (userID, landID) VALUES
(1, 201),
(2, 202),
(3, 203),
(4, 204),
(5, 205);

INSERT INTO Garden_WORKS_Landplot (userID, landID) VALUES
(6, 201),
(7, 202),
(8, 203),
(9, 204),
(10, 205);

INSERT INTO Fertilizer (fertilizerBrand, fertilizer) VALUES
('SyntheticFert', 'Compost'),
('EcoBoost', 'Manure'),
('SoilMix', 'Peat'),
('NatureRich', 'Organic'),
('FastGrow', 'Chemical');

INSERT INTO Soil (soilID, soilType, fertilizerBrand) VALUES
(401, 'Loamy', 'SyntheticFert'),
(402, 'Sandy', 'EcoBoost'),
(403, 'Clay', 'SoilMix'),
(404, 'Silty', 'NatureRich'),
(405, 'Peaty', 'FastGrow');

INSERT INTO GardenSetting (gardenSetting, irrigation) VALUES
('Urban', 'Drip'),
('Suburban', 'Sprinkler'),
('Natural', 'None');

INSERT INTO GardenType (gardenID, soilID, size, gardenSetting) VALUES
(301, 401, 300.5, 'Suburban'),
(302, 402, 150.0, 'Suburban'),
(303, 403, 250.0, 'Urban'),
(304, 404, 100.0, 'Suburban'),
(305, 405, 500.0, 'Natural');
INSERT INTO Landplot_HAS_GardenType (landID, gardenID) VALUES
(201, 301),
(202, 302),
(203, 303),
(204, 304),
(205, 305);

INSERT INTO GardenLog (gardenLogID, gardenID, weather, monthlyAvgTemp, controlledTemp) VALUES
(501, 301, 'Sunny', 22.5, 21.0),
(502, 302, 'Rainy', 18.0, 17.5),
(503, 303, 'Cloudy', 20.0, 19.5),
(504, 304, 'Windy', 23.0, 22.0),
(505, 305, 'Foggy', 19.0, 18.0);

INSERT INTO SeedType (seedType, harvestable) VALUES
('Seed', TRUE),
('Bulb', FALSE),
('Tuber', TRUE),
('Rhizome', FALSE),
('Seed', TRUE);

INSERT INTO PlantFamily (familyID, seedType, floralStructure) VALUES
(601, 'Seed', 'Simple'),
(602, 'Bulb', 'Simple'),
(603, 'Tuber', 'Simple'),
(604, 'Rhizome', 'Simple'),
(605, 'Seed', 'Complex');

INSERT INTO PlantInfo (species, familyID, prefEnvironment) VALUES
('Rose', 601, 'Mild'),
('Tulip', 602, 'Cool'),
('Lily', 603, 'Warm'),
('Fern', 604, 'Shady'),
('Cactus', 605, 'Dry');

INSERT INTO Plant (plantID, species, plantName) VALUES
(701, 'Rose', 'Rose'),
(702, 'Tulip', 'Tulip'),
(703, 'Lily', 'Lily'),
(704, 'Fern', 'Fern'),
(705, 'Cactus', 'Cactus');



INSERT INTO PlantLog (plantLogID, plantID, species, soilID, datePlanted, growth, harvestDate) VALUES
(601, 701, 'Rose', 401, DATE '2025-04-01', 'Blooming', DATE '2025-05-01'),
(602, 702, 'Tulip', 402, DATE '2025-03-15', 'Seedling', null),
(603, 703, 'Lily', 403, DATE '2025-02-20', 'Growing', DATE '2025-04-20'),
(604, 704, 'Fern', 404, DATE '2025-01-10', 'Dormant', null),
(605, 705, 'Cactus', 405, DATE '2025-05-05', 'Flowering', DATE '2025-07-20');

INSERT INTO GardenLog_HAS_Plant (gardenLogID, plantID, species) VALUES
(501, 701, 'Rose'),
(502, 702, 'Tulip'),
(503, 703, 'Lily'),
(504, 704, 'Fern'),
(505, 705, 'Cactus');