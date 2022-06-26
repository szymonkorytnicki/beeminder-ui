<?php
require("config.php");
require("token.php");

header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('X-Content-Type-Options: nosniff');

setcookie(
    "bui_token",
    encryptToken($_GET['username'], $_GET['access_token']),
    time()+60*60*24*30,
    "",
    "",
    false,
    true
);

header('Location: '.$_ENV['REDIRECT_URL']);
exit;
?>