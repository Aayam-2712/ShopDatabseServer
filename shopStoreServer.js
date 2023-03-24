
let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Methods", 
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

var port= process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));


const { Client } = require("pg");
const client = new Client ({
    user: "postgres",
    password: "Aayam@271298",
    database: "postgres",
    port: 5432,
    host: "db.vozbtbddnxtskdspyhza.supabase.co",
    ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
    console.log(`Connected!!!`);
});


let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "",
    database : "testdb",
};

let connection = mysql.createConnection(connData);


app.get("/shops", function(req,res,next) {
    let sql = `SELECT * FROM shops`;
    client.query(sql, function(err, result) {
        if(err) res.send(err);
        else res.send(result.rows);
    });
});

app.get("/shop/:id", function(req,res, next) {
    let id = req.params.id;
    console.log(id);
    let sql = `SELECT * FROM shops WHERE id=$1`;
    client.query(sql, [id], function(err, result) {
        if(err) { res.status(400).send(err); }
        res.send(result.rows);
    });
});

app.post("/shop/add", function(req,res,next) {
    var values = Object.values(req.body);
    // console.log(values);
    let sql = `INSERT INTO shops( name, rent ) VALUES ($1,$2)`;
    client.query(sql, values, function(err, result) {
        if(err) { res.status(400).send(err) };
        res.send(`${result.rowCount} insertion successful`);
    });
});



app.get("/products", function(req,res,next) {
    let sql = `SELECT * FROM products`;
    client.query(sql, function(err, result) {
        if(err) res.send(err);
        else res.send(result.rows);
    });
});

app.get("/product/:id", function(req,res, next) {
    let id = req.params.id;
    console.log(id);
    let sql = `SELECT * FROM products WHERE productid=$1`;
    client.query(sql, [id], function(err, result) {
        if(err) { res.status(400).send(err); }
        res.send(result.rows);
    });
});

app.post("/product/add", function(req,res,next) {
    var values = Object.values(req.body);
    // console.log(values);
    let sql = `INSERT INTO products( productname, category, description ) VALUES ($1,$2,$3)`;
    client.query(sql, values, function(err, result) {
        if(err) { res.status(400).send(err) };
        res.send(`${result.rowCount} insertion successful`);
    });
});

app.put("/product/:id", function(req, res,next) {
    let id = +req.params.id;
    let body = req.body;
    console.log("PutBody : ",body);
    let values = [ body.productname, body.category, body.description, id];
    // console.log("Values",values);
    let sql1 = `UPDATE products SET productname=$1, category=$2, description=$3 WHERE productid=$4`;
    client.query(sql1, values, function(err,result) {
        if(err) res.status(404).send(err);
        res.send(`${result.rowCount} Updation Successful`);
    });
});



