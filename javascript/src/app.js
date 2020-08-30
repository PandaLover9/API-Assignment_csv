import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router.js';
import globalErrorHandler from './config/globalErrorHandler.js';

import ejs from 'ejs';
const App = Express();

App.use(compression());
App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded( { extended: true } ));
App.set('view engine', 'ejs');
App.use('/api', router);
App.use(globalErrorHandler);



export default App;

App.get('/', function(req, res){
  res.render('upload');
});

App.get('/api/upload', function(req, res){
  res.render('upload');
});

App.get('/api/class/students', function(req, res){
  res.render('studentlisting');
});
