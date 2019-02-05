const request = require("supertest");
const server = require("./server");

afterEach(async () => {
  await db("stories").truncate();
  await db("users").truncate();
});

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

    it("should respond with status code 422 if information is incomplete", async () => {
      let response = await request(server)
        .post("/api/register")
        .send({ username: "Austin" });

      expect(response.status).toBe(422);
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

      expect(response).toContain("League of Legends");
      expect(response).toContain("DOTA");
    });

    it("should return an empty array if nothing is there", async () => {
      let response = await request(server).get("/api/stories");
      expect(response).toEqual([]);
    });
  });

  describe("GET /STORIES/:ID endpoint", () => {
    it("should get the story at the ID", async () => {
      let dota = await request(server)
        .post("/api/stories")
        .send({ title: "DOTA", description: "MOBA", story: "this is a story", date: '1/1/19', country: 'USA', user_id: 1 });
      let response = await request(server).get("/api/stories/:id");

      expect(dota).toBe(1);
      expect(response.id).toBe(1);
    });

    it("should send back 404 if ID doesnt exist", async () => {
      let response = await request(server).get("/api/stories/15");
      expect(response.status).toBe(404);
    });
  });
});
