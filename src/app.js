import { logger } from "./application/logging.js";
import { web } from "./application/web.js";
import { scheduleCleanup } from "./application/cron.js";

logger.info("App loaded in port 9999");
// web.listen(9999)

export default web;

