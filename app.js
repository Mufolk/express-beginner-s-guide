const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

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

app.listen(3000, () => {
    console.log('Server started on Port 3000...');
});