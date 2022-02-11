const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//hompage rout

app.get('/', (req,res) =>{
    return res.send({
        error:false,
        message:'Welcome to RESful CRUD API',
        written_by:'Adisak'
    });

});

//connect to mysql database
const dbCon = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'

})
dbCon.connect();

//retrieve all persons
app.get('/persons',(req, res)=>{
    dbCon.query('SELECT * FROM persons',(error,results,fields) => {
        if(error) throw errror;

        let message=""
        if(results === undefined || results.length == 0){
            message = "Persons table is empty";

        }else{
            message = "Successfully retrueve all persons";
        }

        return res.send({error:false, data:results ,message:message});

    })
})

// add persons

app.post('/person', (req, res) => {
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;


    //validation
    if(!first_name || !last_name || !email) {
        return res.status(400).send({error:true, message:"Please insert data"});


    }else{
        dbCon.query('INSERT INTO persons (first_name,last_name,email) VALUES(?,?,?)',[first_name,last_name,email] , (error,results,fields) =>{
            if(error) throw error;
            return res.send({error:false, data:results, message:'Person successfully added'});
        }) 
    }
})

//retrieve person by id
app.get('/person/:id', (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error:true, message:"Please provide person id"});

    }else{
        dbCon.query('SELECT * FROM persons WHERE id=?',id ,(error, results, fields) => {
            if (error) throw error;

            let message = '';
            if(results === undefined || results.length == 0){
                message = "Person not found";

            }else{
                message = "Successfully retrieved person data";
            }

            return res.send({error:false, data:results[0], message:message});
        })
    }
})



//update persons with id
app.put('/person', (req, res) => {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;

    //validate
    if(!id || !first_name || !last_name || !email){

        return res.status(400).send({error:true ,message:'Please provide person id, firstname, lastname,email'});


    }else{
        dbCon.query('UPDATE persons SET first_name=?, last_name=? , email=?  WHERE id=? ',[first_name, last_name, email, id], (error, results, fields) =>{
            if(error) throw error;
            let message = "";

            if(results.changedRows === 0){
                message = "Person not found or data are same";
            } else{
                message = "Person successfully updated";
            }
            return res.send({error:false, data:results, message:message})
        })
    }
})

//delete person by id
app.delete('/person',(req, res) =>{
    let id = req.body.id;

    if(!id){
        return res.status(400).send({ error:true , message:'Please provide person id'});
    }else{
        dbCon.query('DELETE FROM persons WHERE id=?',[id],(error, results, fields) => {
            if(error) throw error;

            let message = '';
            if(results.affectedRows === 0 ){
                message = 'Person not found';

            }else{
                message = 'Person successfully deleted';
            }

            return res.send({ error:false, data:results, message:message});
        })
    }
})




//listen

app.listen(8000,()=>{
    console.log('running on port 8000')

});

module.exports = app;