# CPSC 304 Project: Garden Database Management System

## Overview

This project is a relational database system designed to support garden and plant management for individual and community gardeners. 
Our project enables users to log plant growth, manage garden maintenance tasks, track environmental conditions, and so on to promote more organized and sustainable gardening practices.

## Planned Features

- Role-based user model with **Owners** and **Gardeners**
- Track plant growth using structured **PlantLogs** and **GardenLogs**
- Record soil types, fertilizers, and garden conditions
- Manage recurring **Tasks** associated with gardens
- Associate gardens with specific **Landplots** and **Soil** profiles

## Planned Technologies Used
- **Oracle** (department-provided)
- **JavaScript / Node.js**
- **HTML**, **CSS**, **JavaScript**

## ER Diagram & Schema

This project follows standard ER modeling practices and will be normalized up to **BCNF**. 

## Task Distribution
### SQL Script
- Each person work on 5 SQL schemas and their respective script

### Frontend
- 




## Project Timeline

1) July 25: Milestone 3 Check-in
2) July 25-27: SQL script
3) July 28-29: DataBase Generation
4) July 30- Aug 07: Frontend and hooking up backend to frontend
5) Aug 08: Deadline Milestone 4
6) Aug 08: Presentation Preparation: Sciprt & Presentation Material
7) Aug 08-09: Presentation Practice Over Zoom
8) Aug 10: Deadline Milestone 5

## Tasks
**Frontend**
- **Will we do a static or dynamic page?**
- Creating Tables (Justin)
- Modifying Tables (Justin)
- Delete all tables (Ericson)
- Textboxes or dropdowns for modifying plant names, soil, fertilizer, attributes, etc. (Jacky)
- Filter/sorting options (i.e., filter by plant type or family) (Justin)
- Feedback messages (i.e., table created successfully, error messages, etc.) (Ericson)
- Views/Pages (All)
    - Signup/login
    - User profile UI
    - New landplot
    - Notifications for tasks/scheduling?
    - Landing page
    - Views for plants, tasks, users, etc.
    - Would gardenders have a different view than owners?

**Backend**
- POST /create-table (Justin)
- POST /insert-data  (Justin)
- PUT /edit-table    (Justin)
- DELETE /delete-all (Ericson)
- POST /create-user  (Jacky)
- GET /users         (Jacky)
- GET /plants        (Ericson)
- GET /tasks         (Jacky)
- PUT /edit-plant    (Ericson)
- POST /assign-task  (Jacky)
- Error handling features (Ericson) 
- Save/load?

**Misc**
- Connecting Database/front-end and back-end (Jacky)

----------------------

#### Personal Github Disclaimer
Some github commits may be done using personal accounts for ease of use. The information for these accounts are listed below:
1. Justin Galimpin: justingalimpin@gmail.com
2. Jacky Wang:
jacky05wang@gmail.com
3. Ericson Ho: cy.ericson@gmail.com
