const { DataTypes } = require('sequelize');
import sequelize from '../config/database'

const School = sequelize.define('school', {
  teacherEmail: { type: DataTypes.STRING(128), allowNull: false, primaryKey: true },
  teacherName: { type: DataTypes.STRING(128) },
  studentEmail: { type: DataTypes.STRING(128), allowNull: false, primaryKey: true },
  studentName: { type: DataTypes.STRING(128) },
  classCode: { type: DataTypes.STRING(128), allowNull: false, primaryKey: true },
  className: { type: DataTypes.STRING(128) },
  subjectCode: { type: DataTypes.STRING(128), allowNull: false, primaryKey: true },
  subjectName: { type: DataTypes.STRING(128) }
})
module.exports =  School;
