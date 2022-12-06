INSERT INTO departments (name)
VALUES ("Human Resources"),
       ("Sales"),
       ("Manufacturing");

INSERT INTO roles (title, salary, department_id)
VALUES ("HR Manager", 80000, 1),
       ("Payroll Clerk", 60000, 1),
       ("Sales Manager", 120000, 2),
       ("Sales Associate", 100000, 2),
       ("Floor Manager", 55000, 3),
       ("Assembly", 40000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Wilma", "Farrell", 1, null),
       ("Salman", "Joshi", 2, 1),
       ("Sam", "Din", 3, null),
       ("Madison", "Watts", 4, 3),
       ("Al", "Alvidrez", 5, null),
       ("Jared", "Bell", 6, 5);

       
