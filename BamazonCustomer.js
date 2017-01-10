require('console.table');//displays data in table form


var mysql = require('mysql');

var inquirer = require('inquirer');//prompts user for input

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "jeff00", //Your password
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});

connection.query('SELECT * FROM Products', function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
});


var questions = 
[
  {
   	name:"selectProduct",
	type: 'input',
	message: 'What is the ItemID number of the product you want to buy?',
	validate: function(value) 
	{
        //Validate the entry is numeric
        if (isNaN(value) == false) 
        {
            return true;
        } 
        else 
        {
            return 'Invalid input! Please enter a number.';
        }
    }
  },

  {
   	name:"selectProduct",
	type: 'input',
	message: 'How many units do you want to buy?',
	validate: function(value) 
	{
        //Validate the entry is numeric
        if (isNaN(value) == false) 
        {
            return true;
        } 
        else 
        {
            return 'Invalid input! Please enter a number.';
        }
    }
  }
];
//connection.end();

var start = function()
{
	inquirer.prompt(questions);
		
	
}