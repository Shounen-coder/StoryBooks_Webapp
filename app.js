const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectdb = require('./config/db');
const methodOverride = require('method-override');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const session = require('express-session')
const passport = require('passport');   
const MongoStore = require('connect-mongo')

// Load configuration
dotenv.config({path: './config/config.env'});

//passport config
require('./config/passport')(passport)

const app = express();
connectdb()

//Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//For logging purposes
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//handlebars helpers
const {formatDate,stripTags,truncate,editIcon,select} = require('./helpers/hbs')

//handlebars
app.engine('hbs', engine({ 
    helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
},
    defaultLayout: 'main',
    extname: 'hbs' })
)

app.set('view engine', 'hbs');

//Sessions

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}))



//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global var
app.use((req, res, next) => {
  res.locals.user = req.user || null;  // make user available in all templates
  next();
  });
  

// app.get('/', (req, res) => {
//     res.render('index', {layout: false});
// });

// app.get('/about', (req, res) => {
//     res.render('about', {layout: false});
// });
//static folders
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));

const PORT = process.env.PORT || 5000; 

app.listen(
    PORT,
    console.log(`Server running at ${process.env.NODE_ENV} mode on port ${PORT}`)
);