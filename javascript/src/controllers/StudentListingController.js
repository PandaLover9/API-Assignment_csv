//code from DataImportController
import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import sequelize from '../config/database';

const LOG = new Logger('StudentListingController.js');
const SchoolModel = require('../models/school');
const School = SchoolModel(sequelize);
const StudentListingController = Express.Router();

//from github example
const querystring = require('querystring');
const seq = require('sequelize-easy-query');

const { QueryTypes } = require('sequelize');


const studentlistingcontroller = async (req, res, next) => {


  try {
    LOG.info("HAHA" + School.primaryKeyAttributes);
    console.log("haha code runs here at least.")

    //select records from classCode
    let students = await School.findAll({
      where: seq('raw query string', {
        filterBy: ['classCode'],
       }),
     })

    students = await sequelize.query("SELECT * FROM `schools`", { type: QueryTypes.SELECT });

     //Order in alphabetical order
     students = await School.findAll({
      order: seq('raw query string', {
         order: {
           studentName: 'DESC'
         }
       })
     })
  }

  catch (err) {
    LOG.error(err)
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}

StudentListingController.get('/class/students', upload.single('data'), studentlistingcontroller());

export default StudentListingController;
