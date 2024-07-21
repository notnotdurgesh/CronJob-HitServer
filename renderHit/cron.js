import cron from 'cron';
import axios from 'axios';
import dotenv from 'dotenv';
import winston from 'winston';
import pLimit from 'p-limit';

dotenv.config();

const urls = [...new Set(process.env.BACKEND_URL.split(','))];
const cronSchedule = process.env.CRON_SCHEDULE || '*/14 * * * * *';
const maxRetries = parseInt(process.env.MAX_RETRIES, 10) || 3;
const concurrencyLimit = parseInt(process.env.CONCURRENCY_LIMIT, 10) || 5;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'cron.log' })
  ],
});

const performRequests = async (retryCount = 0) => {
  const limit = pLimit(concurrencyLimit);
  const errorMessages = [];

  try {
    const requests = urls.map(url => limit(async () => {
      try {
        const response = await axios.post(url);
        if (response.status === 200 || response.status === 400) {
          logger.info(`Successfully hit ${url} with status code: ${response.status}`);
        } else {
          throw new Error(`Failed to hit ${url} with status code: ${response.status}. Response body: ${response.data}`);
        }
      } catch (error) {
        errorMessages.push(`Error hitting ${url}: ${error.message}`);
        throw error;  // Ensure failed requests are propagated
      }
    }));

    await Promise.all(requests);
  } catch (error) {
    if (retryCount < maxRetries) {
      logger.warn(`Retry ${retryCount + 1}/${maxRetries} - Errors: ${errorMessages.join(', ')}`);
      setTimeout(() => performRequests(retryCount + 1), 1000); // Retry after 1 second
    } else {
      logger.error(`Max retries reached. Errors: ${errorMessages.join(', ')}`);
      // Optional: Handle max retry exceeded case, e.g., additional logging
    }
  }
};

const job = new cron.CronJob(cronSchedule, function () {
  logger.info('Initiating server restart process');
  performRequests();
});

job.start();

// Export the cron job.
export { job };
