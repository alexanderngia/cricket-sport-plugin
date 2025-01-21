<?php

namespace Check4D\Routes;

use Check4D\Controllers\ResultController;

class Admin
{
    protected $resultController;

    public function __construct()
    {   
        /**
         * 
         * http://localhost/wp-admin/admin-ajax.php?action=latest
         * **/
        $this->resultController = new ResultController();
        add_action('wp_ajax_latest', [$this->resultController, 'index']);
        add_action('wp_ajax_nopriv_latest', [$this->resultController, 'index']);
        add_action('wp_ajax_get_latest_result', [$this->resultController, 'get']);
        add_action('wp_ajax_nopriv_get_latest_result', [$this->resultController, 'get']);
    }
}
