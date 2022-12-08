const inquirer = require('inquirer');
const { resolve } = require('path');

function addDepartment(deptName) {
    var sql = `INSERT INTO departments (name) VALUES ('${ deptName }')`;
    return sql;
}

module.exports = { addDepartment }