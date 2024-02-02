const inquirer = require("inquirer");
const mysql = require("mysql2");
const { printTable} = require("console-table-printer")
var exitSelected = false;

 const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    }, console.log("Database Connected")
) 

const mainMenuChoices = [
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        loop: false
    },
];

function mainLoop() {

    inquirer.prompt(mainMenuChoices)
        .then( mainChoice => {
             switch (mainChoice.selection) {
                case 'View All Employees' : 
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    console.log("Quit");
                    db.end( (err) => {
                        if (err) {
                            console.error('Error closing MySQL connection:', err)
                        }
                    })
                    break;
            } 
        })
        .catch( (error) => {
            console.error(error)
        })
}

function viewAllDepartments() {
    const departmentQuery = "SELECT id AS 'Id', name AS 'Department Name' FROM departments"
    db.query(departmentQuery, function (err, results) {
        printTable(results)
        mainLoop()
    })
}

function viewAllRoles() {
    const roleQuery = "SELECT roles.id AS 'Id', roles.title AS 'Title', roles.salary AS 'Salary', departments.name AS 'Department' FROM roles LEFT OUTER JOIN departments ON roles.department_id = departments.id"
    db.query(roleQuery, function (err, results) {
        printTable(results)
        mainLoop()
    })
}

function viewAllEmployees() {
    const employeeQuery = "SELECT employees.id AS 'Id', employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Title', departments.name AS 'Department', roles.salary AS 'Salary', CONCAT(managers.first_name, ' ', managers.last_name) AS 'Manager' FROM employees LEFT OUTER JOIN roles ON employees.role_id = roles.id LEFT OUTER JOIN departments ON roles.department_id = departments.id LEFT OUTER JOIN employees AS managers ON employees.manager_id = managers.id"
    db.query(employeeQuery, function (err, results) {
        console.log("")
        printTable(results)
        mainLoop()
    })
}

function addDepartment() {
    const deptQuestions = [
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Enter department name : '
        }
    ]
    inquirer.prompt(deptQuestions)
        .then( answer => {
            const addDepartmentQuery = `INSERT INTO departments (name) VALUES ('${answer.newDepartment}')`
            db.query(addDepartmentQuery, function (err, results) {
                mainLoop();
            })
        })
        .catch( (error) => {
            console.error(error)
        })
}

function addRole() {
    const departmentListQuery = "SELECT * FROM departments ORDER BY id ASC"
    db.query(departmentListQuery, function (err, results) {
        const departmentsList = results.map( (departmentObject) => {
            return { name: departmentObject.name , value : departmentObject.id}
        })
        const roleQuestions = [
            {
                type: 'input',
                name: 'newRole',
                message: 'Enter role name : '
            }, 
            {
                type: 'number',
                name: 'salary',
                message: 'Enter annual salary : '
            },
            {
                type: 'list',
                name: 'departmentName',
                message: 'Choose department : ',
                choices: departmentsList,
                loop: false
            }
        ]
        inquirer.prompt(roleQuestions)
            .then( answers => {
                const addRoleQuery = `INSERT INTO roles (title, salary, department_id) VALUES ('${answers.newRole}', ${answers.salary}, ${answers.departmentName})`
                db.query(addRoleQuery, function (err, results) {
                  //  mainLoop();
                })

                mainLoop();
            }) 
            .catch((error) => {
                console.error(error);
            })

    })
}

function addEmployee() {
    const roleListQuery = "SELECT * FROM roles ORDER BY title ASC"
    const managerListQuery = "SELECT * FROM employees ORDER BY last_name, first_name"
    db.query(roleListQuery, function (err, results) {
        const roleList = results.map( (role) => {
            return { name: role.title, value: role.id}
        })
        db.query(managerListQuery, function (err, results) {
            const managerList = results.map( (manager) => {
                return { name: manager.last_name + ", " + manager.first_name, value: manager.id}
            })
            const employeeQuestions = [
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'First name : ',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Last name : '
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Choose role : ',
                    choices: roleList,
                    loop: false
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Choose manager : ',
                    choices: managerList,
                    loop: false
                }
            ]
            inquirer.prompt(employeeQuestions)
                .then( answers => {
                    const addEmployeeQuery = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${answers.firstName}', '${answers.lastName}', ${answers.roleId}, ${answers.managerId})`
                    db.query(addEmployeeQuery, function (err, results) {
                      //  mainLoop();
                    })

                    mainLoop();
                }) 
                .catch((error) => {
                    console.error(error);
                })
        })

    })
}

function updateRole() {
    const employeeQuery = "SELECT * FROM employees ORDER BY last_name, first_name"
    const roleQuery = "SELECT * FROM roles ORDER BY title"
    db.query(employeeQuery, function(err, results) {
        const employeeList = results.map( (employee) => {
            return { name : employee.last_name + ", " + employee.first_name, value: employee.id}
        })
        db.query(roleQuery, function(err, results) {
            const roleList = results.map( (role) => {
                return {name: role.title, value: role.id}
            })
            const newRoleQuestions = [
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee : ',
                    choices: employeeList,
                    loop: false
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select new role',
                    choices: roleList,
                    loop: false
                }
            ]
            inquirer.prompt(newRoleQuestions)
                .then( answers => {
                    const updateRoleQuery = `UPDATE employees SET role_id=${answers.role} WHERE id=${answers.employee} `
                    db.query(updateRoleQuery, function (err, results) {
                        //mainLoop()
                    })
                    mainLoop()
                })
                .catch( (error) => {
                    console.error(error)
                })
        })
    })
}

mainLoop();
