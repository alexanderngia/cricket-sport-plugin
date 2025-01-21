<?php
/*
	Plugin Name: wp-critket template
	Plugin URI: http://google.com
	Description: Awesome plugin to manage your site 
	Author: Le Minh Quan
	Version: 1.0.1
	Author URI: http://google.com/
*/

if (!defined('critket_path')) {
	define('critket_path', plugin_dir_path(__FILE__));
}
if (!defined('critket_url')) {
	define('critket_url', plugin_dir_url(__FILE__));
}

include( critket_path . 'Views/shortcode.php');

// include( check4dpath . 'Controllers/ResultController.php');

// include( check4dpath . 'Routes/Admin.php');

// use Check4D\Routes\Admin;

// new Admin();