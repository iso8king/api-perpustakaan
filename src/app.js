import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

web.listen(9999 , ()=>{
    logger.info("App Listen at port 9999");
});

