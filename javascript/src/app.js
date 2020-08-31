import Express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router.js';
import globalErrorHandler from './config/globalErrorHandler.js';

import ejs from 'ejs';

//new features imported
// const CSVToJSON = require('csvtojson');
// const JSONToCSV = require('json2csv').parse;
// const fs = require('fs');



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

  // CSVToJSON().fromFile('C:/Users/chels/Downloads/Ufinity Assignment/interview-package-js/data.sample.csv').then(source => {
  //   console.log(source);
  //   let csv = JSONToCSV(source);
  //   source.forEach( data => {
  //
  //     if(data['classCode'] === 'P1-1') {
  //       csv = JSONToCSV(data, {fields: ["studentEmail", "studentName"] });
  //
  //     }
  //     console.log(csv);
  //     fs.writeFileSync('studentlist.csv', csv);
  //   });
  //
  // });
});
