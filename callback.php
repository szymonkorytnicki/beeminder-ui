<?php
require("token.php");

setcookie(
    "bui_token",
    encryptToken($_GET['username'], $_GET['access_token']),
    time()+60*60*24*30,
    "",
    "",
    false,
    true
);

header('Location: https://beeminder-ui.ngrok.io?authToken='.$_GET['access_token']);
exit;

// TODOs
// extract location to dotenv
?>