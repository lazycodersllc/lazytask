<?php

namespace Lazytask\Controller;

use Lazytask\Helper\Lazytask_DatabaseTableSchema;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

final class Lazytask_UserController {


	public function getAllMembers(WP_REST_Request $request){
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$requestData = $request->get_params();
		$results = $db->get_results("SELECT * FROM `{$wpdb->prefix}users` as users", ARRAY_A);
		$returnArray = [];
		if($results){
			foreach ($results as $key => $value) {
				$roles = $this->getRolesByUser($value['ID']);
				$llc_roles = [];
				if(isset($roles['roles']) && sizeof($roles['roles'])>0){
					$llc_roles = isset($roles['roles']) && sizeof($roles['roles'])>0 ? $roles['roles'] : [];

				}

				$user = get_userdata( $value['ID'] );

// Get all the user roles as an array.
				$user_roles = $user->roles;

				$returnArray[] = [
					'id' => $value['ID'],
					'name' => $value['display_name'],
					'email' => $value['user_email'],
					'username' => $value['user_login'],
					'phoneNumber' => get_user_meta($value['ID'], 'phone_number', true),
					'firstName' => get_user_meta($user->ID, 'first_name', true),
					'lastName' => get_user_meta($user->ID, 'last_name', true),
					'created_at' => $value['user_registered'],
					'avatar' => self::getUserAvatar($value['ID']),
					'roles' => $user_roles,
					'llc_roles' => $llc_roles,
					'llc_permissions' => isset($roles['permissions']) && sizeof($roles['permissions'])>0 ? array_unique($this->array_flatten( $roles['permissions'])) : [],
				];

			}

			if(isset($requestData['company_id']) && $requestData['company_id'] != ''){
				$companyController = new Lazytask_CompanyController();
				$companyMembers = $companyController->getCompanyMembers($requestData['company_id']);
				$companyMembersId = isset($companyMembers[$requestData['company_id']]) && sizeof($companyMembers[$requestData['company_id']]) > 0 ?  array_column($companyMembers[$requestData['company_id']], 'id') : [];
				//  array filter to get only company members an array
				if (sizeof($companyMembersId) > 0) {
					$returnArrayFilter = array_filter($returnArray, function($item) use ($companyMembersId) {
						return in_array($item['id'], $companyMembersId);
					});

					$returnArray = array_values($returnArrayFilter);
				}else{
					$returnArray = [];
				}
			}

			if(isset($requestData['project_id']) && $requestData['project_id'] != ''){
				$projectController = new Lazytask_ProjectController();
				$projectMembers = $projectController->getProjectMembers($requestData['project_id']);
				$projectMembersId = isset($projectMembers[$requestData['project_id']]) && sizeof($projectMembers[$requestData['project_id']]) > 0 ?  array_column($projectMembers[$requestData['project_id']], 'id') : [];
				//  array filter to get only company members an array
				if (sizeof($projectMembersId) > 0) {
					$returnArrayFilter = array_filter($returnArray, function($item) use ($projectMembersId) {
						return in_array($item['id'], $projectMembersId);
					});

					$returnArray = array_values($returnArrayFilter);
				}else{
					$returnArray = [];
				}
			}

			return ['status'=>200, 'data'=>$returnArray, 'requestData'=>$requestData];
		}
		return ['status'=>404, 'data'=>$returnArray];
	}

	public function show(WP_REST_Request $request){
		$id = $request->get_param('id');

		if(!$id){
			return array('status'=> 500, 'message' => 'Company ID is required', 'data'=>[]);
		}
		$user = $this->getUserById($id);

		if($user && sizeof($user)>0){
			return new WP_REST_Response(['status'=>200, 'data'=>$user]);
		}

		return new WP_REST_Response(['status'=>404, 'data'=>[]]);

	}
	private function getUserById($id){
		if(!$id){
			return [];
		}
		$user = get_userdata( $id );
		if($user == false){
			return [];
		}

		$roles = $this->getRolesByUser($id);
		$user_roles = $user->roles;
	$returnArray = [
		'id' => $user->ID,
		'user_id' => $user->ID, //for apps development
		'name' => $user->display_name,
		'email' => $user->user_email,
		'username' => $user->user_login,
		'phoneNumber' => get_user_meta($user->ID, 'phone_number', true),
		'firstName' => get_user_meta($user->ID, 'first_name', true),
		'lastName' => get_user_meta($user->ID, 'last_name', true),
		'created_at' => $user->user_registered,
		'avatar' => self::getUserAvatar($user->ID),
		'roles' => $user_roles,
		'llc_roles' => isset($roles['roles']) && sizeof($roles['roles'])>0 ? $roles['roles'] : [],
		'llc_permissions' => isset($roles['permissions']) && sizeof($roles['permissions'])>0 ? array_unique($this->array_flatten( $roles['permissions'])) : [],
	];
		return $returnArray;
	}

