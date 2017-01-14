var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create the connection to the database
var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
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
		type: "rawlist",
		message: "Please select a task:",
		choices: ["View Products", "View Low Inventory", "Add Inventory", "Add New Product"]
	}).then(function(answer) {

		
		switch (answer.taskToDo.toUpperCase()) {

			case "VIEW PRODUCTS":
				viewProducts();
				break;

			case "VIEW LOW INVENTORY":
				viewLowInventory();
				break;

			case "ADD INVENTORY":
				addInventory();
				break;

			case "ADD NEW PRODUCT":
				addNewProduct();
				break;

			default:
				console.log("Uh oh! Something went wrong!");
				break;
		}
	})
}