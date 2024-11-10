CREATE TABLE MENU (
    FoodID          INTEGER            		PRIMARY KEY,
    FoodName        VARCHAR(50)        	NOT NULL,
    Price           DECIMAL(10, 2)      NOT NULL,
    Description     TEXT                NOT NULL
);

CREATE TABLE ORDERS (
    OrderID         INTEGER             PRIMARY KEY,
    OrderDate       DATETIME            NOT NULL,
    CustomerName    VARCHAR(50)         NOT NULL,
    OrderTotal		DECIMAL(10, 2)		NOT NULL
);

CREATE TABLE ORDER_DETAILS (
    OrderDetailID   INTEGER             PRIMARY KEY,
    OrderID         INTEGER             NOT NULL,
    FoodID          INTEGER 			NOT NULL,
    Quantity        INTEGER             NOT NULL,
    CONSTRAINT      OrderDetail_Order   FOREIGN KEY (OrderID) REFERENCES ORDERS (OrderID)
                                        ON DELETE CASCADE,
    CONSTRAINT      OrderDetail_Menu    FOREIGN KEY (FoodID) REFERENCES MENU (FoodID)
                                        ON DELETE CASCADE
);


INSERT INTO MENU (FoodName, Price, Description) VALUES
('Spaghetti Carbonara', 12.50, 'Classic Italian pasta with creamy sauce, bacon, and parmesan.'),
('Margherita Pizza', 10.00, 'Traditional pizza with tomato, mozzarella, and basil.'),
('Cheeseburger', 8.50, 'Grilled beef patty with cheddar cheese, lettuce, and tomato.'),
('Caesar Salad', 7.00, 'Fresh romaine lettuce, parmesan, croutons, and Caesar dressing.'),
('Fish Tacos', 9.50, 'Soft tacos filled with grilled fish, slaw, and a creamy sauce.'),
('Chicken Alfredo', 13.00, 'Fettuccine pasta with creamy alfredo sauce and grilled chicken.'),
('Vegetable Stir-Fry', 11.00, 'Stir-fried vegetables with soy sauce and a hint of sesame oil.'),
('BBQ Ribs', 15.00, 'Tender pork ribs glazed with BBQ sauce, served with fries.'),
('Tuna Poke Bowl', 14.00, 'Fresh tuna, rice, avocado, and seaweed salad in a sesame dressing.'),
('Lamb Shawarma', 16.00, 'Slow-cooked lamb wrapped in pita with garlic sauce and vegetables.');

INSERT INTO ORDERS (OrderDate, CustomerName, OrderTotal) VALUES
('2024-11-01 12:45:00', 'John Doe', 32.50),
('2024-11-01 13:10:00', 'Jane Smith', 23.00),
('2024-11-01 13:30:00', 'Emily White', 47.00),
('2024-11-01 14:00:00', 'Michael Brown', 21.50),
('2024-11-01 14:15:00', 'Linda Green', 50.00),
('2024-11-02 16:00:00', 'Chris Johnson', 19.00),
('2024-11-02 16:30:00', 'Alice Davis', 36.00),
('2024-11-02 17:00:00', 'David Miller', 28.00),
('2024-11-03 18:00:00', 'Sophia Lee', 44.50),
('2024-11-03 18:30:00', 'James Wilson', 60.00);

INSERT INTO ORDER_DETAILS (OrderID, FoodID, Quantity) VALUES
(1, 1, 1),
(1, 3, 1),
(2, 2, 2),
(3, 4, 1),
(3, 6, 2),
(4, 7, 1),
(5, 8, 1),
(6, 9, 2),
(7, 5, 3),
(8, 10, 1),
(9, 2, 1),
(9, 3, 2),
(10, 6, 2),
(10, 7, 1);