	public function getRolesByUser($userId) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$userHasRolesTable = LAZYTASK_TABLE_PREFIX . 'user_has_roles';
		$rolesTable = LAZYTASK_TABLE_PREFIX . 'roles';

		$results = $db->get_results(
			$db->prepare(
				"SELECT roles.id, roles.name , roles.slug 
						FROM `{$userHasRolesTable}` as user_has_roles 
						JOIN `{$rolesTable}` as roles ON user_has_roles.role_id = roles.id 
						WHERE user_has_roles.user_id = %d", (int)$userId), ARRAY_A);
		$returnArray = [];

		if($results){
			foreach ($results as $key => $value) {
				$value['permissions'] = $this->getPermissionByRole($value['id']);
				$returnArray['roles'][] = [
					'id' => $value['id'],
					'name' => $value['name'],
					'slug' => $value['slug'],
				];
				$returnArray['permissions'][] = $value['permissions'];
			}
		}
		return $returnArray;
	}

  private function array_flatten($array) {
		if (!is_array($array)) {
			return FALSE;
		}
		$result = array();
		foreach ($array as $key => $value) {
			if (is_array($value)) {
				$result = array_merge($result, $this->array_flatten($value));
			}
			else {
				$result[$key] = $value;
			}
		}
		return $result;
	}

	private function getPermissionByRole($roleId) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$roleHasPermissionTable = LAZYTASK_TABLE_PREFIX . 'role_has_permissions';
		$permissionTable = LAZYTASK_TABLE_PREFIX . 'permissions';
		$results = $db->get_results($db->prepare("SELECT permissions.name FROM `{$roleHasPermissionTable}` as role_has_permissions JOIN `{$permissionTable}` as permissions ON role_has_permissions.permission_id = permissions.id WHERE role_has_permissions.role_id =%d", (int)$roleId), ARRAY_A);
		$returnArray = [];
		if($results){
			foreach ($results as $key => $value) {
				$returnArray[] = $value['name'];
			}
		}
		return $returnArray;

	}
	public function login( WP_REST_Request $request ){
		$requestData = $request->get_body_params();

		$username = isset($requestData['email']) && $requestData['email'] != "" ? $requestData['email'] : '';
		$password = isset($requestData['password']) && $requestData['password'] != "" ? $requestData['password'] : '';

		// Check if we have a username and password
		if ($username == '' || $password == '') {
			// If not, throw an error
			return [ "status" => 401, "message" => "Username and password required" ];
		}
		// Prepare the credentials for wp_signon()
		$credentials = array(
			'user_login'    => $username,
			'user_password' => $password,
			'remember'      => true
		);

		// Attempt to sign on the user
		$user = wp_signon($credentials, false);

		// Check if there was an error
		if (is_wp_error($user)) {
			// Return the error message
			return $user->get_error_message();
		}

		wp_set_current_user($user->ID, $user->display_name);
		wp_set_auth_cookie($user->ID, true, false);

		$authToken = wp_generate_auth_cookie($user->ID, 86400, 'logged_in', null);
		$user->authToken = $authToken;

		$parseToken = wp_parse_auth_cookie($authToken, 'logged_in');
		$user->parseToken = $parseToken;

		// If successful, return a success message
		return [ "status" => 200, "message" => "User logged in successfully", "data" => $user ];

	}

