<?php
require 'config.php';

function memrisePointsIntegration($integration) {
    $url =  "https://api.apify.com/v2/actor-tasks/skorytnicki~memrise-points/run-sync-get-dataset-items?token=".$_ENV['APIFY_TOKEN'];
    $body = [
        "startUrls" => [
            [
                "url" => "https://app.memrise.com/user/".$integration['integration_username'] 
            ]
        ], 
        "linkSelector" => "" 
    ];

    // fetch using curl
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    $result = curl_exec($ch);
    curl_close($ch);
    
    $result = json_decode($result, true);

    return $result[0]['points'];
}