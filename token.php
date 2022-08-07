<?php
// token utils
require("config.php");

function encryptToken($username, $accessToken) {
    return openssl_encrypt(
        json_encode(array("username" => $username, "accessToken" => $accessToken)),
        "AES-256-CBC",
        $_ENV['ENC_KEY'],
        0,
        $_ENV['ENC_IV']
    );
}

function decryptToken($token) {
    return json_decode(openssl_decrypt(
            $token,
            "AES-256-CBC",
            $_ENV['ENC_KEY'],
            0,
            $_ENV['ENC_IV']
    ), true);
}

?>