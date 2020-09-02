import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import sequelize from '../config/database';


const TeacherReportController = Express.Router();
const LOG = new Logger('StudentListController.js');
const SchoolModel = require('../models/school');
const axios = require('axios').default;

const School = SchoolModel(sequelize);


const teacherReportHandler = async (req, res, next) => {

  try {

    //internal system
    const teacherReport = await School.findAll({
      group: ['teacherName'],
      attributes: ['subjectCode', 'subjectName', [sequelize.fn('count', sequelize.col('classCode')), 'numberOfClasses']],
    });

    var output = {
      count: 0,
      subjectDetails: []
    }


    output.count = teacherReport.length;
    output.subjectDetails.push(... teacherReport)



  } catch (err) {
    LOG.error(err)
    return next(err);
  }

  return res.send(JSON.stringify(output, null, 2));
}

TeacherReportController.get('/report/workload', teacherReportHandler);

export default TeacherReportController;
