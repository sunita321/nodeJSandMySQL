var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create the connection to the database
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "jeff00",
	database: "Bamazon"
});

// verify connection to the database
connection.connect(function(err) {

	if (err) {
		// if there is a connection error, log that and throw an error
		console.log("Database connection failed");
		throw err;
	}

	
	start();
})

// function where the program begins running
function start() {
	
	// list selections
	inquirer.prompt({
		name: "taskToDo",
		type: "list",
		message: "Please select a task from the list below:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then(function(answer) {

		
		switch (answer.taskToDo) 
		{

			case "View Products for Sale":
				viewProducts();
				break;

			case "View Low Inventory":
				viewLowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				addNewProduct();
				break;

			default:
				console.log("Error has occured!");
				break;
		}
	})
}