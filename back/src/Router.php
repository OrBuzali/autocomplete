<?php

namespace App;

class Router
{
    private array $routes = [];

    public function addRoute(string $method, string $path, callable $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function resolve(string $requestUri, string $requestMethod): void
    {
        foreach ($this->routes as $route) {
            if ($route['method'] === strtoupper($requestMethod) && preg_match("#^{$route['path']}$#", $requestUri, $matches)) {
                array_shift($matches); // Remove the full match
                call_user_func_array($route['handler'], $matches);
                return;
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
    }
}