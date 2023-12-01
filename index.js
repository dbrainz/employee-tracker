const inquirer = require("inquirer");
var exitSelected = false;

const mainMenuChoices = [
    {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        loop: false
    }
]

function mainLoop() {

    inquirer.prompt(mainMenuChoices)
        .then( mainChoice => {
            switch (mainChoice.selection) {
                case 'View All Employees' : 
                
                    break;
                case 'Add Employee':

                    break;
                case 'Update Employee Role':

                    break;
                case 'View All Roles':

                    break;
                case 'Add Role':

                    break;
                case 'View All Departments':

                    break;
                case 'Add Department':

                    break;
                case 'Quit':
                    exitSelected = true;
                    break;
            }
        })
        .catch( error => {
            console.error(error)
        })
    if (!exitSelected) mainLoop;

}

mainLoop();