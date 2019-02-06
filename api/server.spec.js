const request = require("supertest");
const { server } = require("./server");
const db = require('../database/dbConfig')
const configureRoutes = require('../config/routes')



afterEach(async () => {
   return await db('users').truncate()
});

afterEach(async () => {
    return await db('stories').truncate()
})


describe("server.js tests", () => {
  describe("POST /REGISTER endpoint", () => {
    it("should respond with status code 201 OK", async () => {
      let response = await request(server)
        .post("/api/register")
        .send({
          username: "austin",
          password: "pass",
          country: "USA",
          title: "BEG",
          email: "austin@email.com"
        });

      expect(response.status).toBe(201);
    });

    it("should respond with status code 500 if information is incomplete", async () => {
      let response = await request(server)
        .post("/api/register")
        .send({ username: "Austin", password: null });

      expect(response.status).toBe(500)
    });

    it("should send back response as json", async () => {
      let response = await request(server)
        .post("/api/register")
        .send({
          username: "austin",
          password: "pass",
          country: "USA",
          title: "BEG",
          email: "austin@email.com"
        });

      expect(response.type).toMatch(/json/i);
    });

    it("should not let duplicate titles post", async () => {
      let league = await request(server)
        .post("/api/register")
        .send({
          username: "austin",
          password: "pass",
          country: "USA",
          title: "BEG",
          email: "austin@email.com"
        });
      let legends = await request(server)
        .post("/api/register")
        .send({
          username: "austin",
          password: "pass",
          country: "USA",
          title: "BEG",
          email: "austin@email.com"
        });

      expect(legends.status).toBe(405);
    });
  });

  describe("GET /STORIES endpoint", () => {
    it("should respond with status code 200 OK", async () => {
      let response = await request(server).get("/api/stories");

      expect(response.status).toBe(200);
    });

    it("should get a list of stories", async () => {
      let league = await request(server)
        .post("/api/stories")
        .send({ title: "League of Legends", description: "MOBA", story: "this is a story", date: '1/1/19', country: 'USA', user_id: 1 });
      let dota = await request(server)
        .post("/api/stories")
        .send({ title: "DOTA", description: "MOBA", story: "this is a story", date: '1/1/19', country: 'USA', user_id: 1 });
      let response = await request(server).get("/api/stories");

      expect(response.text).toContain("League of Legends");
      expect(response.text).toContain("DOTA");
    });

    it("should return an empty array if nothing is there", async () => {
      let response = await request(server).get("/api/stories");
      expect(response.text).toContain('[]');
    });
  });

})