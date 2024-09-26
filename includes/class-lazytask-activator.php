<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * Fired during plugin activation
 *
 * @link       https://lazycoders.co
 * @since      1.0.0
 *
 * @package    Lazytask_Lazy_Task
 * @subpackage Lazytask_Lazy_Task/includes
 */



/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Lazytask_Lazy_Task
 * @subpackage Lazytask_Lazy_Task/includes
 * @author     lazycoders <info@lazycoders.co>
 */
class Lazytask_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate()
	{
		\Lazytask\Helper\Lazytask_DatabaseTableSchema::run();

		// Create pages if not exist

		$login_page_id = get_option('lazytask_page_id');
		if(!$login_page_id)
			self::create_pages();

//		Database_Table_Schema::create();
	}

	private static function create_pages()
	{
		$pages = array(
			'Lazy Task' => 'lazy-task',
		);
		foreach ($pages as $title => $page_slug) {
			$saved_page_args = array(
				'post_title'   => $title,
				'slug' => $page_slug,
				'post_content' => '',
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'page_template' => plugin_dir_path( dirname( __FILE__ ) ) .'templates/lazytask-page-template.php',
			);


			// Insert the page and get its id.
			$saved_page_id = wp_insert_post( $saved_page_args );
			if($title == 'Lazy Task')
				// Save page id to the database.
				add_option( 'lazytask_page_id', $saved_page_id );
			// Save  id to the database.
		}
	}



}
