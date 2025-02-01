<?php

namespace App\Repositories;

use App\Database;
use PDO;

class SearchRepository
{
    private PDO $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }
        // method to search in db by chars
    public function searchAutoComplete($input) {
        
        try {
            $sql = "SELECT id as employeeId, CONCAT(fname,' ',lname) AS fullname,work_title,image_url
            FROM deloitte.employees
            WHERE fname LIKE :search
            OR lname LIKE :search
            OR work_title LIKE :search
            OR CONCAT(fname,' ',lname) LIKE :search ";
            $stmt = $this->connection->prepare($sql);
            $stmt->bindValue(':search', "%$input%", PDO::PARAM_STR);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (empty($rows)) {
                return ["type" => 'empty_results'];
            }
            return ["type" => 'results_found', "results" => $rows, "keyword" => $input ];
        }
        catch(Exception $e) {
            return ["type" => 'server_error'];
            // Send email / enter log here..
        }

    }

    public function getEmployeeById($id) {
        
        try {
            $sql = "SELECT id,fname,lname,work_title,image_url,DATE_FORMAT(create_time, '%d/%m/%Y %H:%i:%s') AS create_time
            FROM deloitte.employees
            WHERE id = :id ";
            $stmt = $this->connection->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if (empty($rows)) {
                return ["type" => 'empty_results'];
            }
            return ["type" => 'results_found', "results" => $rows ];
        }
        catch(Exception $e) {
            return ["type" => 'server_error'];
            // Send email / enter log here..
        }

    }


}