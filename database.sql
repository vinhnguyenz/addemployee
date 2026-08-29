CREATE DATABASE IF NOT EXISTS employee_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE employee_management;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(40) DEFAULT '',
  dob DATE NOT NULL,
  gender VARCHAR(16) NOT NULL,
  dept VARCHAR(80) NOT NULL,
  title VARCHAR(80) NOT NULL,
  address VARCHAR(200) DEFAULT '',
  note TEXT
);

INSERT INTO employees (id, number, name, email, phone, dob, gender, dept, title, address, note) VALUES
(1, '2401240109', 'Nguyen Van Vinh', '2401240109@ms.hanu.edu.vn', '0849009629', '2006-01-14', 'Male', 'Software Engineering', 'HR Admin', 'Nam Dinh', 'Account owner'),
(2, '2401240100', 'Do Quang Duy', '2401240100@ms.hanu.edu.vn', '0912345678', '2006-09-19', 'Male', 'Data & AI', 'Data Engineer', 'Quang Ninh', ''),
(3, '2401240101', 'Nguyen Phi Huan', '2401240101@ms.hanu.edu.vn', '0923456789', '2006-03-12', 'Male', 'Cybersecurity', 'Security Analyst', 'Ha Noi', ''),
(4, '2301230100', 'Tran Minh Chien', '2301230100@ms.hanu.edu.vn', '08123456789', '2005-11-02', 'Male', 'Software Engineering', 'Frontend Dev', 'Ca Mau', ''),
(5, '2301230101', 'Pham Thi Dung', '2301230101@ms.hanu.edu.vn', '0934567890', '2005-07-21', 'Female', 'Human Resources', 'People Partner', 'Thanh Hoa', ''),
(6, '2201220100', 'Hoang Van Em', '2201220100@ms.hanu.edu.vn', '0945678901', '2004-01-30', 'Female', 'Academic Affairs', 'Coordinator', 'Ha Tinh', ''),
(8, '2101210100', 'Vo Van Van', '2101210100@ms.hanu.edu.vn', '0756789012', '2003-12-15', 'Female', 'Cybersecurity', 'SOC Analyst', 'TP HCM', '');
