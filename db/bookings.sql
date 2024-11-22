-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 19, 2024 at 10:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taxi_bookings`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `pickup_date` date NOT NULL,
  `pickup_time` time NOT NULL,
  `pickup_city` varchar(100) NOT NULL,
  `street` varchar(255) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `number_of_passengers` int(11) DEFAULT NULL,
  `number_of_suitcases` int(11) DEFAULT NULL,
  `children_seat` enum('Yes','No') DEFAULT 'No',
  `vehicle_type` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `return_journey` enum('Yes','No') DEFAULT 'No',
  `comment` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending',
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `pickup_date`, `pickup_time`, `pickup_city`, `street`, `house_no`, `name`, `phone_number`, `email`, `number_of_passengers`, `number_of_suitcases`, `children_seat`, `vehicle_type`, `payment_method`, `return_journey`, `comment`, `status`, `total_price`, `created_at`, `updated_at`) VALUES
(1, '0000-00-00', '11:45:00', 'Vienna City Center', 'vienna', NULL, '', '09800589324', 'husneymobarok827@gmail.com', 2, 1, 'No', 'Luxury', NULL, 'No', 'the payment will be on cash!', 'Completed', 52.50, '2024-11-19 20:01:52', '2024-11-19 21:27:31'),
(2, '2024-11-22', '04:18:00', 'Vienna City Center', 'vienna', 'n0015', 'Hosne Mobarak Faraji', '09800589324', 'husneymobarok827@gmail.com', 1, 1, 'Yes', 'Standard', 'Cash', 'Yes', 'uitrer', 'Confirmed', 63.00, '2024-11-19 20:49:03', '2024-11-19 21:37:23'),
(3, '2024-11-16', '05:50:00', 'Vienna City Center', 'vienna', 'n0015', 'Mubarak', '09800589324', 'husneymobarok827@gmail.com', 1, 2, 'Yes', 'Standard', 'Online Payment', 'Yes', 'haha', 'Confirmed', 63.00, '2024-11-19 21:20:43', '2024-11-19 21:44:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
