const inquirer = require('inquirer');
const { resolve } = require('path');

function addDepartment(deptName) {
    var sql = `INSERT INTO departments (name) VALUES ('${ deptName }')`;
    return sql;
}

function addRole(newRole, salary, dept) {
    var salaryAmount = Number(salary);
    var deptNumber = Number(dept);
    // console.log(`received: ${ newRole }, ${ salary }, ${ deptNumber }`);
    var sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${ newRole }', ${ salaryAmount }, ${ deptNumber })`;
    return sql;
}

function addEmployee(firstName, lastName, role, manager) {
    // console.log(`received: ${ firstName }, ${ lastName }, ${ role }, ${ manager }`)
    var role_id = Number(role);

    if(manager) {
        var manager_id = Number(manager);
        var sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${ firstName }', '${ lastName }', ${ role_id }, ${ manager_id })`;
    } else {
        var sql = `INSERT INTO employees (first_name, last_name, role_id) VALUES ('${ firstName }', '${ lastName }', ${ role_id })`;
    }
    return sql;
}

module.exports = { addDepartment, addRole, addEmployee }