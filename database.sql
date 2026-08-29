CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  dob DATE NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  dept VARCHAR(80) NOT NULL,
  title VARCHAR(80) NOT NULL,
  address VARCHAR(200) DEFAULT '',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
