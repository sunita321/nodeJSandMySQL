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

connection.connect(function(err) 
{
    if (err) 
    {
        throw err;
        console.log("Database connection error");
    }

    start();
});



function start()
{

    connection.query('SELECT * FROM Products', function(err, res)
    {
        if (err) throw err;

        console.table(res);

        inquirer.prompt(
        [
            {
                name:"Product_ItemID",
                type: 'input',
                message: 'What is the ItemID number of the product you want to buy?',
                validate: function(value) 
                {
                    var returnValue = 'Invalid input! Please enter a valid ItemID number.';
                // check if ItemID exists within the database
                    for (var i=0; i<res.length; i++) 
                    {

                        if (value == res[i].ItemID) 
                        {
                            returnValue = true;

                        }
                        
                    }
                    return returnValue;
                }       
            
            },

            {
                name:"Quantity_requested",
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
        ]).then(function(answers)
        {
            var query = 'SELECT StockQuantity, Price, ProductName FROM Products WHERE ?';
            connection.query(query, {ItemID: answers.Product_ItemID},
                function(err, res) 
                {
           
            	   //console.log("Stock Quantity " + res[0].StockQuantity);

                    if (answers.Quantity_requested > res[0].StockQuantity)
                    {
                       console.log("\n----------------------------------------------");
                       console.log("Insufficient Quantity Available!"); 
                       console.log("\n----------------------------------------------");
                       start();//restart order

                    }
                    else
                    {
                        console.log("\n----------------------------------------------------------------------");
                        console.log("Ordered Summary:");
                        console.log("Total Cost $" + (res[0].Price * answers.Quantity_requested).toFixed(2));
                        console.log(res[0].ProductName + " Quantity Remaining: " + 
                                    (res[0].StockQuantity - answers.Quantity_requested) + "\n");
                        console.log("\n-----------------------------Updated Stock-----------------------------");
                        buyProduct(answers.Quantity_requested, res[0].StockQuantity, answers.Product_ItemID);
                    }
                });
        });
    });	
}


function buyProduct (quantityRequested, quantityStock, itemID)
{

		var query = 'UPDATE Products SET StockQuantity = ? WHERE ItemID = ?';
        connection.query(query, [(quantityStock - quantityRequested), itemID], function(err, res) 
        {
			connection.query('SELECT * FROM Products', function(err, res) 
            {
    			if (err) throw err;
    			//console.table(res);
    			start();//restart order
			});
            
        });

}