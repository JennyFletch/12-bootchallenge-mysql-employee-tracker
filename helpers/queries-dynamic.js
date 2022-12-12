const inquirer = require('inquirer');
const { resolve } = require('path');

function addDepartment(deptName) {
    var sql = `INSERT INTO departments (name) VALUES ('${ deptName }')`;
    return sql;
}

function addRole(newRole, salary, dept) {
    var salaryAmount = Number(salary);
    var deptNumber = Number(dept);
    console.log(`received: ${ newRole }, ${ salary }, ${ deptNumber }`);
    var sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${ newRole }', ${ salaryAmount }, ${ deptNumber })`;
    return sql;
}

module.exports = { addDepartment, addRole }