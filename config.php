<?php
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "employee_management";

$mysqli = @new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($mysqli->connect_errno) {
  http_response_code(500);
  header("Content-Type: application/json; charset=utf-8");
  echo json_encode([
    "ok" => false,
    "error" => "Cannot connect to MySQL. Create database employee_management and import schema.sql. " . $mysqli->connect_error
  ]);
  exit;
}
$mysqli->set_charset("utf8mb4");
