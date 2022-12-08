const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

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

function viewAllDepartments() {

    var sql = "SELECT id, name FROM departments";
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
}

function viewAllRoles() {

    var sql = `SELECT roles.title as role, roles.salary, departments.name
    FROM roles
    LEFT OUTER JOIN departments
    ON roles.department_id = departments.id
    ORDER BY departments.name`;

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
}

function viewAllEmployees() {

    var sql = `SELECT employees.first_name, employees.last_name, roles.title, departments.name, roles.salary
    FROM roles
    JOIN employees
    ON employees.role_id = roles.id
    JOIN departments 
    ON roles.department_id = departments.id
    ORDER BY employees.last_name`;

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
}

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

        switch (answers.userGoal) {
                case 'Quit':
                    console.log('Goodbye.');
                    process.exit();
                    break;
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
                    break;
                default:
                    console.log('Error - nothing selected.');
                    break;
        }
        

           
            // view all roles
            // view all employees
            // update an employee role
    });
    
}

app.get('/api/employees', (req, res) => {
    const sql = `SELECT * FROM employees;`

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ err: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

/* // Count all the books in stock and display them in a column titled total_count
db.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
  console.log(results);
});

// Find the min, max, and average number of books by section and label them accordingly 
db.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
  console.log(results);
}); */

// Run Express
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

showMainMenu();
