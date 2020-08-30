import 'dotenv/config';
import sequelize from './config/database';
import Logger from './config/logger';
import App from './app';

const MAX_RETRY = 20;
const LOG = new Logger('server.js');
const { PORT = 3000 } = process.env;
const SchoolModel = require('./models/school')

const startApplication = async (retryCount) => {
  try {

    SchoolModel(sequelize)

    await sequelize.authenticate();
    App.listen(PORT, '0.0.0.0',() => {
      LOG.info(`Application started at http://localhost:${PORT}`);
    });

    await sequelize.sync({ force: true });

  } catch (e) {
    LOG.error(e);

    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000);
      return;
    }

    LOG.error('Unable to start application');
  }
};

startApplication(MAX_RETRY);
