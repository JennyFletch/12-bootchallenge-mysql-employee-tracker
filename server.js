const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const queries = require('./helpers/queries-static');
const userUpdates = require('./helpers/queries-dynamic');

// Set a dynamic port
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set credentials for MySQL
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

// Get user input
function showMainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userGoal',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', "Quit"]
        },
        {
            type: 'input',
            name: 'departmentName',
            message: 'Name of the Department:',
            when: (answers) => (answers.userGoal === 'Add a department'),
            validate(value) {
                if (value.length) { 
                    return true 
                }
                return 'Please enter the name of the department.'
            }
        },
    ]).then(function(answers) {
        
        var sql = 'not set';
        var showTable = true;

        // Query/update database according to user input
        switch (answers.userGoal) {
                case 'Quit':
                    console.log('Goodbye.');
                    process.exit();
                    break;
                case 'View all departments':
                    sql = queries.viewAllDepartments();
                    break;
                case 'View all roles':
                    sql = queries.viewAllRoles();
                    break;
                case 'View all employees':
                    sql = queries.viewAllEmployees();
                    break;
                case 'Add a department':
                    var newDept = answers.departmentName;
                    sql = userUpdates.addDepartment(newDept);
                    console.log(`Added ${ newDept } to the database.`);
                    showTable = false;
                    break;
                default:
                    console.log('Error - nothing selected.');
                    break;
        }

        if (sql === 'not set') {
            showMainMenu();
        } else {
            db.query(sql, (err, rows) => {
                if(err) {
                    console.log("error");
                    return;
                } else { 
                    // console.log("success"); 
                    if (showTable) { console.table(rows); }
                    showMainMenu();
                }
            });
        }
    });
    
}

// Run Express
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

showMainMenu();
