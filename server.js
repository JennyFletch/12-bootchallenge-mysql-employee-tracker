const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const queries = require('./helpers/queries-static');
const userUpdates = require('./helpers/queries-dynamic');

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

async function getDepartmentChoices() {

    let newDeptList = [];
    return new Promise((resolve) => {

        var sql = "SELECT name AS name, id AS value FROM departments";
        db.query(sql, (err, rows) => {

            if(err) {
                console.log("error");
                return;
            }  else {
                //console.table(rows);
                var rowsCount = 0;
                for (const [key, value] in rows) {

                    var newDept = {
                        name: rows[rowsCount].name,
                        value: rows[rowsCount].value
                    }
                    rowsCount++;
                    newDeptList.push(newDept);
                }
            } 
        });    
        resolve(newDeptList);  
    });
}

async function getRoleChoices() {

    let newRoleList = [];
    return new Promise((resolve) => {

        var sql = "SELECT id, title FROM roles";
        db.query(sql, (err, rows) => {

            if(err) {
                console.log("error");
                return;
            }  else {
                // console.table(rows);
                var rowsCount = 0;
                for (const [key, value] in rows) {

                    var newRole = {
                        name: rows[rowsCount].title,
                        value: rows[rowsCount].id
                    }
                    rowsCount++;
                    newRoleList.push(newRole);
                }
            } 
        });    
        resolve(newRoleList);  
    });
}

async function getManagerChoices() {

    let empMgrList = [];
    return new Promise((resolve) => {

        var sql = `SELECT id, CONCAT(first_name, " ", last_name) AS managerName FROM employees`;

        db.query(sql, (err, rows) => {

            if(err) {
                console.log("error");
                return;
            }  else {
                // console.table(rows);
                var rowsCount = 0;
                for (const [key, value] in rows) {

                    var newEmp = {
                        name: rows[rowsCount].managerName,
                        value: rows[rowsCount].id
                    }
                    rowsCount++;
                    empMgrList.push(newEmp);
                }
                // add in a null-value for no manager
                var nullValue = null;
                var noMgr = {
                    name: 'No Manager',
                    value: nullValue
                }
                empMgrList.push(noMgr);
            } 
        });    
        resolve(empMgrList);  
    });
}

// Get user input
async function showMainMenu() {

    var deptString = await getDepartmentChoices();
    var roleString = await getRoleChoices();
    var empManagers = await getManagerChoices();
    
    //console.table(deptString);

    inquirer.prompt([
        {
            type: 'list',
            name: 'userGoal',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', "Add a role", "Add an employee", "Update employee role", "Quit"]
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
            message: 'Which department does this role belong to?',
            name: 'roleDept',
            choices: deptString,
            when: (answers) => (answers.userGoal === 'Add a role')
         },
         {
            type: 'input',
            name: 'employeeFirst',
            message: 'What is first name of the employee?',
            when: (answers) => (answers.userGoal === 'Add an employee'),
            validate(value) {
                if (value.length) { 
                    return true 
                }
                return 'Please enter the first name of the employee.'
            }
        },
        {
            type: 'input',
            name: 'employeeLast',
            message: 'What is last name of the employee?',
            when: (answers) => (answers.userGoal === 'Add an employee'),
            validate(value) {
                if (value.length) { 
                    return true 
                }
                return 'Please enter the last name of the employee.'
            }
        },
        {
            type: 'list',
            message: 'What is the role for this employee?',
            name: 'empRole',
            choices: roleString,
            when: (answers) => (answers.userGoal === 'Add an employee')
         },
         {
             type: 'list',
             message: 'Who will this employee report to?',
             name: 'empManager',
             choices: empManagers,
             when: (answers) => (answers.userGoal === 'Add an employee')
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
                    console.log(`Added ${ newRole } to the database.`);
                    showTable = false;
                    break;
                case 'Add an employee':
                    var newEmpFirst = answers.employeeFirst;
                    var newEmpLast = answers.employeeLast;
                    var newEmpRole = answers.empRole;
                    var newEmpManager = answers.empManager;
                    sql = userUpdates.addEmployee(newEmpFirst, newEmpLast, newEmpRole, newEmpManager);
                    console.log(`Added ${ newEmpFirst } ${ newEmpLast } to the database.`);
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