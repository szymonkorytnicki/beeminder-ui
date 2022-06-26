<?php

$routes = array(
    '/' => 'test',
    '/goals' => 'test',
);

// echo $_SERVER['PATH_INFO'];
// echo var_dump($_SERVER);


function handleRequest($path, $params) {
    // SAVEPOINT execute proper route with proper params
    echo var_dump($params);
}


$pathString = $_SERVER['PATH_INFO'] ?? "/";
$paramsString = $_SERVER['QUERY_STRING'] ?? "";

function prepareParams($paramsString) {
    $getParams = array();
    parse_str($paramsString, $getParams);
    return $getParams;
}

handleRequest($pathString, prepareParams($paramsString));
?>