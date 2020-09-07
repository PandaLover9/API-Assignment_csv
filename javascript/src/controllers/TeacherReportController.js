import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import sequelize from '../config/database';


const TeacherReportController = Express.Router();
const LOG = new Logger('StudentListController.js');
const School = require('../models/school');


const teacherReportHandler = async (req, res, next) => {

  try {

    const teacherReport = await School.findAll({
      group: ['teacherName', 'subjectCode', 'subjectName'],
      attributes: [ 'teacherName', 'subjectCode', 'subjectName', [sequelize.literal('count(DISTINCT classCode)'),'numberOfClasses']]
    });


    var output = {
      count: 0,
      subjectDetails: []
    }

    output.count = teacherReport.length;
    output.subjectDetails.push(... teacherReport)

  } catch (err) {
    LOG.error(err)
    res.status(503);
    res.send('Local Server unreachable');
    return next(err);
  }

  return res.send(JSON.stringify(output, null, 2));
}

TeacherReportController.get('/report/workload', teacherReportHandler);

export default TeacherReportController;
