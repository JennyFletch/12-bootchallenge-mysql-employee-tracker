const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const queries = require('./helpers/queries');

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

function showMainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userGoal',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Update an employee role', "Quit"]
        }
    ]).then(function(answers) {
        console.log(answers);
        var sql = '';

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
                case 'Update an employee role':
                    // get user input
                    // update the database
                    // display user info now updated
                    break;
                default:
                    console.log('Error - nothing selected.');
                    break;
        }
        
        db.query(sql, (err, rows) => {
            if(err) {
                console.log("error");
                return;
            } else { 
                console.log("success"); 
                console.table(rows);
                showMainMenu();
            }
        });
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
