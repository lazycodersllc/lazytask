<?php

namespace Lazytask\Controller;

use Lazytask\Helper\Lazytask_DatabaseTableSchema;
use Lazytask\Notification\includes\Integrations;
use WP_REST_Request;
use WP_REST_Response;

final class Lazytask_NotificationController {

	//$actionList
	protected array $actionList = [];

	public function __construct() {
		$this->init();
		$this->actionList = [
			'lazy_coder_task_created'=>'Task Create',
			'lazy_coder_task_updated'=>'Task Update',
			'lazy_coder_task_assigned' => 'Task Assigned'
		];
	}

	private function init() {
		add_filter('lazycoder_integrated_action_list', [$this, 'extendedNotificationAction']);
	}
    public function extendedNotificationAction($preDefineActionList) {
		$actionList = $this->actionList;
		return array_merge($preDefineActionList, $actionList);
	}


	public function getNotificationActionList() {

		$actionList = Integrations::registeredActionLists();

		return new WP_REST_Response(['status'=>200, 'message'=>'Success', 'data'=>$actionList], 200);
	}


	public function getNotificationChannels() {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationChannelTable = LAZYTASK_TABLE_PREFIX . 'notification_channels';
		$notificationChannels = self::getChannels();
		try {
			if($notificationChannels) {
				return new WP_REST_Response(['status'=>200, 'message'=>'Success', 'data'=>$notificationChannels], 200);
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'No channel found', 'data'=>[]], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}
	}

	public static function getChannels() {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationChannelTable = LAZYTASK_TABLE_PREFIX . 'notification_channels';
		$notificationChannels = $db->get_results($db->prepare("SELECT * FROM {$notificationChannelTable} where status=%d ORDER BY `sort_order` ASC", 1), ARRAY_A);

		return $notificationChannels;
	}

	public function getNotificationTemplates() {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$notificationTemplates = $db->get_results($db->prepare("SELECT * FROM {$notificationTemplateTable} where status=%d", 1), ARRAY_A);
		try {
			$returnData = [];
			if($notificationTemplates) {
				foreach ($notificationTemplates as $notificationTemplate) {
					$notificationTemplate['content'] = json_decode($notificationTemplate['content']);
					$returnData[] = $notificationTemplate;
				}
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'No template found', 'data'=>$returnData], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}

	}

	// create notification template
	public function createNotificationTemplate(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$data = $request->get_json_params();

		try {
			$notificationTemplateData = [
				'title' => isset($data['title']) && $data['title'] ? sanitize_text_field($data['title']) : null,
				'description' => isset($data['description']) && $data['description'] ? sanitize_textarea_field($data['description']) : null,
				'content' => isset($data['content']) && $data['content'] ? wp_json_encode($data['content']) : null,
				'notification_action_name' => isset($data['notification_action_name']) && $data['notification_action_name'] ? $data['notification_action_name'] : null,
				'email_subject' => isset($data['email_subject']) && $data['email_subject'] ? $data['email_subject'] : null,
				'status' => 1,
				'created_at' => gmdate('Y-m-d H:i:s'),
				'updated_at' => gmdate('Y-m-d H:i:s')
			];
			$notificationTemplateInsert = $db->insert($notificationTemplateTable, $notificationTemplateData);
			if($notificationTemplateInsert) {
				$notificationTemplateId = $wpdb->insert_id;
				$notificationTemplate = $this->getNotificationTemplateById($notificationTemplateId);
				return new WP_REST_Response(['status'=>200, 'message'=>'Notification template created successfully', 'data'=>$notificationTemplate], 200);
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'Notification template not created', 'data'=>[]], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}
	}

	//show notification template by id
	public function showNotificationTemplate(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$templateId = $request->get_param('id');
		$notificationTemplate = $this->getNotificationTemplateById($templateId);
		try {
			if($notificationTemplate) {
				return new WP_REST_Response(['status'=>200, 'message'=>'Success', 'data'=>$notificationTemplate], 200);
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'No template found', 'data'=>[]], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}
	}

	// get notification template by id
	public function getNotificationTemplateById($templateId) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$notificationTemplate = $db->get_row($db->prepare("SELECT * FROM {$notificationTemplateTable} where id=%d", $templateId), ARRAY_A);
		try {
			if($notificationTemplate) {
				$notificationTemplate['content'] = json_decode($notificationTemplate['content']);
				return $notificationTemplate;
			}
			return null;
		} catch (\Exception $e) {
			return null;
		}
	}

	//editNotificationTemplate
	public function editNotificationTemplate(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$templateId = $request->get_param('id');
		$data = $request->get_json_params();
		$notificationTemplate = $this->getNotificationTemplateById($templateId);
		if(!$notificationTemplate) {
			return new WP_REST_Response(['status'=>200, 'message'=>'No template found', 'data'=>[]], 200);
		}
		try {
			$notificationTemplateData = [
				'title' => isset($data['title']) && $data['title'] ? sanitize_text_field($data['title']) : $notificationTemplate['title'],
				'description' => isset($data['description']) && $data['description'] ? sanitize_textarea_field($data['description']) : $notificationTemplate['description'],
				'content' => isset($data['content']) && $data['content'] ? wp_json_encode($data['content']) : null,
				'notification_action_name' => isset($data['notification_action_name']) && $data['notification_action_name'] ? $data['notification_action_name'] : null,
				'email_subject' => isset($data['email_subject']) && $data['email_subject'] ? $data['email_subject'] : null,
				'updated_at' => gmdate('Y-m-d H:i:s')
			];
			$notificationTemplateUpdate = $db->update($notificationTemplateTable, $notificationTemplateData, ['id'=>$templateId]);
			if($notificationTemplateUpdate) {
				$notificationTemplate = $this->getNotificationTemplateById($templateId);
				return new WP_REST_Response(['status'=>200, 'message'=>'Notification template updated successfully', 'data'=>$notificationTemplate], 200);
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'Notification template not updated', 'data'=>[]], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}
	}

	//delete notification template by id
	public function deleteNotificationTemplate(WP_REST_Request $request) {
		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$templateId = $request->get_param('id');
		$notificationTemplate = $this->getNotificationTemplateById($templateId);
		if(!$notificationTemplate) {
			return new WP_REST_Response(['status'=>200, 'message'=>'No template found', 'data'=>[]], 200);
		}
		try {
			// delete notification template
			$notificationTemplateDelete = $db->delete($notificationTemplateTable, ['id'=>$templateId]);
			if($notificationTemplateDelete) {
				return new WP_REST_Response(['status'=>200, 'message'=>'Notification template deleted successfully', 'data'=>['id'=>$templateId]], 200);
			}
			return new WP_REST_Response(['status'=>200, 'message'=>'Notification template not deleted', 'data'=>[]], 200);
		} catch (\Exception $e) {
			return new WP_REST_Response(['status'=>400, 'message'=>'Error', 'data'=>[]], 400);
		}
	}


}