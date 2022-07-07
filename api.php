<?php
require("config.php");
require("token.php");

header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('X-Content-Type-Options: nosniff');

$routes = array(
    '/' => function () {
        return array('error' => 'No endpoint specified');
    },
    '/goals' => function($params, $user, $accessToken) {
        $goalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals.json?access_token=".$accessToken;
        $archivedGoalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals/archived.json?access_token=".$accessToken;

        if (isset($params['isArchived']) && $params['isArchived'] == 'true') {
            $url = $archivedGoalsUrl;
        } else {
            $url = $goalsUrl;
        }

        $goals = json_decode(file_get_contents($url)); // todo error handling?
        return $goals;
    },
    '/goal' => function($params, $user, $accessToken) {
        if (!isset($params['slug'])) {
            return array('error' => 'No goal slug specified');
        }
        $slug = urlencode($params['slug']);
        $goalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals/".$slug.".json?access_token=".$accessToken;

        $goal = json_decode(file_get_contents($goalsUrl), true);
        return $goal;
    },
    '/datapoints' => function($params, $user, $accessToken) {
        if (!isset($params['slug'])) {
            return array('error' => 'No goal slug specified');
        }
        $limitDatapoints = false;
        if (isset($params['limitDatapoints']) && $params['limitDatapoints'] == 'true') {
            $limitDatapoints = true;
        }
        $slug = urlencode($params['slug']);
        $url = "https://www.beeminder.com/api/v1/users/".$user."/goals/".$slug."/datapoints.json?access_token=".$accessToken.($limitDatapoints ? "&count=250" : "");
        $datapoints = json_decode(file_get_contents($url), true);
    
        return $datapoints;
    },
    '/me' => function($params, $user, $accessToken) {
        $url = "https://www.beeminder.com/api/v1/users/me.json?access_token=".$accessToken;
        $me = json_decode(file_get_contents($url), true);
        return $me;
    },
    '/loggedIn' => function($params, $user, $accessToken) {
        $url = "https://www.beeminder.com/api/v1/users/me.json?access_token=".$accessToken;
        $me = json_decode(@file_get_contents($url), true);

        return array('loggedIn' => isset($me['username']));
    }

);

function handleRequest($routes, $path, $params) {
    $userData = isset($_COOKIE['bui_token']) ? decryptToken($_COOKIE['bui_token']) : false;
    if (!$userData) {
        return array('error' => 'Invalid token', 'loggedIn' => false); // TODO ugly
    }
    foreach ($routes as $route => $callback) {
        if ($route == $path) {
            return $callback($params, $userData['username'], $userData['accessToken']);
        }
    }
    return array('error' => 'Not found');
}

$pathString = $_SERVER['PATH_INFO'] ?? "/";
$paramsString = $_SERVER['QUERY_STRING'] ?? "";

function prepareParams($paramsString) {
    $getParams = array();
    parse_str($paramsString, $getParams);
    return $getParams;
}

echo json_encode(handleRequest($routes, $pathString, prepareParams($paramsString)));
?>