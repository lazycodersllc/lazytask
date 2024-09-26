<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://lazycoders.co
 * @since      1.0.0
 *
 * @package    Lazytask_Lazy_Task
 * @subpackage Lazytask_Lazy_Task/admin
 */

use Firebase\JWT\JWT;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Lazytask_Lazy_Task
 * @subpackage Lazytask_Lazy_Task/admin
 * @author     lazycoders <info@lazycoders.co>
 */
class Lazytask_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function lazytask_enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Lazytask_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Lazytask_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if (isset($_REQUEST['page']) && str_contains($_REQUEST['page'], 'pms-rbs')){
			wp_enqueue_style( 'lazy-task-style', plugin_dir_url( __FILE__ ) . 'frontend/build/index.css', array(), $this->version, 'all');
		}
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/pms-rbs-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function lazytask_enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Lazytask_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Lazytask_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
        if (isset($_REQUEST['page']) && str_contains($_REQUEST['page'], 'pms-rbs')) {
	        $userController = new \Lazytask\Controller\Lazytask_UserController();
			$userResponse = $userController->admin_after_auth_login();

            wp_enqueue_script('pms-rbs', plugin_dir_url(__FILE__) . 'frontend/build/index.js', array('jquery', 'wp-element'), '1.0.4', true);
            wp_localize_script('pms-rbs', 'appLocalizer', [
                'apiUrl' => home_url('/wp-json'),
                'homeUrl' => home_url(''),
                'nonce' => wp_create_nonce('wp_rest'),
	            'is_admin' => 1,
				'userResponse' => $userResponse
	            ]);
        }


	}


    public function lazytask_admin_menu() {
        add_menu_page(
            __("Lazy Tasks", "lazytasks-project-task-management"),
            __("Lazy Tasks", "lazytasks-project-task-management"),
            "ll_pms",
            "pms-rbs",
            array($this, "lazytask_init"),
            "dashicons-layout",
            0
        );

    }

    public function lazytask_init() {
        echo "<div id='lazy_pms'></div>";
    }

	public function lazytask_admin_routes() {
		(new \Lazytask\Routes\Lazytask_Api())->register_routes();
	}

//add_filter('wp_authenticate_user', 'lazytask_auth_login',10,2);
    function lazytask_auth_login ($user_login) {
	    $user = get_user_by('login', $user_login );
	    wp_set_current_user($user->ID, $user->display_name);
	    wp_set_auth_cookie($user->ID, true, false);
	    setcookie('user_id', $user->ID, strtotime('+1 day'));

	}

}
