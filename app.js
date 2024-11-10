/**
 * @description
 * This file sets up an Express.js web server for a restaurant management application.
 * It handles API routes for retrieving, adding, and deleting menu items from an SQLite database.
 *
 * @dependencies
 * - express: A web framework for Node.js to handle routing and server-side logic.
 * - sqlite3: A SQLite library used for interacting with the database.
 * - sqlite: An SQLite interface for Promises, providing an easier async API.
 * - path: A core Node.js module for resolving file and directory paths.
 *
 * @author Ratanachat Saelee
 * @date 11/5/24
 */

"use strict";
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const path = require("path");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/**
 * Establishes a connection to the SQLite database.
 *
 * @async
 * @function getDBConnection
 * @returns {Promise<sqlite.Database>} The SQLite database connection object.
 */
async function getDBConnection() {
  return sqlite.open({
    filename: path.join(__dirname, "RESTURANT.db"),
    driver: sqlite3.Database,
  });
}

/**
 * Retrieves all menu items from the database.
 *
 * @async
 * @function getMenuItemsFromDB
 * @returns {Promise<Array>} A list of all menu items in the database.
 * @throws {Error} If there is an error accessing the database or retrieving the items.
 */
async function getMenuItemsFromDB() {
  const db = await getDBConnection();
  const items = await db.all("SELECT * FROM menu");
  db.close();
  return items;
}

/**
 * Handles the GET request to fetch all menu items.
 *
 * @async
 * @function getMenu
 * @param {Object} req The request object.
 * @param {Object} res The response object.
 * @returns {void} Sends the JSON response containing the menu items.
 * @throws {Error} If there is an error while fetching the menu items.
 */
app.get("/api/menu", async (req, res) => {
  try {
    const items = await getMenuItemsFromDB();
    res.setHeader("Content-Type", "application/json");
    res.json(items);
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Error retrieving menu items" });
  }
});

/**
 * Inserts a new menu item into the database.
 *
 * @async
 * @function insertMenuItem
 * @param {string} FoodName The name of the food item.
 * @param {number} Price The price of the food item.
 * @param {string} Description A description of the food item.
 * @returns {Promise<void>} A promise that resolves once the item is inserted.
 * @throws {Error} If there is an error inserting the menu item into the database.
 */
async function insertMenuItem(FoodName, Price, Description) {
  const db = await getDBConnection();
  await db.run(
    "INSERT INTO menu (FoodName, Price, Description) VALUES (?, ?, ?)",
    [FoodName, Price, Description]
  );
  db.close();
}

/**
 * Handles the POST request to add a new menu item.
 *
 * @async
 * @function addMenuItem
 * @param {Object} req The request object containing the new menu item data.
 * @param {Object} req.body The body of the request, which includes:
 * @param {string} req.body.FoodName The name of the food item.
 * @param {number} req.body.Price The price of the food item.
 * @param {string} req.body.Description The description of the food item.
 * @param {Object} res The response object.
 * @returns {void} Sends a success message if the item is added.
 * @throws {Error} If there is an error while adding the menu item.
 */
app.post("/api/menu", async (req, res) => {
  const { FoodName, Price, Description } = req.body;

  if (Price < 0) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({
      error: "Price must be a positive number.",
    });
  }
  try {
    await insertMenuItem(FoodName, Price, Description);
    res.setHeader("Content-Type", "application/json");
    res.json({ message: "Item added successfully" });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res
      .status(500)
      .json({ error: "Internal Server Error: Please try again later." });
  }
});

/**
 * Deletes a menu item from the database by FoodID.
 *
 * @async
 * @function deleteMenuItemFromDB
 * @param {number} foodID The ID of the food item to delete.
 * @returns {Promise<void>} A promise that resolves once the item is deleted.
 * @throws {Error} If there is an error deleting the menu item from the database.
 */
async function deleteMenuItemFromDB(foodID) {
  const db = await getDBConnection();
  await db.run("DELETE FROM menu WHERE FoodID = ?", [foodID]);
  db.close();
}

/**
 * Handles the DELETE request to remove a menu item by FoodID.
 *
 * @async
 * @function removeMenuItem
 * @param {Object} req The request object, containing the FoodID in the parameters.
 * @param {Object} req.params The request parameters, which includes:
 * @param {number} req.params.id The FoodID of the menu item to delete.
 * @param {Object} res The response object.
 * @returns {void} Sends a success message once the item is deleted.
 * @throws {Error} If there is an error while deleting the menu item.
 */
app.delete("/api/menu/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteMenuItemFromDB(id);
    res.setHeader("Content-Type", "application/json");
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ error: "Error deleting menu item" });
  }
});

/**
 * The main home page HTML file.
 *
 * @function serveHomePage
 * @param {Object} req The HTTP request object.
 * @param {Object} res The HTTP response object.
 * @returns {void} Responds with the home page HTML.
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/**
 * The manage page HTML file.
 *
 * @function serveManagePage
 * @param {Object} req The HTTP request object.
 * @param {Object} res The HTTP response object.
 * @returns {void} Responds with the manage page HTML.
 */
app.get("/manage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "manage.html"));
});

/**
 * Starts the Express server and listens on the specified port.
 *
 * @function startServer
 * @returns {void} Starts the server and logs a success message.
 */
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} else {
  module.exports = app; // Export app for testing
}
