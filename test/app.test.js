const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sqlite = require("sqlite");
const app = require("../app");

describe("GET /api/menu", () => {
  it("should return a list of menu items", async () => {
    const res = await request(app).get("/api/menu");

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should return a 500 error with the correct error message when there is a failure retrieving menu items", async () => {
    const dbMock = sinon.stub(sqlite, "open").callsFake(async () => {
      return {
        run: () => {
          throw new Error("Database error");
        },
      };
    });

    try {
      const response = await request(app)
        .get("/api/menu")
        .set("Accept", "application/json");
      expect(response.body).to.deep.equal({
        error: "Error retrieving menu items",
      });
    } finally {
      sinon.restore();
    }
  });
});

describe("POST /api/menu", () => {
  it("should add a new menu item", async () => {
    const newItem = {
      FoodName: "Test Food",
      Price: 15.99,
      Description: "A tasty test food",
    };

    const res = await request(app)
      .post("/api/menu")
      .send(newItem)
      .set("Content-Type", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Item added successfully");
  });

  it("should return an error when price is negative", async () => {
    const invalidItem = {
      FoodName: "Test Food",
      Price: -5,
      Description: "An invalid test food",
    };

    const res = await request(app)
      .post("/api/menu")
      .send(invalidItem)
      .set("Content-Type", "application/json");

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Price must be a positive number.");
  });

  it("should return a 500 error", async () => {
    const dbMock = sinon.stub(sqlite, "open").callsFake(async () => {
      return {
        run: () => {
          throw new Error("Database error");
        },
      };
    });

    try {
      const response = await request(app)
        .post("/api/menu")
        .send({
          FoodName: "Pizza",
          Price: 9.99,
          Description: "A delicious cheese pizza",
        })
        .set("Accept", "application/json");

      expect(response.status).to.equal(500);

      expect(response.body).to.deep.equal({
        error: "Internal Server Error: Please try again later.",
      });
    } finally {
      sinon.restore();
    }
  });
});

describe("DELETE /api/menu/:id", () => {
  it("should delete a item", async () => {
    const newItem = {
      FoodName: "Test Food for Deletion",
      Price: 10.99,
      Description: "This food will be deleted",
    };

    const res = await request(app)
      .post("/api/menu")
      .send(newItem)
      .set("Content-Type", "application/json");

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Item added successfully");

    const getRes = await request(app).get("/api/menu");
    const item = getRes.body.find(
      (i) => i.FoodName === "Test Food for Deletion"
    );
    const itemId = item.FoodID;

    const deleteRes = await request(app).delete(`/api/menu/${itemId}`);
    expect(deleteRes.status).to.equal(200);
    expect(deleteRes.body.message).to.equal("Item deleted successfully");
  });

  it("should return a 500 error", async () => {
    const dbMock = sinon.stub(sqlite, "open").callsFake(async () => {
      return {
        run: () => {
          throw new Error("Database error");
        },
      };
    });

    const response = await request(app).delete("/api/menu/999");
    expect(response.status).to.equal(500);
    expect(response.body).to.deep.equal({ error: "Error deleting menu item" });
  });
});

describe("GET /manage", () => {
  it("should serve the manage.html file", async () => {
    const response = await request(app).get("/manage");
    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.include("html");
  });
});
