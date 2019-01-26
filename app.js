const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
const ObjectId = mongojs.ObjectId;
const app = express();

// const logger = function(req, res, next){
//     console.log('Loggin...');
//     next();
// }
//app.use(logger);

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global consts
app.use((req, res, next) => {
    res.locals.errors = null;
    next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        const namespace = param.split('.'),
              root = namespace.shift(),
              formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/', (req, res) => {
    db.users.find((err, docs)=>{
        console.log(docs);
        res.render('index', {
            title: 'Customers',
            users: docs
        });
;    });
});

app.post('/users/add', (req, res) => {
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    const errors = req.validationErrors();

    if(errors){
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors

        });
        return
    } else {
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }

        db.users.insert(newUser,(err, result)=>{
            if(err){
                console.log(err);
                return
            }
            res.redirect('/');
        });

        console.log('\n success \n');
        console.log(newUser);
    }
});

app.delete('/users/delete/:id', (req, res) =>{
    db.users.remove({_id: ObjectId(req.params.id)}, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server started on Port 3000...');
});