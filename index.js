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
    }, console.log("db")
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
            console.log("test")
             switch (mainChoice.selection) {
                case 'View All Employees' : 
                    console.log("View All Employees")
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    console.log("Add Employee");
                    break;
                case 'Update Employee Role':
                    console.log("Update Employee Role");
                    break;
                case 'View All Roles':
                    console.log("View All Roles");
                    viewAllRoles();
                    break;
                case 'Add Role':
                    console.log("Add Role");
                    break;
                case 'View All Departments':
                    console.log("View All Departments");
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    console.log("Quit");
                    exitSelected = true;
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
    console.log("All Departments")
    const departmentQuery = "SELECT id AS 'Id', name AS 'Department Name' FROM departments"
    db.query(departmentQuery, function (err, results) {
        printTable(results)
        mainLoop()
    })
}

function viewAllRoles() {
    console.log("All Roles")
    const roleQuery = "SELECT roles.id AS 'Id', roles.title AS 'Title', roles.salary AS 'Salary', departments.name AS 'Department' FROM roles LEFT OUTER JOIN departments ON roles.department_id = departments.id"
    db.query(roleQuery, function (err, results) {
        printTable(results)
        mainLoop()
    })
}

function viewAllEmployees() {
    console.log("All Employees")
    const employeeQuery = "SELECT employees.id AS 'Id', employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Title', departments.name AS 'Department', roles.salary AS 'Salary', CONCAT(managers.first_name, ' ', managers.last_name) AS 'Manager' FROM employees LEFT OUTER JOIN roles ON employees.role_id = roles.id LEFT OUTER JOIN departments ON roles.department_id = departments.id LEFT OUTER JOIN employees AS managers ON employees.manager_id = managers.id"
    db.query(employeeQuery, function (err, results) {
        printTable(results)
        mainLoop()
    })
}

function addDepartment() {
    const deptQuestions = [
        {
            type: 'input',
            name: 'newDepartment',
            message: "Enter department name : "
        }
    ]
    console.log("Add Department")
    inquirer.prompt(deptQuestions)
        .then( answer => {
            const addDepartmentQuery = `INSERT INTO departments (name) VALUES ('${answer.newDepartment}')`
            console.log(addDepartmentQuery)
            db.query(addDepartmentQuery, function (err, results) {
                mainLoop();
            })
        })
        .catch( (error) => {
            console.error(error)
        })
}
mainLoop();

