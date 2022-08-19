<?php
require 'memrisePointsIntegration.php';

$integrations = array( // TODO key - ID, value - function reference, call it with variables like router; avoid one file split into pieces
    'memrise_points' => $memrisePointsIntegration
);

?>