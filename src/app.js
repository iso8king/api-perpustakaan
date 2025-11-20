import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

logger.info("App loaded in port 9999");
// web.listen(9999)

export default web;

