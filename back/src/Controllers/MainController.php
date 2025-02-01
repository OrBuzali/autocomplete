<?php

namespace App\Controllers;

use App\Database;
use App\Repositories\SearchRepository;
use PDO;

class MainController
{
    private Database $db;

    public function __construct()
    {
        $this->db = new Database();
    }
        // for route /search-autocomplete/
    public function searchAutoComplete($input): void
    {

        $inputDecoded = urldecode($input); // decode the url
        $connection = $this->db->getConnection(); // connect to db
        $searchRepository = new SearchRepository($connection);
        $result = $searchRepository->searchAutoComplete($inputDecoded);
        if ($result) {
            $this->jsonResponse($result);
        } else {
            $this->jsonResponse(["type" => 'server_error'], 404);
        }
    }
        // for route /get-employee-by-id/
    public function getEmployeeById($id): void
    {

        $inputDecoded = (int)$id; // ensure we search INT value
        $connection = $this->db->getConnection(); // connect to db
        $searchRepository = new SearchRepository($connection);
        $result = $searchRepository->getEmployeeById($id);
        if ($result) {
            $this->jsonResponse($result);
        } else {
            $this->jsonResponse(["type" => 'server_error'], 404);
        }
    }

    private function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data,JSON_UNESCAPED_UNICODE );
        exit();
    }
}