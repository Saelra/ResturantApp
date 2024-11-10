/**
 * @description
 * This file handles the interaction with the API.
 * It provides functions for loading menu items, adding new items, and removing existing items
 * from the database.
 *
 * @author Ratanachat Saelee
 * @date 11/5/24
 */

"use strict";

/**
 * Fetches the list of menu items and displays them on the page.
 *
 * @async
 * @function loadMenu
 * @returns {Promise<void>} A promise that resolves when the menu items have been successfully loaded and displayed.
 * @throws {Error} If there is an error loading menu items from the server.
 */
async function loadMenu() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";
  try {
    const menuItems = await fetchMenuItems();
    displayMenuItems(menuItems);
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Fetches menu items from the server.
 *
 * @async
 * @function fetchMenuItems
 * @returns {Promise<Array>} The list of menu items.
 * @throws {Error} If there is an error fetching the menu items.
 */
async function fetchMenuItems() {
  const response = await fetch("/api/menu");
  if (!response.ok) {
    throw new Error(`Failed to load menu: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Displays the fetched menu items on the page.
 *
 * @function displayMenuItems
 * @param {Array} menuItems The list of menu items to display.
 */
function displayMenuItems(menuItems) {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  menuItems.forEach((item) => {
    const listItem = createMenuItemElement(item, false);
    menuList.appendChild(listItem);
  });
}

/**
 * Creates a list item element for a menu item (with or without delete button).
 *
 * @function createMenuItemElement
 * @param {Object} item The menu item data.
 * @param {boolean} showDelete Whether to show the delete button.
 * @returns {HTMLElement} The created list item element.
 */
function createMenuItemElement(item, showDelete = false) {
  const listItem = document.createElement("li");

  const itemName = document.createElement("h2");
  itemName.textContent = item.FoodName;

  const itemPrice = document.createElement("p");
  itemPrice.textContent = `Price: $${item.Price}`;

  const itemDescription = document.createElement("p");
  itemDescription.textContent = `Description: ${item.Description}`;

  listItem.appendChild(itemName);
  listItem.appendChild(itemPrice);
  listItem.appendChild(itemDescription);

  if (showDelete) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    deleteButton.dataset.foodid = item.FoodID;
    deleteButton.dataset.foodname = item.FoodName;

    deleteButton.addEventListener("click", () =>
      handleDelete(item.FoodID, item.FoodName)
    );

    listItem.appendChild(deleteButton);
  }

  return listItem;
}

/**
 * Displays an error message on the page.
 *
 * @function showError
 * @param {string} message The error message to display.
 */
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = `${message || "Please try again later."}`;
}

/**
 * Adds a new menu item.
 *
 * @async
 * @function addItem
 * @returns {Promise<void>} A promise that resolves when the new menu item has been added successfully.
 * @throws {Error} If there is an error adding the item to the menu.
 */
async function addItem() {
  const FoodName = document.getElementById("FoodName").value;
  const Price = document.getElementById("Price").value;
  const Description = document.getElementById("Description").value;

  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  try {
    const response = await postMenuItem({ FoodName, Price, Description });
    if (response.ok) {
      await removeItem();
      errorMessage.textContent = "";
    } else {
      throw new Error(`Failed to add item: ${response.statusText}`);
    }
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Sends a POST request to add a new item.
 *
 * @async
 * @function postMenuItem
 * @param {Object} item The menu item data to send.
 * @returns {Promise<Response>} The response from the server.
 */
async function postMenuItem(item) {
  return await fetch("/api/menu", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
}

/**
 * Handles the delete action for a menu item.
 *
 * @async
 * @function handleDelete
 * @param {string} foodID The ID of the food item to delete.
 * @param {string} foodName The name of the food item to delete.
 */
async function handleDelete(foodID, foodName) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = "";

  const confirmation = confirm(
    `Are you sure you want to delete "${foodName}"?`
  );
  if (!confirmation) return;

  try {
    const response = await fetch(`/api/menu/${foodID}`, {
      method: "DELETE",
    });

    if (response.ok) {
      errorMessage.textContent = "";
      await removeItem();
    } else {
      throw new Error(`Failed to remove item: ${response.statusText}`);
    }
  } catch (error) {
    showError(error.message);
  }
}

/**
 * List of menu items to remove on the page.
 *
 * @async
 * @function removeItem
 * @returns {Promise<void>}
 */
async function removeItem() {
  const menuList = document.getElementById("remove-list");
  menuList.innerHTML = "";

  try {
    const menuItems = await fetchMenuItems();
    menuItems.forEach((item) => {
      const listItem = createMenuItemElement(item, true);
      menuList.appendChild(listItem);
    });
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Sets up event listeners for the DOM elements when the document is fully loaded.
 * Initializes the pages.
 *
 * @function setupEventListeners
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/") {
    loadMenu();
  }

  if (window.location.pathname === "/manage") {
    removeItem();

    const addItemForm = document.getElementById("add-item-form");
    addItemForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await addItem();
      addItemForm.reset();
    });
  }
});