	// Callback function to generate JWT token
	public function jwt_auth_generate_token(WP_REST_Request $request) {

		$secret_key = defined( 'LAZYTASK_JWT_SECRET_KEY' ) ? LAZYTASK_JWT_SECRET_KEY : false;

		if ( ! $secret_key ) {
			return new WP_Error(
				'jwt_auth_bad_config',
				__( 'JWT is not configured properly, please contact the administration', 'lazytasks-project-task-management' ),
				[
					'status' => 403,
				]
			);
		}
		$username = $request->get_param('email');
		$password = $request->get_param('password');

		$user = wp_authenticate($username, $password);

		if (is_wp_error($user)) {
			return new WP_Error('invalid_credentials', __('Invalid credentials', 'lazytasks-project-task-management'), array('status' => 401));
		}

		$issued_at = time();
		$expiration_time = $issued_at + 7 * 24 * 60 * 60; // Token valid for 7 days
		$roles = $this->getRolesByUser($user->ID);

		$token = array(
			'iss'  => get_bloginfo( 'url' ),
			'iat' => $issued_at,
			'exp' => $expiration_time,
			'data' => array(
				'user_id' => $user->ID,
				'name' => $user->display_name,
				'email' => $user->user_email,
				'roles' => $user->roles,
				'avatar' => self::getUserAvatar($user->ID),
				'llc_roles' => isset($roles['roles']) && sizeof($roles['roles'])>0 ? array_unique($roles['roles']) : [],
				'llc_permissions' => isset($roles['permissions']) && sizeof($roles['permissions'])>0 ? array_unique($this->array_flatten( $roles['permissions'])) : [],
			),
		);

		$token =  JWT::encode($token, $secret_key, 'HS256');

		return new WP_REST_Response(array('code'=>'is_valid', 'message'=> 'Success', 'token' => $token));
	}

// Function to generate JWT token
	public function validate_token( WP_REST_Request $request, $permissions=[] ) {

		$auth_header = $request->get_header( 'Authorization' );

		if ( ! $auth_header ) {
			return new WP_Error(
				'jwt_auth_no_auth_header',
				'Authorization header not found.',
				[
					'status' => 403,
				]
			);
		}

		/*
		 * Extract the authorization header
		 */
		[ $token ] = sscanf( $auth_header, 'Bearer %s' );

		/**
		 * if the format is not valid return an error.
		 */
		if ( ! $token ) {
			return new WP_Error(
				'jwt_auth_bad_auth_header',
				'Authorization header is required.',
				[
					'status' => 403,
				]
			);
		}

		/** Get the Secret Key */
		$secret_key = defined( 'LAZYTASK_JWT_SECRET_KEY' ) ? LAZYTASK_JWT_SECRET_KEY : false;
		if ( ! $secret_key ) {
			return new WP_Error(
				'jwt_auth_bad_config',
				'JWT is not configured properly, please contact the administration',
				[
					'status' => 403,
				]
			);
		}

		/** Try to decode the token */
		try {

			$token = JWT::decode( $token, new Key( LAZYTASK_JWT_SECRET_KEY, 'HS256' ) );

			/** The Token is decoded now validate the iss */
			if ( $token->iss !== get_bloginfo( 'url' ) ) {
				/** The iss do not match, return error */
				return new WP_Error(
					'jwt_auth_bad_iss',
					'The iss do not match with this server',
					[
						'status' => 403,
					]
				);
			}

			/** So far so good, validate the user id in the token */
			if ( ! isset( $token->data->user_id ) ) {
				/** No user id in the token, abort!! */
				return new WP_Error(
					'jwt_auth_bad_request',
					'User ID not found in the token',
					[
						'status' => 403,
					]
				);
			}

			if(sizeof($permissions)>0){
				$llc_permissions = $token->data->llc_permissions;
				$intersect = array_intersect($llc_permissions, $permissions);
				if(sizeof($intersect)==0){
					return new WP_Error(
						'jwt_auth_bad_request',
						'You do not have permission to access this resource',
						[
							'status' => 403,
						]
					);
				}
			}

			// check token expiration
			if (time() > $token->exp) {
				return new WP_Error(
					'jwt_auth_bad_request',
					'Token has expired',
					[
						'status' => 408,
					]
				);
			}


			/** This is for the /toke/validate endpoint*/
			return [
				'code' => 'jwt_auth_valid_token',
				'status' => 200,
				'data' => [
					'token' => $token,
					'status' => 200,
				],
			];
		} catch ( Exception $e ) {
			/** Something were wrong trying to decode the token, send back the error */
			return new WP_Error(
				'jwt_auth_invalid_token',
				$e->getMessage(),
				[
					'status' => 403,
				]
			);
		}
	}

