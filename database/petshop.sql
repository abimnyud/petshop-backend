-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 07, 2022 at 03:29 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `petshop`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_CancelOrder` (IN `_order_number` INT)   BEGIN
    DECLARE _status VARCHAR(255);
    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;

    SET _status = (
        SELECT status
        FROM orders
        WHERE order_number = _order_number
    );

    IF _status = 'paid' THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Order is already paid';
    ELSEIF _status = 'canceled' THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Order is already canceled';
    ELSE
        UPDATE orders
        SET status = 'canceled'
        WHERE order_number = _order_number;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_DeleteAdmin` (IN `_id` INT)   BEGIN
    UPDATE admins
    SET status = 'inactive'
    WHERE admin_id = _id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_DeleteMember` (IN `_id` INT)   BEGIN
    UPDATE orders
    SET member_id = NULL
    WHERE member_id = _id;

    UPDATE payments
    SET member_id = NULL
    WHERE member_id = _id;

    DELETE FROM members
    WHERE id = _id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_NewAdmin` (IN `_name` VARCHAR(255), IN `_username` VARCHAR(255), IN `_password` VARCHAR(255))   BEGIN
    INSERT INTO admins(name, username, password)
    VALUES (_name, _username, _password);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_NewCategory` (IN `_name` VARCHAR(255), IN `_description` VARCHAR(255), IN `_image_url` VARCHAR(255))   BEGIN
    INSERT INTO categories(name, description, image_url)
    VALUES (_name, _description, _image_url);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_NewMember` (IN `_name` VARCHAR(255), IN `_phone` VARCHAR(255))   BEGIN
    INSERT INTO members(name, phone)
    VALUES (_name, _phone);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_NewOrder` (IN `products` JSON, IN `_member_id` INT, IN `_admin_id` INT)   BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE len INT DEFAULT 0;
    DECLARE _order_number INT DEFAULT 0;
    DECLARE _product_id iNT;
    DECLARE _qty INT;
    
    INSERT INTO orders (member_id, status, admin_id) 
    VALUES (_member_id, 'pending', _admin_id);

    SET len = JSON_LENGTH(products);
    SET _order_number = LAST_INSERT_ID();

    WHILE i < len DO
        SET _product_id = JSON_EXTRACT(
            products,
            CONCAT('$[', i, '].id')
        );

        SET _qty = JSON_EXTRACT(
            products,
            CONCAT('$[', i, '].quantity')
        );

        INSERT INTO orders_products_links (order_number, product_id, quantity)
        VALUES ( 
            _order_number,
            _product_id,
            _qty
        );

        UPDATE products
        SET stock = stock - _qty,
            sold = sold + _qty
        WHERE id = _product_id;

        SET i = i + 1;
    END WHILE;

    UPDATE orders
    SET total = (
        SELECT fn_SumOrderTotal(_order_number)
    ) 
    WHERE order_number = _order_number;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_NewProduct` (IN `_name` VARCHAR(255), IN `_description` VARCHAR(255), IN `_price` DECIMAL(10,2), IN `_stock` INT, IN `_weight` INT, IN `_category_id` INT, IN `_sold` INT, IN `_image_url` VARCHAR(255))   BEGIN
    INSERT INTO products(
        name, description, price, stock, weight, 
        category_id, sold, image_url
    )
    VALUES (
        _name, _description, _price, _stock, _weight, 
        _category_id, _sold, _image_url
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_PayOrder` (IN `_order_number` INT, IN `_use_points` INT, IN `_paid_amount` DECIMAL(10,2), IN `_method` ENUM('cash','qris','credit_card','debit_card'), IN `_admin_id` INT)   BEGIN
    DECLARE _member_id INT DEFAULT null;

    IF NOT EXISTS (
        SELECT * FROM orders
        WHERE order_number = _order_number
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order number not found';
    ELSEIF (
        SELECT status FROM orders
        WHERE order_number = _order_number
    ) = 'paid' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order has been paid';
    ELSE
        SET _member_id = (
            SELECT member_id FROM orders
            WHERE order_number = _order_number
        );

        INSERT INTO payments(order_number, member_id, use_points, paid_amount, method, admin_id)
        VALUES (_order_number, _member_id, _use_points, _paid_amount, _method, _admin_id); 
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `usp_PrintReceipt` (IN `_order_number` INT)   BEGIN
    SELECT  orders.order_number, orders.member_id, members.name AS member_name, 
            orders.admin_id, admins.name AS admin_name,
            payments.amount, payments.discount, payments.total,
            payments.paid_amount, payments.change, payments.method,
            payments.created_at
    FROM orders
    LEFT JOIN payments
    ON orders.order_number = payments.order_number
    LEFT JOIN members
    ON orders.member_id = members.member_id
    LEFT JOIN admins
    ON orders.admin_id = admins.admin_id
    WHERE orders.order_number = _order_number;
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_CheckProductStock` (`stock` INT) RETURNS VARCHAR(16) CHARSET utf8mb4 DETERMINISTIC BEGIN 
    DECLARE _stock VARCHAR(16); 
    IF stock = 0 THEN 
        SET _stock = 'Out of stock'; 
    ELSEIF stock < 10 THEN
        SET _stock = 'Low stock';
    ELSE 
        SET _stock = 'In stock'; 
    END IF;
    RETURN (_stock); 
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_SumOrderTotal` (`order_number` INT) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
    DECLARE _total DECIMAL(10, 2);
    
    SET _total = (
        SELECT SUM(price * orders_products_links.quantity) FROM products
        JOIN orders_products_links ON products.id = orders_products_links.product_id
        WHERE orders_products_links.order_number = order_number
    );

    RETURN _total;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('active','deactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `username`, `password`, `status`, `created_at`, `updated_at`) VALUES
(1, 'root', 'admin', '$2b$10$dTqfg8..l1aMj3h/hJUneeIQw9QFgXZFJfKILtCe9qCgSDjS4dVOC', 'active', '2022-06-07 01:17:23', '2022-06-07 01:28:30');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `categories`
--
DELIMITER $$
CREATE TRIGGER `TR_Categories_BeforeDelete` BEFORE DELETE ON `categories` FOR EACH ROW BEGIN
    UPDATE products
    SET category_id = NULL
    WHERE category_id = OLD.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `member_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `members`
--
DELIMITER $$
CREATE TRIGGER `TR_Members_BeforeDelete` BEFORE DELETE ON `members` FOR EACH ROW BEGIN
    UPDATE orders
    SET member_id = NULL
    WHERE member_id = OLD.member_id;

    UPDATE payments
    SET member_id = NULL
    WHERE member_id = OLD.member_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_number` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','paid','canceled') NOT NULL DEFAULT 'pending',
  `description` varchar(255) DEFAULT NULL,
  `admin_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `TR_Orders_AfterUpdate` AFTER UPDATE ON `orders` FOR EACH ROW BEGIN
    IF NEW.status = 'canceled' THEN
        DELETE FROM orders_products_links WHERE order_number = OLD.order_number;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `orders_products_links`
--

CREATE TABLE `orders_products_links` (
  `order_number` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `orders_products_links`
--
DELIMITER $$
CREATE TRIGGER `TR_OrdersProductsLinks_BeforeDelete` BEFORE DELETE ON `orders_products_links` FOR EACH ROW BEGIN
    UPDATE products
    SET stock = stock + OLD.quantity,
        sold = sold - OLD.quantity
    WHERE id = OLD.product_id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_number` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `use_points` tinyint(1) NOT NULL DEFAULT 0,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `change` decimal(10,2) DEFAULT NULL,
  `method` enum('cash','qris','credit_card','debit_card') NOT NULL DEFAULT 'cash',
  `admin_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `payments`
--
DELIMITER $$
CREATE TRIGGER `TR_Payments_AfterInsert` AFTER INSERT ON `payments` FOR EACH ROW BEGIN
    IF NEW.member_id IS NOT NULL AND NEW.use_points = 0 THEN
        UPDATE members 
        SET points = points + 1000
        WHERE member_id = NEW.member_id;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_Payments_BeforeInsert` BEFORE INSERT ON `payments` FOR EACH ROW BEGIN
    DECLARE _total DECIMAL(10, 2);
    DECLARE errno SMALLINT UNSIGNED DEFAULT 31001;
    DECLARE _member_points INT DEFAULT 0;
    SET _total = (SELECT total FROM orders WHERE order_number = NEW.order_number);

    IF NEW.order_number IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Order ID is required';
    ELSEIF NEW.paid_amount IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Amount is required';
    ELSEIF NEW.paid_amount < _total THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Amount must be greater than or equal to total';
    ELSEIF NEW.member_id IS NULL AND NEW.use_points = 1 THEN
        SIGNAL SQLSTATE '45000' 
        SET MYSQL_ERRNO = errno,
        MESSAGE_TEXT = 'Member ID is required';
    END IF;

    IF NEW.member_id IS NOT NULL AND NEW.use_points = 1 THEN
        SET _member_points = (
            SELECT points FROM members
            WHERE member_id = NEW.member_id
        );

        UPDATE members
        SET points = 1000
        WHERE member_id = NEW.member_id;
    END IF;

    SET NEW.discount = _member_points;
    SET NEW.amount = _total;
    SET NEW.total = NEW.amount - NEW.discount;
    SET NEW.change = NEW.paid_amount - NEW.total;

    UPDATE orders 
    SET status = 'paid' 
    WHERE order_number = NEW.order_number;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `sold` int(11) NOT NULL DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Triggers `products`
--
DELIMITER $$
CREATE TRIGGER `TR_Products_AfterDelete` AFTER DELETE ON `products` FOR EACH ROW BEGIN
    UPDATE categories
    SET total = total - 1
    WHERE id = OLD.category_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_Products_AfterInsert` AFTER INSERT ON `products` FOR EACH ROW BEGIN
    UPDATE categories
    SET total = total + 1
    WHERE id = NEW.category_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_Products_AfterUpdate` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
    IF NEW.stock < OLD.stock THEN
        INSERT INTO products_log(product_id, description)
        VALUES(NEW.id, CONCAT('Stock has been reduced from ', OLD.stock, ' to ', NEW.stock));
    ELSEIF NEW.stock > OLD.stock THEN
        INSERT INTO products_log(product_id, description)
        VALUES(NEW.id, CONCAT('Stock has been increased from ', OLD.stock, ' to ', NEW.stock));
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `TR_Products_BeforeDelete` BEFORE DELETE ON `products` FOR EACH ROW BEGIN
    UPDATE categories
    SET total = total - 1
    WHERE id = OLD.category_id;

    DELETE FROM orders_products_links WHERE product_id = OLD.id;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `products_log`
--

CREATE TABLE `products_log` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_number`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `orders_products_links`
--
ALTER TABLE `orders_products_links`
  ADD PRIMARY KEY (`order_number`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_number` (`order_number`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `products_log`
--
ALTER TABLE `products_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_number` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_log`
--
ALTER TABLE `products_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`);

--
-- Constraints for table `orders_products_links`
--
ALTER TABLE `orders_products_links`
  ADD CONSTRAINT `orders_products_links_ibfk_1` FOREIGN KEY (`order_number`) REFERENCES `orders` (`order_number`),
  ADD CONSTRAINT `orders_products_links_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_number`) REFERENCES `orders` (`order_number`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `products_log`
--
ALTER TABLE `products_log`
  ADD CONSTRAINT `products_log_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
