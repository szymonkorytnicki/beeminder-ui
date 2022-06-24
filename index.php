<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

?>

<a href="https://www.beeminder.com/apps/authorize?client_id=<?php echo $_ENV['CLIENT_ID']?>&redirect_uri=<?php echo $_ENV['CALLBACK_URL']?>&response_type=token">Authorise</a>
<?php
echo "hello php my old friend I have server for you again";
?>