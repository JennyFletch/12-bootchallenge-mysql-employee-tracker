function viewAllDepartments() {

    var sql = "SELECT id, name FROM departments";
    return sql;
}

function viewAllRoles() {

    var sql = `SELECT roles.title as role, roles.salary, departments.name
    FROM roles
    LEFT OUTER JOIN departments
    ON roles.department_id = departments.id
    ORDER BY departments.name`;
    return sql;
}

function viewAllEmployees() {

    var sql = `SELECT employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, manager_id AS manager
    FROM roles
    JOIN employees
    ON employees.role_id = roles.id
    JOIN departments 
    ON roles.department_id = departments.id
    ORDER BY employees.last_name`;
    return sql;
}

module.exports = { viewAllDepartments, viewAllRoles, viewAllEmployees }