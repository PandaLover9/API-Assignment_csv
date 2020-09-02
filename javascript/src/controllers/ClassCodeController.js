import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import sequelize from '../config/database';


const ClassCodeController = Express.Router();
const LOG = new Logger('DataImportController.js');
const SchoolModel = require('../models/school');
const School = SchoolModel(sequelize);


const classcodecontroller = async (req, res, next) => {
  const reqClassCode = req.params.classCode;
  const reqClassName = req.body.className;
  console.log(reqClassName);
  console.log(reqClassCode);
  try {

    await School.update({className: reqClassName},{
      where: {
        classCode: reqClassCode
      }
    });



  } catch (err) {
    LOG.error(err)
    return next(err);
  }
  console.log(res.sendStatus);
  return res.sendStatus(NO_CONTENT);
}

ClassCodeController.put('/class/:classCode', classcodecontroller);

export default ClassCodeController;