	public function decode($token)
	{
		try {
			$token = JWT::decode( $token, new Key( LAZYTASK_JWT_SECRET_KEY, 'HS256' ) );

			/** The Token is decoded now validate the iss */
			if ( $token->iss !== get_bloginfo( 'url' ) ) {
				/** The iss do not match, return error */
				return new WP_Error(
					'jwt_auth_bad_iss',
					'The iss do not match with this server',
					[
						'status' => 403,
					]
				);
			}

			/** So far so good, validate the user id in the token */
			if ( ! isset( $token->data->user_id ) ) {
				/** No user id in the token, abort!! */
				return new WP_Error(
					'jwt_auth_bad_request',
					'User ID not found in the token',
					[
						'status' => 403,
					]
				);
			}
			return [
				'code' => 'jwt_auth_valid_token',
				'status' => 200,
				'data' => [
					'user_id' => $token->data->user_id,
					'name' => $token->data->name,
					'email' => $token->data->email,
					'avatar' => $token->data->avatar,
					'roles' => $token->data->roles,
					'llc_roles' => $token->data->llc_roles,
					'llc_permissions' => $token->data->llc_permissions,
				],
			];
		} catch (Exception $e) {
			return [
				'code' => 'jwt_auth_invalid_token',
				'status' => 403,
				'message' => $e->getMessage(),
			];
		}
	}

	function logout_user() {
		header("Access-Control-Allow-Origin: *");
		session_destroy();
		wp_logout();
		wp_clear_auth_cookie();
		return [ "status" => 200, "message" => "User logged out successfully", "user_id"=>null ];
	}

	public function lazytask_forget_password_request(WP_REST_Request $request) {
		$email = sanitize_email($request->get_param('email'));
		if (!email_exists($email)) {
			return new WP_REST_Response([
				'status'=>404,
				'message'=>'No user found with this email address.'
			], 200);
		}

		// Generate password reset key and send email
		$user = get_user_by('email', $email);
		$key = get_password_reset_key($user);

		$reset_url = site_url('/lazy-task')."/#/change-password/?key=".$key."&login=".rawurlencode($user->user_login);

		// Send email to user with the reset link
		wp_mail($user->user_email, 'Password Reset Request', 'Click the following link to reset your password: ' . $reset_url);

		return new WP_REST_Response(['status'=>200, 'message'=>'Password reset email sent. Please check'], 200);
	}

	public function lazytask_forget_password_store(WP_REST_Request $request) {
		$key = sanitize_text_field($request->get_param('key'));
		$login = sanitize_text_field($request->get_param('login'));
		$new_password = $request->get_param('password');

		$user = check_password_reset_key($key, $login);
		if (is_wp_error($user)) {
			return new WP_REST_Response(['status'=>404, 'message'=>'Invalid key.'], 404);
		}

		reset_password($user, $new_password);

		return new WP_REST_Response(['status'=>200, 'message'=>'Password has been reset.'], 200);
	}

	public function permission_check(WP_REST_Request $request, $permissions=[])
	{

		$response = $this->validate_token($request, $permissions);
//		var_dump($response);die;
		if (is_wp_error($response)) {
			return $response;
		}
		return true;
	}

