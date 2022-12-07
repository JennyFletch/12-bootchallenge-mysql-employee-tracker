SELECT roles.title as role, employees.first_name AS first, employees.last_name AS last
FROM roles
LEFT OUTER JOIN employees
ON roles.id = employees.role_id
ORDER BY employees.last_name;