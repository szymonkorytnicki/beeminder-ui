<?php
require 'integrations/memrisePointsIntegration.php';
require 'integrations/ankiClearIntegration.php';

$integrations = array(
    'memrise_points' => function($integration, $token) {
        return memrisePointsIntegration($integration);
    },

    'anki_clear' => function($integration, $token) {
        return ankiClearIntegration($integration);
    }
);

?>