import Express from 'express';
import Logger from '../config/logger';

const StudentListController = Express.Router();
const LOG = new Logger('StudentListController.js');
const School = require('../models/school');
const axios = require('axios').default;


// TODO: Please implement Question 1 requirement here
const studentListHandler = async (req, res, next) => {

  const reqClassCode = req.params.classCode;
  const offset = (req.query.offset === undefined) ? 0 : req.query.offset;
  const limit = (req.query.limit === undefined) ? 10 : req.query.limit;

  // error handling
  if(offset < 0) {
    res.status(400);
    res.send('Offset cannot be negative');
  } else if (limit < 0 ) {
    res.status(400);
    res.send('Limit cannot be negative');
  }

  var internalStudent = {};
  let internalCountIndex = 0;
  let internalCount = 0;

  try {
    internalStudent = await School.findAll({
      attributes: ['studentEmail', 'studentName'],
      group: ['studentEmail', 'studentName'],
      where: {
        classCode: reqClassCode
      }
    });

    internalCountIndex = await School.count({
      distinct: true,
      where: {
        classCode: reqClassCode
      }
    });

    LOG.info(JSON.stringify(internalCountIndex))

    internalCount = internalCountIndex + 1;
  } catch (err) {
    LOG.error(err);
    res.status(503);
    res.send('Database unreachable');
    return next(err);
  }

  var externalStudent = [];
  let exCount = 0;
  let exLimit = limit - internalCount;


  //To check whether the internal count reaches limit query
  if(exLimit > 0) {
    // the route is http://school-administration-system-external:5000 if you run your node.js inside docker.
    const externalUrl = `http://localhost:5000/students?class=${reqClassCode}&offset=${offset}&limit=${exLimit}`
    try {
      const resp = await axios.get(externalUrl);
      externalStudent.push(... resp.data.students);
      exCount = resp.data['count'];
    } catch (err) {
      LOG.error(err);
      res.status(503);
      res.send('External server unreachable');
      return next(err);
    }
  }


  var output = {
    count: 0,
    students: []
  }

  //Count the number of final output
  output.count = limit;
  output.students.push(... internalStudent)
  output.students.push(... externalStudent)


  return res.send(JSON.stringify(output, null, 2));
}

StudentListController.get('/class/:classCode/students', studentListHandler);

export default StudentListController;
