<?php
require("config.php");
require("token.php");
require("connection.php");

header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('X-Content-Type-Options: nosniff');

$encryptedToken = encryptToken($_GET['username'], $_GET['access_token']);

setcookie(
    "bui_token",
    $encryptedToken,
    time()+60*60*24*30,
    "",
    "",
    false,
    true
);

// insert token into db
$stmt = $db->prepare("INSERT INTO tokens (username, token) VALUES (?, ?)");
$stmt->execute([$_GET['username'], $encryptedToken]);

header('Location: '.$_ENV['REDIRECT_URL']);
exit;
?>