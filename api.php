<?php
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/config.php";

function read_json() {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function ok($extra = []) {
  echo json_encode(array_merge(["ok" => true], $extra));
  exit;
}

function fail($message, $code = 400) {
  http_response_code($code);
  echo json_encode(["ok" => false, "error" => $message]);
  exit;
}

function row_out($row) {
  $row["id"] = (string) $row["id"];
  return $row;
}

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
  $result = $mysqli->query("SELECT * FROM employees ORDER BY id DESC");
  if (!$result) fail($mysqli->error, 500);
  $list = [];
  while ($row = $result->fetch_assoc()) $list[] = row_out($row);
  ok(["data" => $list]);
}

if ($method === "POST" || $method === "PUT") {
  $b = read_json();
  $number  = trim($b["number"]  ?? "");
  $name    = trim($b["name"]    ?? "");
  $email   = trim($b["email"]   ?? "");
  $phone   = trim($b["phone"]   ?? "");
  $dob     = trim($b["dob"]     ?? "");
  $gender  = trim($b["gender"]  ?? "");
  $dept    = trim($b["dept"]    ?? "");
  $title   = trim($b["title"]   ?? "");
  $address = trim($b["address"] ?? "");
  $note    = trim($b["note"]    ?? "");
  $id      = trim((string) ($b["id"] ?? ""));

  if ($number === "" || $name === "" || $email === "" || $dob === "" || $gender === "" || $dept === "" || $title === "") {
    fail("Please fill in all required fields.");
  }

  if ($method === "PUT" || $id !== "") {
    $sql = "UPDATE employees SET number=?, name=?, email=?, phone=?, dob=?, gender=?, dept=?, title=?, address=?, note=? WHERE id=?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ssssssssssi", $number, $name, $email, $phone, $dob, $gender, $dept, $title, $address, $note, $id);
    if (!$stmt->execute()) {
      if ($mysqli->errno === 1062) fail("That staff ID already exists.");
      fail($stmt->error, 500);
    }
    ok(["id" => $id]);
  }

  $sql = "INSERT INTO employees (number, name, email, phone, dob, gender, dept, title, address, note) VALUES (?,?,?,?,?,?,?,?,?,?)";
  $stmt = $mysqli->prepare($sql);
  $stmt->bind_param("ssssssssss", $number, $name, $email, $phone, $dob, $gender, $dept, $title, $address, $note);
  if (!$stmt->execute()) {
    if ($mysqli->errno === 1062) fail("That staff ID already exists.");
    fail($stmt->error, 500);
  }
  ok(["id" => (string) $mysqli->insert_id]);
}

if ($method === "DELETE") {
  $id = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
  if ($id <= 0) fail("Missing id.");
  $stmt = $mysqli->prepare("DELETE FROM employees WHERE id=?");
  $stmt->bind_param("i", $id);
  if (!$stmt->execute()) fail($stmt->error, 500);
  ok();
}

fail("Unsupported method.", 405);
