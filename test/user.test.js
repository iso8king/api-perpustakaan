import supertest from "supertest";
import { web } from "../src/application/web.js";
import { removeTestUser } from "./test.util.js";

describe("POST /api/users/register" , ()=>{
    afterEach(async()=>{
        await removeTestUser();
    })

    it('should create user in db' , async()=>{
        const result = await supertest(web).post('/api/users/register').send({
            email : "test@test.com",
            password : "test",
            nama : "test",
            role : "user"
        });

        expect(result.body.data.email).toBe("test@test.com");
        expect(result.body.data.nama).toBe("test");
        expect(result.body.data.role).toBe("user");
    })
})
