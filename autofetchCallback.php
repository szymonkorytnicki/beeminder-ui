<?php
require("config.php");
require("connection.php");
require("token.php");
require("integrations/integrations.php");

$username = $_POST['username'];
$slug = $_POST['slug'];

// 1. Get integration type and data from the db
$stmt = $db->prepare("SELECT * FROM integrations WHERE username = ? AND goal = ?");
$stmt->execute([$username, $slug]);
$integration = $stmt->fetch();

if (!$integration) {
    header('Content-Type: application/json');
    echo json_encode(array("error" => "No integration found"));
    exit;
}

// 2. Get the access token from the db
$stmt = $db->prepare("SELECT * FROM tokens WHERE username = ?");
$stmt->execute([$username]);
$token = $stmt->fetch();

if (!$token) {
    header('Content-Type: application/json');
    echo json_encode(array("error" => "No token found"));
    exit;
}

// 3. Fetch data from apify - execute function by goal type
$integrationType = $integration['integration'];
$data = $integrations[$integrationType]($integration, $token);

// 4. Add datapoint to beeminder API if necessary
$accessToken = decryptToken($token['token'])['accessToken'];
$url = "https://www.beeminder.com/api/v1/users/".$username."/goals/".$slug."/datapoints.json?access_token=".$accessToken."&value=".$data."&comment=Synced with BUI";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);

// 5. Respond with 200 OK
header('Content-Type: application/json');
echo json_encode(array("status" => "ok", "url" => $url));
exit;
?>