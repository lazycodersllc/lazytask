<?php

namespace Lazytask\Helper;

use wpdb;
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Lazytask_DatabaseTableSchema {

	public static function run(){
		self::tbl_companies();
		self::tbl_companies_users();

		self::tbl_projects();
		self::tbl_projects_users();
		self::tbl_project_priorities();

		self::tbl_task_sections();
		self::tbl_tasks();
		self::tbl_task_members();
		self::tbl_roles();
		self::tbl_permissions();
		self::tbl_role_has_permissions();
		self::tbl_user_has_roles();
		self::tbl_comments();
		self::tbl_activity_log();
		self::tbl_attachment();
		self::tbl_tags();
		self::tbl_task_tags();
		self::tbl_quick_task();
		self::tbl_notification_channel();
		self::tbl_notification_template();
		self::tbl_notification();
		self::tbl_notification_history();
	}

	private static function tbl_companies(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'companies';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '9999',
  `created_by` bigint unsigned DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}


	private static function tbl_companies_users(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'companies_users';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_projects(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'projects';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '9999',  
  `created_by` bigint unsigned DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}
	private static function tbl_projects_users(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'projects_users';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}
	private static function tbl_project_priorities(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'project_priorities';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Low',
  `color_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `sort_order` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}
	private static function tbl_task_sections(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'task_sections';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Untitled Section',
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mark_is_complete` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'regular',
  `sort_order` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_tasks(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'tasks';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `project_id` bigint unsigned DEFAULT NULL,
  `section_id` bigint unsigned DEFAULT NULL,
  `assigned_to` bigint unsigned DEFAULT NULL,
  `priority_id` bigint unsigned DEFAULT NULL,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
  `sort_order` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_task_members(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'task_members';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_roles(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'roles';
		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);



		$db = self::get_global_wp_db();
		$array = [
			[
				'name' => 'Superadmin',
				'slug' => 'superadmin'
			],[
				'name' => 'Admin',
				'slug' => 'admin'
			],[
				'name' => 'Director',
				'slug' => 'director'
			],[
				'name' => 'Manager',
				'slug' => 'manager'
			],[
				'name' => 'Line Manager',
				'slug' => 'line-manager'
			],[
				'name' => 'Employee',
				'slug' => 'employee'
			],[
				'name' => 'Follower',
				'slug' => 'follower'
			]
		];

		//if empty check data
		if($db->get_row("SELECT * FROM $table_name") == null){
			foreach ($array as $item){
				$db->insert($table_name, $item);
			}
		}

	}

	private static function tbl_permissions(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'permissions';
		$table_generate_query = "CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);

		$arrayPermissions = [
			[
				'name' => 'superadmin',
				'description' => 'superadmin'
			],[
				'name' => 'admin',
				'description' => 'admin'
			],[
				'name' => 'director',
				'description' => 'director'
			],[
				'name' => 'accounts',
				'description' => 'accounts'
			],[
				'name' => 'manager',
				'description' => 'manager'
			],[
				'name' => 'line_manager',
				'description' => 'line_manager'
			],[
				'name' => 'employee',
				'description' => 'employee'
			],[
				'name' => 'follower',
				'description' => 'follower'
			],[
				'name' => 'task-edit',
				'description' => 'task-edit'
			],[
				'name' => 'task-view',
				'description' => 'task-view'
			]
		];

		$db = self::get_global_wp_db();
		if($db->get_row("SELECT * FROM $table_name") == null){
			foreach ($arrayPermissions as $item){
				$db->insert($table_name, $item);
			}
		}

	}

	private static function tbl_role_has_permissions(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'role_has_permissions';
		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);

		$rolePermissions = [
			[
				'role_id' => 1,
				'permission_id' => 1
			],[
				'role_id' => 1,
				'permission_id' => 2
			],[
				'role_id' => 1,
				'permission_id' => 3
			],[
				'role_id' => 1,
				'permission_id' => 4
			],[
				'role_id' => 1,
				'permission_id' => 5
			],[
				'role_id' => 1,
				'permission_id' => 6
			],[
				'role_id' => 1,
				'permission_id' => 7
			],[
				'role_id' => 1,
				'permission_id' => 8
			],[
				'role_id' => 1,
				'permission_id' => 9
			],[
				'role_id' => 1,
				'permission_id' => 10
			],[
				'role_id' => 2,
				'permission_id' => 2
			],[
				'role_id' => 2,
				'permission_id' => 3
			],[
				'role_id' => 2,
				'permission_id' => 4
			],[
				'role_id' => 2,
				'permission_id' => 5
			],[
				'role_id' => 2,
				'permission_id' => 6
			],[
				'role_id' => 2,
				'permission_id' => 7
			],[
				'role_id' => 2,
				'permission_id' => 8
			],[
				'role_id' => 2,
				'permission_id' => 9
			],[
				'role_id' => 2,
				'permission_id' => 10
			],[
				'role_id' => 3,
				'permission_id' => 3
			],[
				'role_id' => 3,
				'permission_id'=> 4
			],
			[
				'role_id' => 3,
				'permission_id'=> 5
			],
			[
				'role_id' => 3,
				'permission_id'=> 6
			],
			[
				'role_id' => 3,
				'permission_id'=> 7
			],
			[
				'role_id' => 3,
				'permission_id'=> 8
			],
			[
				'role_id' => 3,
				'permission_id'=> 9
			],
			[
				'role_id' => 3,
				'permission_id'=> 10
			],
			[
				'role_id' => 4,
				'permission_id'=> 4
			],
			[
				'role_id' => 4,
				'permission_id'=> 5
			],
			[
				'role_id' => 4,
				'permission_id'=> 6
			],
			[
				'role_id' => 4,
				'permission_id'=> 7
			],
			[
				'role_id' => 4,
				'permission_id'=> 8
			],
			[
				'role_id' => 4,
				'permission_id'=> 9
			],
			[
				'role_id' => 4,
				'permission_id'=> 10
			],
			[
				'role_id' => 5,
				'permission_id'=> 5
			],
			[
				'role_id' => 5,
				'permission_id'=> 6
			],
			[
				'role_id' => 5,
				'permission_id'=> 7
			],
			[
				'role_id' => 5,
				'permission_id'=> 8
			],
			[
				'role_id' => 5,
				'permission_id'=> 9
			],
			[
				'role_id' => 5,
				'permission_id'=> 10
			],
			[
				'role_id' => 6,
				'permission_id'=> 6
			],
			[
				'role_id' => 6,
				'permission_id'=> 7
			],
			[
				'role_id' => 6,
				'permission_id'=> 8
			],
			[
				'role_id' => 6,
				'permission_id'=> 9
			],
			[
				'role_id' => 6,
				'permission_id'=> 10
			],
			[
				'role_id' => 7,
				'permission_id'=> 7
			],
			[
				'role_id' => 7,
				'permission_id'=> 8
			],
			[
				'role_id' => 7,
				'permission_id'=> 9
			],
			[
				'role_id' => 7,
				'permission_id'=> 10
			],
		];

		$db = self::get_global_wp_db();

		if($db->get_row("SELECT * FROM $table_name") == null){
			foreach ($rolePermissions as $item){
				$db->insert($table_name, $item);
			}
		}


	}

	private static function tbl_user_has_roles(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'user_has_roles';
		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);

		$db = self::get_global_wp_db();
		//role superadmin
		$roleSuperAdmin = $db->get_row("SELECT * FROM ". LAZYTASK_TABLE_PREFIX . "roles WHERE slug = 'superadmin'");
		//how to get admin user
		$adminUsers = get_users(['role' => 'administrator']);
//		var_dump($adminUsers);die;
		if(sizeof($adminUsers)>0){
			foreach ($adminUsers as $adminUser){
				$checkUserHasRole = $db->get_row("SELECT * FROM $table_name WHERE user_id = $adminUser->ID AND role_id = $roleSuperAdmin->id");
				if($checkUserHasRole == null){
					$db->insert($table_name, [
						'user_id' => $adminUser->ID,
						'role_id' => $roleSuperAdmin->id
					]);
					$roles = array(
						0 => array(
							"id" => (string)$roleSuperAdmin->id,
							"name" => $roleSuperAdmin->name,
						)
					);
					$arraySerialize = serialize($roles);
					add_user_meta($adminUser->ID, 'll_roles', $arraySerialize, true);
				}
			}
		}
	}

	private static function tbl_comments(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'comments';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  `commentable_id` int DEFAULT NULL,
  `commentable_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '9999',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_activity_log(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'activity_log';

		$table_generate_query = "
	       CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_attachment(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'attachments';

		$table_generate_query = "
	       CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `mine_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` int DEFAULT NULL,
  `wp_attachment_id` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `subject_id` int DEFAULT NULL,
  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject_type` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}


	private static function tbl_tags(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'tags';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` int NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '9999',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}


	private static function tbl_task_tags(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'task_tags';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `task_id` bigint unsigned DEFAULT NULL,
  `tag_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `deleted_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}


	private static function tbl_quick_task(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'quick_tasks';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
		  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
		  `user_id` int DEFAULT NULL,
		  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `status` int NOT NULL DEFAULT '1',
		  `sort_order` int NOT NULL DEFAULT '9999',
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_notification_channel(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'notification_channels';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
		  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
		  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `status` int NOT NULL DEFAULT '1',
		  `sort_order` int NOT NULL DEFAULT '9999',
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);

		$arrayChannels = [
			[
				'name' => 'Web App',
				'slug' => 'web-app'
			],
			[
				'name' => 'SMS',
				'slug' => 'sms'
			],
			[
				'name' => 'Email',
				'slug' => 'email'
			],
			[
				'name' => 'Mobile',
				'slug' => 'mobile'
			],
			[
				'name' => 'Browser',
				'slug' => 'browser'
			]
		];

		$db = self::get_global_wp_db($wpdb);
		if($db->get_row("SELECT * FROM $table_name") == null){
			foreach ($arrayChannels as $item){
				$item['created_at'] = gmdate('Y-m-d H:i:s');
				$db->insert($table_name, $item);
			}
		}
	}

	private static function tbl_notification_template(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'notification_templates';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
		  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
		  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `notification_action_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
		  `email_subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `content` json DEFAULT NULL,
		  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,		  
		  `status` int NOT NULL DEFAULT '1',
		  `sort_order` int NOT NULL DEFAULT '9999',
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);

		//default template data
		$defaultTemplates = [
			[
				'title' => 'When someone is added in the system',
				'notification_action_name' => 'lazytask_user_registration',
				'description' => 'When someone is added in the system',
				'email_subject' => 'You have been added to LazyTask Task Management System',
				'content' => json_encode([
'email' => 'Welcome to LazyTasks,

You have been invited to the LazyTasks Project and Task Management system by [NAME].

Please find your username and password below.
Username: [USERNAME]
Password: [PASSWORD]

Please click here to join: https://tasks.pul-group.com/lazy-task/

We recommend you change your password once logged in.

Thanks.
System Notification',
'web-app' => 'Welcome to LazyTasks,

You have been invited to the LazyTasks Project and Task Management system by [NAME].

Please find your username and password below.
Username: [USERNAME]
Password: [PASSWORD]

We recommend you change your password once logged in.

Thanks.
System Notification'
]),
				'type' => null,
				'status' => 1,
				'sort_order' => 1,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'When someone is added to a workspace',
				'notification_action_name' => 'lazytask_workspace_assigned_member',
				'description' => 'When someone is added to a workspace',
				'email_subject' => 'You have been added to a new Workspace',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

You have been added to the workspace [COMPANY_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your Manager.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

You have been added to the workspace [COMPANY_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your LazyTasks system administrator.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 2,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'When someone is removed from a workspace',
				'notification_action_name' => 'lazytask_workspace_removed_member',
				'description' => 'When someone is removed from a workspace',
				'email_subject' => 'You have been removed to a Workspace',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

You have been removed from the workspace [COMPANY_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your manager.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

You have been removed from the workspace [COMPANY_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your LazyTasks system administrator.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 3,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'When someone is added to a project',
				'notification_action_name' => 'lazytask_project_assigned_member',
				'description' => 'When someone is added to a project',
				'email_subject' => 'You have been added to a new project',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

You have been added to the project [PROJECT_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your Manager.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

You have been added to the workspace [PROJECT_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your LazyTasks system administrator

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 4,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'When someone is removed from a project',
				'notification_action_name' => 'lazytask_project_removed_member',
				'description' => 'When someone is removed from a project',
				'email_subject' => 'You have been removed from a new project',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

You have been removed from the project [PROJECT_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your Manager.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

You have been removed from the project [PROJECT_NAME] by [CREATOR_NAME] in the role of [MEMBER_ROLES].

If you think this was an error, please contact your LazyTasks system administrator.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 5,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'When a task is assigned to an user',
				'notification_action_name' => 'lazytask_task_assigned_member',
				'description' => 'When a task is assigned to an user',
				'email_subject' => 'A new task has been assigned to you',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

The following task has been assigned to you by [CREATOR_NAME] on the [PROJECT_NAME].

Task Name: [TASK_NAME]

Please sign into your project management web-portal or mobile app for further details.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

The following task has been assigned to you by [CREATOR_NAME] on the [PROJECT_NAME].

Task Name: [TASK_NAME]

Please sign into LazyTasks web or mobile to view further details.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 6,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'Date change on a task',
				'notification_action_name' => 'lazytask_task_deadline_changed',
				'description' => 'Date change on a task',
				'email_subject' => 'Attention: deadline has changed',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

The deadline for [TASK_NAME] in the [PROJECT_NAME] has been changed from [PREVIOUS_ASSIGNED_DATE] to [NEW_ASSIGNED_DATE] by [CREATOR_NAME].

Please sign into view further details.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

The deadline for [TASK_NAME] in the [PROJECT_NAME] has been changed from [PREVIOUS_ASSIGNED_DATE] to [NEW_ASSIGNED_DATE] by [CREATOR_NAME].

Please sign into your project management web-portal or mobile app for further details.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 7,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'Someone started following a task',
				'notification_action_name' => 'lazytask_task_follow_by_own',
				'description' => 'Someone started following a task',
				'email_subject' => 'A member started following a task',
				'content' => json_encode([
'email' => 'Hello [MEMBER_NAME],

[CREATOR_NAME] is now following the task titled [TASK_NAME].

Please sign into your project management web-portal or mobile app for further details.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

[CREATOR_NAME] is now following the task titled [TASK_NAME].

Please sign into your project management web-portal or mobile app for further details.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 8,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],
			[
				'title' => 'Someone (with permission) has forced another user to follow a task',
				'notification_action_name' => 'lazytask_task_follow_to_other',
				'description' => 'Someone (with permission) has forced another user to follow a task',
				'email_subject' => 'Attention: Someone has made you a follower in a task',
				'content' => json_encode([
				'email' => 'Hello [MEMBER_NAME],

[CREATOR_NAME] has now made you a follower of the task [TASK_NAME].

Usually, when someone makes you a follower of a task, that means you need to keep an eye on this specific task.

Please sign into your project management web-portal or mobile app for further details.

Thanks.
System Notification',
'web-app' => 'Hello [MEMBER_NAME],

[CREATOR_NAME] has now made you a follower of the task [TASK_NAME].

Please sign into view further details.

Thanks.
System Notification'
				]),
				'type' => null,
				'status' => 1,
				'sort_order' => 9,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			],

		];

		$db = self::get_global_wp_db();
		if($db->get_row("SELECT * FROM $table_name") == null){
			foreach ($defaultTemplates as $item){
				$db->insert($table_name, $item);
			}
		}

	}

	private static function tbl_notification(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'notifications';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
		  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
		  `user_id` bigint unsigned DEFAULT NULL,
		  `notification_template_id` bigint unsigned DEFAULT NULL,
		  `notification_action_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `subject_id` bigint unsigned DEFAULT NULL,
		  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `subject_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
		  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `is_read` int NOT NULL DEFAULT '0',		  
		  `status` int NOT NULL DEFAULT '1',
		  `sort_order` int NOT NULL DEFAULT '9999',
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	private static function tbl_notification_history(){
		global $wpdb;
		$table_name = LAZYTASK_TABLE_PREFIX . 'notification_histories';

		$table_generate_query = "
	        CREATE TABLE IF NOT EXISTS `". $table_name ."` (
		  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
		  `user_id` bigint unsigned DEFAULT NULL,
		  `notification_template_id` bigint unsigned DEFAULT NULL,
		  `notification_action_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `subject_id` bigint unsigned DEFAULT NULL,
		  `subject_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `subject_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
		  `channel` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
		  `is_read` int NOT NULL DEFAULT '0',		  
		  `status` int NOT NULL DEFAULT '1',
		  `sort_order` int NOT NULL DEFAULT '9999',
		  `created_at` timestamp NULL DEFAULT NULL,
		  `updated_at` timestamp NULL DEFAULT NULL,
		  PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
	";
		require_once (ABSPATH. 'wp-admin/includes/upgrade.php');
		dbDelta($table_generate_query);
	}

	public static function get_global_wp_db( $wpdb = NULL ) {
		static $db;
		if ( is_null($db) || ! is_null( $wpdb ) ) {
			$db = is_null($wpdb) ? $GLOBALS['wpdb'] : $wpdb;
		}
		return $db;
	}
	public function get_global_wpdb( $wpdb = NULL ) {
		static $db;
		if ( is_null($db) || ! is_null( $wpdb ) ) {
			$db = is_null($wpdb) ? $GLOBALS['wpdb'] : $wpdb;
		}
		return $db;
	}
}