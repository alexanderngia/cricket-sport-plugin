<?php
namespace Check4D\Controllers;

class ResultController
{
    
    private $correct_password = "bai_khong_ten_so_8";

    public function index(){

        $input = json_decode(file_get_contents('php://input'), true);

        if (isset($input['password']) && $input['password'] === $this->correct_password) {
            update_option('check4d_latest', $input['data']);
            $response = [
                'status' => true,
                'message' => 'Password is correct',
                'data' => $input['data']
            ];
        } else {
            $response = [
                'status' => false,
                'message' => 'Invalid password'
            ];
        }

        wp_send_json($response);
        die();
    }

    public function get(){

        $response = get_option('check4d_latest');

        wp_send_json($response);
        
        die();
    }

}