app.get("/purchases", function(req,res,next) {
    console.log("Request Query : ",req.query)
    let product = req.query.product ? +req.query.product : false ;
    let store = req.query.store ? +req.query.store : false;
    let sort = req.query.sort ? req.query.sort : false;
    let sql1 = `SELECT * FROM purchases WHERE productid=$1`;
    let sql2 = `SELECT * FROM purchases WHERE shopid=$1`;
    let sql3 = `SELECT * FROM purchases ORDER BY quantity ASC`;
    let sql4 = `SELECT * FROM purchases ORDER BY quantity DESC`;
    let sql5 = `SELECT * FROM purchases ORDER BY quantity*price ASC`;
    let sql6 = `SELECT * FROM purchases ORDER BY quantity*price DESC`;
    let sql = `SELECT * FROM purchases`;
    product 
        ? (
            client.query(sql1, [product], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        )
        : store
        ? (
            client.query(sql2, [store], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        )
        : sort === "QtyAsc"
        ? (
            client.query(sql3, [sort], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        ) 
        : sort === "QtyDesc"
        ? (
            client.query(sql4, [sort], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        )
        : sort === "ValueAsc"
        ? (
            client.query(sql5, [sort], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        )
        : sort === "ValueDesc"
        ? (
            client.query(sql6, [sort], function(err, result) {
                if(err) res.send(err);
                else console.log("Done");
            })
        )
        : (
            client.query(sql, function(err, result) {
                if(err) res.send(err);
                else res.send(result);
            })
        )
});

app.get("/purchases/shops/:id", function(req,res, next) {
    let id = req.params.id;
    console.log(id);
    let sql = `SELECT * FROM purchases INNER JOIN shops ON purchases.shopid = shops.shopid`;
    client.query(sql, [id], function(err, result) {
        if(err) { res.status(400).send(err); }
        res.send(result.rows);
    });
});

app.get("/purchases/products/:id", function(req,res, next) {
    let id = req.params.id;
    console.log(id);
    let sql = `SELECT * FROM purchases INNER JOIN products ON purchases.productid = products.productid`;
    client.query(sql, [id], function(err, result) {
        if(err) { res.status(400).send(err); }
        res.send(result.rows);
    });
});

app.post("/purchase/add", function(req,res,next) {
    var values = Object.values(req.body);
    // console.log(values);
    let sql = `INSERT INTO purchases( shopid, productid, quantity, price ) VALUES ($1,$2,$3,$4)`;
    client.query(sql, values, function(err, result) {
        if(err) { res.status(400).send(err) };
        res.send(`${result.rowCount} insertion successful`);
    });
});



app.get("/shopResetData", function(req, res, next) {
    console.log("Inside get/resetData of shopResetData");
    const query = `DELETE FROM shops`;
    client.query(query, function(err, result) {
        if(err) {
            console.log("{error} : ", err);
            res.send(err);
        }
        else {
            console.log("Successfully deleted. Affected rows : ",result.rowCount);
            let {shops} = require("./shopStoreData.js");
            for (let i=0;i<shops.length;i++){
                let query2 = `INSERT INTO shops( name, rent ) VALUES ($1,$2)`;
                client.query(query2, [ shops[i].name, shops[i].rent ], function(err, result) {
                    if(err){
                        console.log("error : ", err);
                    }
                    else {
                        console.log("Successfully inserted. Affected rows : ",result.rowCount);
                    }
                });
            }
            res.send("Successfully Reset the Data.");
        }
        
    });
});

app.get("/productResetData", function(req, res, next) {
    console.log("Inside get/resetData of productResetData");
    const query = `DELETE FROM products`;
    client.query(query, function(err, result) {
        if(err) {
            console.log("{error} : ", err);
            res.send(err);
        }
        else {
            console.log("Successfully deleted. Affected rows : ",result.rowCount);
            let {products} = require("./shopStoreData.js");
            for (let i=0;i<products.length;i++){
                let query2 = `INSERT INTO products( productname, category, description ) VALUES ($1,$2,$3)`;
                client.query(query2, [ products[i].productName, products[i].category, products[i].description ], function(err, result) {
                    if(err){
                        console.log("error : ", err);
                    }
                    else {
                        console.log("Successfully inserted. Affected rows : ",result.rowCount);
                    }
                });
            }
            res.send("Successfully Reset the Data.");
        }
        
    });
});

app.get("/purchaseResetData", function(req, res, next) {
    console.log("Inside get/resetData of purchaseResetData");
    const query = `DELETE FROM purchases`;
    client.query(query, function(err, result) {
        if(err) {
            console.log("{error} : ", err);
            res.send(err);
        }
        else {
            console.log("Successfully deleted. Affected rows : ",result.rowCount);
            let {purchases} = require("./shopStoreData.js");
            for (let i=0;i<purchases.length;i++){
                let query2 = `INSERT INTO purchases( shopid, productid, quantity, price ) VALUES ($1,$2,$3,$4)`;
                client.query(query2, [ purchases[i].shopId, purchases[i].productid, purchases[i].quantity, purchases[i].price ], function(err, result) {
                    if(err){
                        console.log("error : ", err);
                    }
                    else {
                        console.log("Successfully inserted. Affected rows : ",result.rowCount);
                    }
                });
            }
            res.send("Successfully Reset the Data.");
        }
        
    });
});