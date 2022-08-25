const express = require('express');
// const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const methodOverride = require('method-override');

const path = require('path');
const connectDB = require('./database/connect');

const homeRoute = require('./routes/home.route');
const userRoute = require('./routes/user.route');
const categoryRoute = require('./routes/category.route');
const blogCategoryRoute = require('./routes/blog-category.route');
const productRoute = require('./routes/product.route');
const collectionRoute = require('./routes/collection.route');
const blogRoute = require('./routes/blog.route');
const materialRoute = require('./routes/material.route');
const bannerRoute = require('./routes/banner.route');
const infoRoute = require('./routes/info.route');
const shopRoute = require('./routes/shop.route');
const pageRoute = require('./routes/page.route');
const orderRoute = require('./routes/order.route');
const contactRoute = require('./routes/contact.route');

// api
const bannerApiRoute = require('./routes/api/banner.route');
const infoApiRoute = require('./routes/api/info.route');
const productApiRoute = require('./routes/api/product.route');
const blogApiRoute = require('./routes/api/blog.route');
const blogCategoryApiRoute = require('./routes/api/blog-category.route');
const categoryApiRoute = require('./routes/api/category.route');
const collectionApiRoute = require('./routes/api/collection.route');
const materialApiRoute = require('./routes/api/material.route');
const shopApiRoute = require('./routes/api/shop.route');
const orderApiRoute = require('./routes/api/order.route');
const authApiRoute = require('./routes/api/auth.route');
const userApiRoute = require('./routes/api/user.route');
const contactApiRoute = require('./routes/api/contact.route');
const productEvaluateApiRoute = require('./routes/api/product-evaluate.route');

const app = express();
const post = process.env.POST || 5003;

// config
dotenv.config();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'resources/public')));
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
// app.use(morgan('combined'));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));
app.use(methodOverride('_method'));

// connect database
connectDB();

// template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            iq: (a, b, options) => {
                if (a == b) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
            not: (a, options) => {
                if (!a) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
            iq2: (a, b, c, d, options) => {
                if (a == b && c == d) {
                    return options.fn(this);
                }
                return options.inverse(this);
            },
            index_of: (context,ndx) => {
                return context[ndx];
            },
            number_with_comas: (num) => {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            number_with_comas_core: (a,b) => {
                const num = a * b;
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            in_array: (array,item,options) => {
                if(array.includes(item)) {
                    return options.fn(this);
                }else {
                    return options.inverse(this);
                }
            },
            sum: (a, b) => Number(a) + Number(b),
            minus: (a, b) => Number(a) - Number(b),
            makeDate: (time) => {
                const date = new Date(time);
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();

                return day + '-' + month + '-' + year;
            },
            paginate: require('handlebars-paginate'),
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));


// routers
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/blog-category', blogCategoryRoute);
app.use('/product', productRoute);
app.use('/collection', collectionRoute);
app.use('/blog', blogRoute);
app.use('/material', materialRoute);
app.use('/banner', bannerRoute);
app.use('/info', infoRoute);
app.use('/shop', shopRoute);
app.use('/page', pageRoute);
app.use('/order', orderRoute);
app.use('/contact', contactRoute);

// api
app.use('/api/banner', bannerApiRoute);
app.use('/api/info', infoApiRoute);
app.use('/api/product', productApiRoute);
app.use('/api/blog', blogApiRoute);
app.use('/api/blog-category', blogCategoryApiRoute);
app.use('/api/category', categoryApiRoute);
app.use('/api/collection', collectionApiRoute);
app.use('/api/material', materialApiRoute);
app.use('/api/shop', shopApiRoute);
app.use('/api/order', orderApiRoute);
app.use('/api/auth', authApiRoute);
app.use('/api/user', userApiRoute);
app.use('/api/contact', contactApiRoute);
app.use('/api/product-evaluate', productEvaluateApiRoute);

app.listen(post, () => {
    console.log('server runing in post ' + post);
});
