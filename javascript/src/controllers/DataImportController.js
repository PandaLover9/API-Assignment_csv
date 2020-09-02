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

// TODO: Please implement Question 1 requirement here
const dataImportHandler = async (req, res, next) => {

  const { file } = req;

  try {
    const data = await convertCsvToJson(file.path);
    const tobe_update = [];

    data.forEach(d => {
      if (d['toDelete'] == 1) {

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
    return next(err);
  }

  return res.sendStatus(NO_CONTENT);
}

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
