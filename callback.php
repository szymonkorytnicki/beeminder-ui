<?php

setcookie(
    "bui_token",
    $_GET['access_token'].".".$_GET['username'],
    time()+60*60*24*30,
    "",
    "",
    false,
    true
);

header('Location: https://beeminder-ui.ngrok.io/');
exit;

// TODOs
// extract location to dotenv
?>