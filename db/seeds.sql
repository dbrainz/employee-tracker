INSERT INTO departments (id, name)
VALUES (1, "Legal"),
        (2, "IT"),
        (3, "HR");

INSERT INTO roles (id, title, salary, department_id)
VALUES (1,"Lawyer", 250000, 1),
        (2,"Bag Man", 100000, 1),
        (3,"Computer Nerd", 125000, 2),
        (4,"Head Nerd", 250000, 2),
        (5,"HR Dude", 115000, 3),
        (6,"Queen of HR", 175000, 3);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Al", "Capone", 2, NULL),
        (2, "Perry", "Mason", 1, NULL),
        (3, "Saul", "Goodman", 1, 2),
        (4, "Albert", "Einstein", 4, NULL),
        (5, "Steve", "Jobs", 3, 4),
        (6, "Jane", "Jones", 6, NULL),
        (7, "John", "Smith", 5, 6);

