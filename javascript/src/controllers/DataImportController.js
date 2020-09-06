import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');
const School = require('../models/school');

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function syncToFirst(data, uniqueField, syncField) {
  var group = groupBy(data, uniqueField);
  for (const [key, value] of Object.entries(group)) {
    data.filter(d => d[uniqueField] == key)
      .forEach(d => d[syncField] = value[value.length - 1][syncField]);
  }
}

// TODO: Please implement Question 1 requirement here
const dataImportHandler = async (req, res, next) => {

  const { file } = req;

  try {
    const data = await convertCsvToJson(file.path);
    const tobe_update = [];

    syncToFirst(data, 'teacherEmail', 'teacherName');
    syncToFirst(data, 'studentEmail', 'studentName');
    syncToFirst(data, 'classCode', 'classname');
    syncToFirst(data, 'subjectCode', 'subjectName');

    data.forEach(d => {
      if (d['toDelete'] == 1 || d['teacherEmail'] === '' || d['studentEmail'] === '' || d['classCode'] === '' || d['subjectCode'] === '') {

        const where = {}
        School.primaryKeyAttributes.forEach(p => {
          where[p] = d[p];
        })
        School.destroy({
          where: where
        })
      } else {
        delete d['toDelete'];
        tobe_update.push(d);
      }
    });

    await School.bulkCreate(
      tobe_update,
      { updateOnDuplicate: Object.keys(School.rawAttributes) }
    );

  } catch (err) {
    LOG.error(err)
    res.status(400);
    res.send('Wrong input file format or path, please insert correct file format or filepath.');
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}




DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
