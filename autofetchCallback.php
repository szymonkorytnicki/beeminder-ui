<?php
require("config.php");
require("integrations.php");

$username = $_POST['username'];
$slug = $_POST['slug'];

// 1. Get integration type and data from the db
$stmt = $db->prepare("SELECT * FROM integrations WHERE username = ? AND slug = ?"); // TODO select latest by date_added
$stmt->execute([$username, $slug]);
$integration = $stmt->fetch();

if (!$integration) {
    header('Content-Type: application/json');
    echo json_encode(array("status" => "ok"));
    exit;
}

// 2. Get the access token from the db
$stmt = $db->prepare("SELECT * FROM tokens WHERE username = ?");
$stmt->execute([$username]);
$token = $stmt->fetch();

if (!$token) {
    header('Content-Type: application/json');
    echo json_encode(array("status" => "ok"));
    exit;
}

// 3. Fetch data from apify
$integrationType = $integration['type'];
$integrationURL = $integrations[$integrationType]['url'];

// 4. Add datapoint to beeminder goal if necessary

// 5. Respond with 200 OK
header('Content-Type: application/json');
echo json_encode(array("status" => "ok"));
exit;
?>