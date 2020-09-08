import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import sequelize from '../config/database';


const TeacherReportController = Express.Router();
const LOG = new Logger('StudentListController.js');
const School = require('../models/school');

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

const teacherReportHandler = async (req, res, next) => {

  try {

    const teacherReport = await School.findAll({
      group: ['teacherName', 'subjectCode', 'subjectName'],
      attributes: [ 'teacherName','subjectCode', 'subjectName', [sequelize.literal('count(DISTINCT classCode)'),'numberOfClasses']]
    });

    const groupTecher = groupBy(teacherReport, 'teacherName');

    var output = {};


    for (const [key, value] of Object.entries(groupTecher)) {
      output[key] = [];
      value.forEach(v => output[key].push(v));
    }

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