  public function admin_after_auth_login () {

	  $secret_key = defined( 'LAZYTASK_JWT_SECRET_KEY' ) ? LAZYTASK_JWT_SECRET_KEY : false;

      $userId = is_user_logged_in() && is_admin() ? get_current_user_id() : '';

		if(!$userId){
			return new WP_Error('invalid_credentials', __('Invalid credentials', 'lazytasks-project-task-management'), array('status' => 401));
		}
		$user = get_user_by('ID', $userId );

	  if (is_wp_error($user)) {
		  return new WP_Error('invalid_credentials', __('Invalid credentials', 'lazytasks-project-task-management'), array('status' => 401));
	  }

	  $issued_at = time();
	  $expiration_time = $issued_at + 7 * 24 * 60 * 60; // Token valid for 7 days
	  $roles = $this->getRolesByUser($user->ID);

	  $token = array(
		  'iss'  => get_bloginfo( 'url' ),
		  'iat' => $issued_at,
		  'exp' => $expiration_time,
		  'data' => array(
			  'user_id' => $user->ID,
			  'name' => $user->display_name,
			  'email' => $user->user_email,
			  'avatar' => self::getUserAvatar($user->ID),
			  'roles' => $user->roles,
			  'llc_roles' => isset($roles['roles']) && sizeof($roles['roles'])>0 ? array_unique($roles['roles']) : [],
			  'llc_permissions' => isset($roles['permissions']) && sizeof($roles['permissions'])>0 ? array_unique($this->array_flatten( $roles['permissions'])) : [],
		  ),
	  );

	  $token =  JWT::encode($token, $secret_key, 'HS256');

	  return new WP_REST_Response(array('token' => $token, 'user'=>$user));
	}

	public function lazyLinkRoles() {

		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);

		$rolesTable = LAZYTASK_TABLE_PREFIX . 'roles';

