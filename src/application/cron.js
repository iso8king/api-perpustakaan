import cron from "node-cron";
import { logger } from "./logging.js";
import userService from "../service/user-service.js";

export const scheduleCleanup = cron.schedule('0 0 * * *' , async()=>{
   try {
    logger.info("Starting cleanup user database older than 3y6m");
    const deletedUser = await userService.deleteUserWhoAlreadyGraduate();
    logger.info(`Success Deleted user with ${deletedUser} row affected`);
    
   } catch (error) {
    logger.error("Cleanup job failed", error);
   }
});

