import { prismaClient } from "../src/application/database.js";

export const removeTestUser = async()=>{
    await prismaClient.user.delete({
        where : {
            email : "test@test.com"
        }
    });
}