import Express from 'express';
import DataImportController from './controllers/DataImportController';
import HealthcheckController from './controllers/HealthcheckController';
import StudentListController from './controllers/StudentListingController';
import ClassCodeController from './controllers/ClassCodeController';
import TeacherReportController from './controllers/TeacherReportController';



const router = Express.Router();

router.use('/', DataImportController);
router.use('/', HealthcheckController);
router.use('/', StudentListController);
router.use('/', ClassCodeController);
router.use('/', TeacherReportController);

export default router;
