<?php
require("config.php");
require("token.php");

// todo czech mistake rename auth_token with access_token
// todo encode decode miszmasz

$routes = array(
    '/' => function () {
        return array('error' => 'No endpoint specified');
    },
    '/goals' => function($params, $user, $authToken) {
        echo $user;
        echo $authToken;
        $goalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals.json?access_token=".$authToken;
        $archivedGoalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals/archived.json?access_token=".$authToken;

        if (isset($params['isArchived']) && $params['isArchived'] == 'true') {
            $url = $archivedGoalsUrl;
        } else {
            $url = $goalsUrl;
        }

        $goals = file_get_contents($url);
        return $goals;
    },
    '/goal' => function($params, $user, $authToken) {
        $slug = urlencode($params['slug']);
        $goalsUrl = "https://www.beeminder.com/api/v1/users/".$user."/goals/".$slug.".json?access_token=".$authToken;

        $goal = json_decode(file_get_contents($goalsUrl), true);
        return $goal;

    },
    '/datapoints' => function($params, $user, $authToken) {
        $slug = urlencode($params['slug']);
        $url = "https://www.beeminder.com/api/v1/users/".$user."/goals/".$slug."/datapoints.json?access_token=".$authToken."&count=250";
        $datapoints = json_decode(file_get_contents($url), true);
        return $datapoints;
    },
    '/me' => function($params, $user, $authToken) {
        $url = "https://www.beeminder.com/api/v1/users/me.json?access_token=".$authToken;
        $me = json_decode(file_get_contents($url), true);
        return $me;
    }

);

function handleRequest($routes, $path, $params) {
    $userData = decryptToken($_COOKIE['bui_token']);
    foreach ($routes as $route => $callback) {
        if ($route == $path) {
            return $callback($params, $userData['username'], $userData['apikey']);
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