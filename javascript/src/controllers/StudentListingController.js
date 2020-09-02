import Express from 'express';
import { NO_CONTENT } from 'http-status-codes';
import Logger from '../config/logger';
import sequelize from '../config/database';


const StudentListController = Express.Router();
const LOG = new Logger('StudentListController.js');
const SchoolModel = require('../models/school');
const axios = require('axios').default;

const School = SchoolModel(sequelize);

// TODO: Please implement Question 1 requirement here
const studentListHandler = async (req, res, next) => {

  const reqClassCode = req.params.classCode;
  const reqoffset = (req.query.offset === undefined) ? 0 : req.query.offset;
  const reqLimit = (req.query.limit === undefined) ? 10 : req.query.limit;

  console.log("Offset inserted from browser is: " + reqoffset);

  try {

    const internalStudent = await School.findAll({
      attributes: ['studentEmail', 'studentName'],
      where: {
        classCode: reqClassCode
      },
      offset: reqoffset
    });

    var output = {
      count: 0,
      students: []
    }

    const exLimit = reqLimit - internalStudent.length;

    var externalStudent = []
    var exCount = 0;
    if (exLimit > 0) {
      const externalUrl = `http://localhost:5000/students?class=${reqClassCode}&offset=${reqoffset}&limit=${exLimit}`;
      console.log(externalUrl);
      const resp = await axios.get(externalUrl);
      externalStudent.push(... resp.data.students);
      exCount = resp.data['count'];
    }

    output.count = internalStudent.length + exCount;
    output.students.push(... internalStudent)
    output.students.push(... externalStudent)

    // output = await output.students.findAll({
    //   //reqOffset
    //   offset: reqOffset,
    //   attributes: ['studentEmail', 'studentName'],
    //   where: {
    //     classCode: reqClassCode
    //   },
    //   order: {
    //     'id': 'DESC'
    //   }
    // });

  } catch (err) {
    LOG.error(err)
    return next(err);
  }

  return res.send(JSON.stringify(output, null, 2));
}

StudentListController.get('/class/:classCode/students', studentListHandler);

export default StudentListController;
