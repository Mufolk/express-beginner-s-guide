const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

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

const users = [
    {
        id : 1,
        first_name : 'John',
        last_name : 'Doe',
        email : 'johndoe@gmail.com'
    },
    {
        id : 2,
        first_name : 'Bob',
        last_name : 'Smith',
        email : 'bobsmith@gmail.com'
    },
    {
        id : 3,
        first_name : 'Jill',
        last_name : 'Jackson',
        email : 'jjackson@gmail.com'
    }

];

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Customers',
        users: users
    });
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

        console.log('\n success \n');
        console.log(newUser);
    }
});

app.listen(3000, () => {
    console.log('Server started on Port 3000...');
});