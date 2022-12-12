const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const queries = require('./helpers/queries-static');
const userUpdates = require('./helpers/queries-dynamic');
//let deptListOld = [ {name: "pear", value: "0" }, { name: "apple", value: "2"}, { name: "banana", value: "3" } ];



// Set a dynamic port
const PORT = process.env.PORT || 3000;
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

    //var deptString = await getDepartmentChoices();
    //console.table(deptString);

    let newDeptList = [];

    //return new Promise((resolve) => {


        var currentsql = "SELECT name AS name, id AS value FROM departments";

        db.query(currentsql, (err, rows) => {

            if(err) {
                console.log("error");
                return;
            }  else {
                //console.table(rows);
                var rolesCount = 0;
                //for (const [value, name] of Object.entries(rows[rolesCount])) {
                for (const [key, value] in rows) {

                    var newDept = {
                        name: rows[rolesCount].name,
                        value: rows[rolesCount].value
                        //name: rows[key],
                        //value: rows[value]
                    }

                    rolesCount++;
                    newDeptList.push(newDept);
                }

        //resolve(newDeptList);  
    //});

    // Get user input
    inquirer.prompt([
        {
            type: 'list',
            name: 'userGoal',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', "Add a role", "Quit"]
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
        {
            type: 'input',
            name: 'roleName',
            message: 'Name of the Role:',
            when: (answers) => (answers.userGoal === 'Add a role'),
            validate(value) {
                if (value.length) { 
                    return true 
                }
                return 'Please enter the name of the role.'
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary for this role?',
            when: (answers) => (answers.userGoal === 'Add a role'),
            validate(value) {
                if (value.length) { 
                    return true 
                }
                return 'Please enter a salary amount.'
            }
        },
        {
            type: 'list',
            message: 'To which department does this role belong?',
            name: 'roleDept',
            choices: newDeptList,
            when: (answers) => (answers.userGoal === 'Add a role')
        }
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
                case 'Add a role':
                    var newRole = answers.roleName;
                    var roleSalary = answers.roleSalary;
                    var roleDept = answers.roleDept;
                    sql = userUpdates.addRole(newRole, roleSalary, roleDept);
                    console.log(`Added ${ newRole } ${ roleSalary } ${ roleDept } to the database. (not really)`);
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
            
});    
}

/* async function getDepartmentChoices() {
} */

// Run Express
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

showMainMenu();
