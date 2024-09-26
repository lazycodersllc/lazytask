<?php

use Lazytask\Helper\Lazytask_DatabaseTableSchema;

//add_action('lazy_coder_task_created', 'send_sms', 10, 1);


function send_sms($task) {

	global $wpdb;
	$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
	$notificationTable = LAZYTASK_TABLE_PREFIX . "notifications";
	//insert notification
	$db->insert($notificationTable, array(
		'content' => 'sms',
		'status' => 1,
	));
}
