<?php
    

    class TemplateController {
        /* Vista principal */
        public function index() {
            include "views/template.php";
        }

        /* Ruta principal */
        static public function path() {
            return "http://efferyn-service.com/";
        }

    }

