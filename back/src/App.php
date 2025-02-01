<?php

namespace App;

class App
{
    private Router $router;

    public function __construct()
    {
        $this->router = new Router();
    }

    public function get(string $path, callable $handler): void
    {
        $this->router->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->router->addRoute('POST', $path, $handler);
    }

    public function run(): void
    {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $requestMethod = $_SERVER['REQUEST_METHOD'];

        $this->router->resolve($requestUri, $requestMethod);
    }
}