		$results = $db->get_results("SELECT * FROM {$rolesTable}", ARRAY_A);
		$returnArray = [];
		if($results){
			foreach ($results as $key => $value) {
				$returnArray[] = [
					'id' => $value['id'],
					'name' => $value['name'],
					'slug' => $value['slug'],
				];
			}
			return new WP_REST_Response(array('status' => 200, 'data'=>$returnArray));
		}
		return new WP_REST_Response(array('status' => 404, 'data'=>$returnArray));
	}

	public function signUp(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$response = array();
		$parameters = $request->get_json_params();
		$username = sanitize_text_field($parameters['email']);
		$firstName = sanitize_text_field($parameters['firstName']);
		$lastName = sanitize_text_field($parameters['lastName']);
		$phoneNumber = sanitize_text_field($parameters['phoneNumber']);
		$loggedInUserId = $parameters['loggedInUserId'] ? (int)$parameters['loggedInUserId'] : null;
		$roles = $parameters['roles'];
//		$roles = isset($parameters['roles']) && sizeof($parameters['roles']) > 0 ? json_decode($parameters['roles'], true) : [];
		$email = sanitize_text_field($parameters['email']);
		$password = isset($parameters['password']) && $parameters['password']!=''? sanitize_text_field($parameters['password']): '123456';
		// $role = sanitize_text_field($parameters['role']);
		$error = new WP_Error();
		if (empty($username)) {
			$error->add(400, __("Username field 'username' is required.", 'lazytasks-project-task-management'), array('status' => 400));
			return $error;
		}
		if (empty($email)) {
			$error->add(401, __("Email field 'email' is required.", 'lazytasks-project-task-management'), array('status' => 400));
			return $error;
		}
		if (empty($password)) {
			$error->add(404, __("Password field 'password' is required.", 'lazytasks-project-task-management'), array('status' => 400));
			return $error;
		}
		$nickname= '';
		if($firstName){
			$nickname .= strtolower($firstName);
		}
		if($lastName){
			$nickname .= '-';
			$nickname .= strtolower($lastName);
		}
		$user_id = username_exists($username);
		if (!$user_id && email_exists($email) == false) {
			$db->query('START TRANSACTION');

			$args = array (
				'user_login'     => $username,
				'user_pass'      => $password, //send as plain text password string
				'user_email'     => $email,
				'user_nicename'       => $nickname,
				'display_name'   => $firstName . ' ' . $lastName,
				'user_registered' => gmdate('Y-m-d H:i:s'),
			);
			$user_id = wp_insert_user($args);
			if (!is_wp_error($user_id)) {
				$user = get_user_by('ID', $user_id);
				$user->set_role('ll_pms');
				update_user_meta($user_id, 'first_name', $firstName);
				update_user_meta($user_id, 'last_name', $lastName);
				add_user_meta($user_id, 'phone_number', $phoneNumber, true);
				if($roles){
					add_user_meta($user_id, 'll_roles', $roles, true);
					$this->addUserRole($user_id, $roles);
				}
				$db->query('COMMIT');
				$loggedInUser = get_user_by('ID', $loggedInUserId);
				$referenceInfo = ['id'=>$user_id, 'name'=>$firstName . ' ' . $lastName, 'type'=>'user'];
				$placeholdersArray = ['name'=>$loggedInUser?$loggedInUser->display_name:'', 'username'=>$email, 'password'=>$password];

				do_action('lazytask_user_registration', $referenceInfo, ['web-app', 'email'], [$user_id], $placeholdersArray);

				$user = $this->getUserById($user_id);

				if($user && sizeof($user)>0){
					return new WP_REST_Response(['status'=>200, 'message'=>'Registration has been Successfully', 'data'=>$user]);
				}

				return new WP_REST_Response(['status'=>404, 'data'=>[]]);
				}
			return new WP_Error('error', __("User Registration Failed", "lazytasks-project-task-management"), array('status' => 500));
			} else {
				return $user_id;
			}
		}

	public function update(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$response = array();
		$parameters = $request->get_body_params();

		$id = $request->get_param('id');

		if(!$id){
			return array('status'=> 500, 'message' => 'User ID is required', 'data'=>[]);
		}
		$username = sanitize_text_field($parameters['email']);
		$firstName = sanitize_text_field($parameters['firstName']);
		$lastName = sanitize_text_field($parameters['lastName']);
		$phoneNumber = sanitize_text_field($parameters['phoneNumber']);
		$roles = isset($parameters['roles']) && $parameters['roles']!='' ? json_decode($parameters['roles'], true) : [];
		$email = sanitize_text_field($parameters['email']);
//		$password = isset($parameters['password']) && $parameters['password']!=''? sanitize_text_field($parameters['password']): '123456';
		// $role = sanitize_text_field($parameters['role']);
		$error = new WP_Error();
		if (empty($username)) {
			$error->add(400, __("Username field 'username' is required.", 'lazytasks-project-task-management'), array('status' => 400));
			return $error;
		}
		if (empty($email)) {
			$error->add(401, __("Email field 'email' is required.", 'lazytasks-project-task-management'), array('status' => 400));
			return $error;
		}

		$nickname= '';
		if($firstName){
			$nickname .= strtolower($firstName);
		}
		if($lastName){
			$nickname .= '-';
			$nickname .= strtolower($lastName);
		}
		$user_id = username_exists($username);
		$userIdByEmail = email_exists($email);

		if ((!$user_id ||  $user_id==$id) && (!$userIdByEmail ||  $userIdByEmail==$id)) {
			$db->query('START TRANSACTION');

			$args = array (
				'ID'     => (int)$id,
				'user_login'     => $username,
				'user_email'     => $email,
				'user_nicename'       => $nickname,
				'display_name'   => $firstName . ' ' . $lastName,
			);
			$userId = wp_update_user($args);

			if (!is_wp_error($userId)) {
				$user = get_user_by('ID', $userId);

				update_user_meta($userId, 'first_name', $firstName);
				update_user_meta($userId, 'last_name', $lastName);

				update_user_meta($userId, 'phone_number', $phoneNumber);
				if($roles){
					update_user_meta($userId, 'll_roles', $roles);

					$this->addUserRole($userId, $roles);
				}

				// Handle file upload
				$requestFile = $request->get_file_params();
				if (isset($requestFile['file']) && $requestFile['file']) {
					require_once(ABSPATH . 'wp-admin/includes/file.php');
					$uploadedfile = $requestFile['file'];
					$upload_overrides = array('test_form' => false);

					$moveFile = wp_handle_upload($uploadedfile, $upload_overrides);

					if($moveFile){
						$attachment = array(
							'post_author' => $userId,
							'post_title' => $uploadedfile['name'],
							'post_content' => '',
							'post_status' => 'inherit',
							'post_mime_type' => image_type_to_mime_type(exif_imagetype($moveFile['file']))
						);

						$attachment_id = wp_insert_attachment($attachment, $moveFile['file']);

						require_once(ABSPATH . 'wp-admin/includes/image.php');
						$attach_data = wp_generate_attachment_metadata($attachment_id, $moveFile['file']);
						wp_update_attachment_metadata($attachment_id, $attach_data);

						update_user_meta($userId, 'profile_photo', $moveFile['url']);
						update_user_meta($userId, 'profile_photo_id', $attachment_id);

					}
				}


				$db->query('COMMIT');

				$user = $this->getUserById($id);

					if($user && sizeof($user)>0){
						return new WP_REST_Response(['status'=>200, 'message'=>'Update has been Successfully', 'data'=>$user]);
					}
					return new WP_REST_Response(['status'=>404, 'data'=>[]]);
				}
			}
			return new WP_Error('error', __("User Update Failed", "lazytasks-project-task-management"), array('status' => 500));
		}

		private function addUserRole($userId, $roles) {
			if(sizeof($roles)>0){
				global $wpdb;
				$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
				$userHasRoles = LAZYTASK_TABLE_PREFIX . 'user_has_roles';
				$db->delete($userHasRoles, array('user_id' => $userId));
				foreach ( $roles as $role ) {
					$db->insert($userHasRoles, array(
						"user_id" => (int)$userId,
						"role_id" => $role['id'],
					));
				}
			}
		}

		public function getTaskByLoggedInUserId(WP_REST_Request $request) {
			$userId = $request->get_param( 'id' );

			$projectsByUser = $this->getProjectsByUserId($userId);

			$taskController = new Lazytask_TaskController();
			$tasks = $taskController->getTasksByAssignedUserId($userId);
			$returnArray = [];
			$columns = ['overdue'=>'Overdue', 'today'=>'Today', 'nextSevenDays'=>'7 Days', 'upcoming'=>'Upcoming'];

			if($tasks && isset($tasks['data']) && sizeof($tasks['data'])>0){
				$currentDate = gmdate('Y-m-d');
				$next7Days = gmdate('Y-m-d', strtotime($currentDate. ' + 7 days'));
				foreach ($tasks['data'] as $key => $value) {
					if($value['end_date'] < $currentDate){
						$value['my_task_section'] = 'overdue';
						$returnArray['overdue'][] = $value;
					}elseif($value['end_date'] == $currentDate){
						$value['my_task_section'] = 'today';
						$returnArray['today'][] = $value;
					}elseif($value['end_date'] > $currentDate && $value['end_date'] <= $next7Days){
						$value['my_task_section'] = 'nextSevenDays';
						$returnArray['nextSevenDays'][] = $value;
					}else{
						$value['my_task_section'] = 'upcoming';
						$returnArray['upcoming'][] = $value;
					}
				}
				$data['tasks'] = $returnArray;
				$data['taskSections'] = $columns;
				$data['orders'] = array_keys(array_unique($columns));
				$data['childTasks'] = isset($tasks['childData']) ? $tasks['childData'] : null;
				$data['userProjects'] = isset($projectsByUser['projects'][$userId]) && sizeof($projectsByUser['projects'][$userId]) > 0 ? array_values($projectsByUser['projects'][$userId]) : [];
				$data['taskStatus'] = isset($projectsByUser['taskStatus']) && sizeof($projectsByUser['taskStatus']) > 0 ? array_values($projectsByUser['taskStatus']) : [];

				return new WP_REST_Response(['status'=>200, 'data'=>$data]);
			}
			$data['userProjects'] = isset($projectsByUser[$userId]) && sizeof($projectsByUser[$userId]) > 0 ? array_values($projectsByUser[$userId]) : [];
			$data['taskStatus'] = isset($projectsByUser['taskStatus']) && sizeof($projectsByUser['taskStatus']) > 0 ? array_values($projectsByUser['taskStatus']) : [];

			return new WP_REST_Response(['status'=>404, 'data'=>$data]);

		}
		public function getQuickTaskByLoggedInUserId(WP_REST_Request $request) {
			$userId = $request->get_param( 'id' );

			$taskController = new Lazytask_TaskController();
			$tasks = $taskController->getQuickTaskByUserId($userId);
			if($tasks && sizeof($tasks)>0){
				return new WP_REST_Response(['status'=>200, 'data'=>$tasks]);
			}

			return new WP_REST_Response(['status'=>404, 'data'=>[]]);

		}

		// get companies by user id
		public function getCompaniesByUserId($userId){
			global $wpdb;
			$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
			$usersTable = $wpdb->prefix . 'users';
			$companyMembersTable = LAZYTASK_TABLE_PREFIX . 'companies_users';
			$companyTable = LAZYTASK_TABLE_PREFIX . 'companies';

			if (is_array($userId)) {
				$ids = implode(', ', array_fill(0, count($userId), '%s'));
			}else{
				$ids = '%s';
				$userId = [$userId];
			}

			$sql = "SELECT companies.* FROM `{$usersTable}` as users
				JOIN `{$companyMembersTable}` as companyMembers  ON users.ID = companyMembers.user_id
						JOIN `{$companyTable}` as companies ON companyMembers.company_id = companies.id
			WHERE companyMembers.user_id IN ($ids) group by companies.id";

			$query = call_user_func_array(array($wpdb, 'prepare'), array_merge(array($sql), $userId));

			$results = $db->get_results(
				$query, ARRAY_A);

			$returnArray = [];
			if($results){
				$returnArray = $results;
			}
			return $returnArray;
		}


	public function getProjectsByUserId($userId){
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		if($userId == ''){
			return [];
		}
		$usersTable = $wpdb->prefix . 'users';
		$projectMembersTable = LAZYTASK_TABLE_PREFIX . 'projects_users';
		$projectTable = LAZYTASK_TABLE_PREFIX . 'projects';
		$taskTable = LAZYTASK_TABLE_PREFIX . 'tasks';

		if (is_array($userId)) {
			$ids = implode(', ', array_fill(0, count($userId), '%s'));
		}else{
			$ids = '%s';
			$userId = [$userId];
		}

		$sql = "SELECT users.ID as userId, users.display_name as userName, projects.id as projectId, projects.name as projectName FROM `{$usersTable}` as users
			JOIN `{$projectMembersTable}` as projectMembers  ON users.ID = projectMembers.user_id
         			JOIN `{$projectTable}` as projects ON projectMembers.project_id = projects.id
		WHERE projectMembers.user_id IN ($ids)";

		$query = call_user_func_array(array($wpdb, 'prepare'), array_merge(array($sql), $userId));

		$results = $db->get_results(
			$query, ARRAY_A);

		$projectIds = array_unique(array_column($results, 'projectId'));
		$projectObj = new Lazytask_ProjectController();
		$totalTasks = $projectObj->getNoOfTasksByProject($projectIds, true);
		$taskStatus = isset($totalTasks['statusData']) ? $totalTasks['statusData'] : [];

		$returnArray = [];
		if($results){

			foreach ($results as $key => $value) {
				$returnArray[$value['userId']][$value['projectId']]['id'] = $value['projectId'];
				$returnArray[$value['userId']][$value['projectId']]['name'] = $value['projectName'];

				if(sizeof($taskStatus) > 0){
					foreach ( $taskStatus as $task_status ) {
						$returnArray[$value['userId']][$value['projectId']][$task_status] = isset($totalTasks['recordData'][$value['projectId']]) && isset($totalTasks['recordData'][$value['projectId']][$task_status]) ? $totalTasks['recordData'][$value['projectId']][$task_status] : 0;
					}
//					$returnArray[$value['userId']][$value['projectId']]['TOTAL'] = isset($totalTasks['recordData'][$value['projectId']])  ? array_sum($totalTasks['recordData'][$value['projectId']]) : 0;

				}
			}
		}
		return ['projects'=> $returnArray, 'taskStatus'=>$taskStatus] ;
	}

	public static function getUserAvatar($userId){
		$user = get_userdata( $userId );
		$profile_photo_id = get_user_meta($userId, 'profile_photo_id', true);
		if($profile_photo_id){
			$attachment = wp_get_attachment_image_src($profile_photo_id, 'thumbnail');
			if($attachment){
				return $attachment[0];
			}
		}

		/*if($user){
			return get_avatar_url($user->ID);
		}*/
		return '';

	}
}