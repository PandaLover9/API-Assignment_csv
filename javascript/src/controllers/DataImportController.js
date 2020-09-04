import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';
import sequelize from '../config/database';


const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');
const SchoolModel = require('../models/school');
const School = SchoolModel(sequelize);


const dataImportHandler = async (req, res, next) => {

  const { file } = req;

  try {
    const data = await convertCsvToJson(file.path);

    if(req.file.path == undefined)
    {
      throw new Error('Invalid file format, please insert a .csv file.')
    }
    const tobe_update = [];


    data.forEach(d => {
      if (d['toDelete'] == 1 || d['teacherEmail'] === '' || d['studentEmail'] === '' || d['classCode'] === '' || d['subjectCode'] === '')
      {
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
    console.log(err.status);
    if(err.status == undefined)
    {
      err.status = 400;
      console.log('Error message: '+ err + ',' +' Error status is ' + err.status);
    }


    //LOG.error(err)
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
