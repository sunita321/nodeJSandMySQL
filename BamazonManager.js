var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require('console.table');

// create the connection to the database
var connection = mysql.createConnection(
{
	host: "localhost",
	user: "root",
	password: "jeff00",
	database: "Bamazon"
});

// verify connection to the database
connection.connect(function(err) 
{

	if (err) {
		// if there is a connection error, log that and throw an error
		console.log("Database connection failed");
		throw err;
	}

	
	start();
})



// function where the program begins running
function start() 
{
	
	// list selections
	inquirer.prompt({
		name: "taskToDo",
		type: "list",
		message: "Please select a task from the list below:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then(function(answer) 
	{

		
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

// function to view available stock
function viewProducts() 
{

	// 
	connection.query('SELECT * FROM Products', function(err, res) {

		// throw error if occurs 
		if (err) throw err;

		
		console.log('\n' + "Stock Inventory" + '\n')
		console.table(res);

		
		start();
	})
}

function viewLowInventory() 
{

	// 
	connection.query('SELECT * FROM Products WHERE `StockQuantity` < 5', function(err, res) {

		// throw error if occurs 
		if (err) throw err;

		
		console.log('\n' + "Low Stock Inventory" + '\n');
		console.table(res);

		
		start();
	})
}


var inventoryQuestions = 
[

	{
		name: "selectProduct",
		type: "list",
		message: "Please select a product stock quantity you want to update.",
		choices: ["Sunscreen", "Snuggle", "DVD", "Hair Oil"]
	},

	{
		name: "stockInput",
		type: "input",
		message: "Please enter quantity to add to stock.",
		validate: function(value) 
        {
        	var valid = !isNaN(parseFloat(value)) && parseFloat(value)>0;
      		return valid || 'Please enter a number';
            
        },

        filter: Number

		
	}

];

function addInventory() 
{
	var quantityStock;
	var quantityAdd;
	// list selections
	inquirer.prompt(inventoryQuestions).then(function(answer) 
	{
		quantityAdd = (answer.stockInput);//number from user input
		var query = 'SELECT `StockQuantity` FROM `Products` WHERE `ProductName` = ?';
		connection.query(query, answer.selectProduct, function(err, res)
		{
			if (err) throw err;
			//console.log(res);
			quantityStock = parseInt(res[0].StockQuantity, 10);
			

			var newQuantity = quantityStock + quantityAdd;
			

			console.log("Product Selected: " + answer.selectProduct + '\n');
			var query2 = 'UPDATE Products SET `StockQuantity` = ? WHERE `ProductName` = ?';
	        connection.query(query2, [newQuantity, answer.selectProduct], function(err, res) 
	        { 	if (err) throw err;

	        	//console.log(res);

				connection.query('SELECT * FROM `Products`', function(err, res) //updated table
	            {
	    			if (err) throw err;
	    			console.table(res);
	    			start();//restart order
				});
	            
	       });
		});

    });
}