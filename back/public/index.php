<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
require __DIR__ . '/../vendor/autoload.php';

use App\App;
use App\Controllers\MainController;

header('Content-Type: application/json');

$app = new App();
$app->get('/search-autocomplete/([^/]+)', function ($input) {
    $controller = new MainController();
    $controller->searchAutoComplete($input);
});

$app->get('/get-employee-by-id/([^/]+)', function ($id) {
    $controller = new MainController();
    $controller->getEmployeeById($id);
});

$app->run();