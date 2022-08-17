<?php
$APIFY_TOKEN = "";

function callApify() {
    
}

function runMemrise($params) { 
    // $params['username'] and password
}

$integrations = array( // TODO key - ID, value - function reference, call it with variables like router; avoid one file split into pieces
    'memrise' => array(
        'type' => 'memrise',
        'url' => 'https://api.apify.com/v2/actor-tasks/skorytnicki~memrise-points/run-sync-get-dataset-items?token={apifyToken}',
        'body' => [
            "startUrls" => [
                [
                    "url" => "https://app.memrise.com/user/{username}" 
                ]
            ], 
            "linkSelector" => "" 
        ]
    )
);

?>