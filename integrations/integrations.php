<?php
require 'integrations/memrisePointsIntegration.php';

$integrations = array(
    'memrise_points' => function($integration, $token) {
        return memrisePointsIntegration($integration);
    }
);

?>