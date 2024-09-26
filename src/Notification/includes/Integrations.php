<?php

namespace Lazytask\Notification\includes;

use Lazytask\Controller\Lazytask_NotificationController;
use Lazytask\Helper\Lazytask_DatabaseTableSchema;
use Lazytask\Notification\services\SmsGateWay;

class Integrations {

	public function __construct() {
		add_action('phpmailer_init', [$this, 'configure_phpmailer']);
		add_action('plugins_loaded', [$this, 'init']);

	}

	public function init() {
		global $wpdb;
		$db = (new \Lazytask\Helper\Lazytask_DatabaseTableSchema())->get_global_wpdb($wpdb);

		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';

		$notificationTemplates = $db->get_results($db->prepare("SELECT * FROM {$notificationTemplateTable} where status=%d", 1), ARRAY_A);
		$notificationActionLists = array_unique(array_column($notificationTemplates, 'notification_action_name'));
		if($notificationActionLists) {
			foreach ($notificationActionLists as $action) {
				if($action){
					add_action($action, [$this, 'sendNotification'], 10, 4);
				}
			}
		}
	}

   public function configure_phpmailer($phpmailer) {

	   $lazytaskSettings = get_option('lazytask_settings', []);
		$smtpConfig = isset($lazytaskSettings['smtp_configuration']) && $lazytaskSettings['smtp_configuration'] ? json_decode($lazytaskSettings['smtp_configuration'], true) : [];
		$smtpServiceProvider = isset($smtpConfig['smtp_service_provider']) && $smtpConfig['smtp_service_provider'] ? $smtpConfig['smtp_service_provider'] : '';
		if($smtpServiceProvider && $smtpServiceProvider=='zoho') {
			$this->configure_zoho_phpmailer($phpmailer);
		}
	}

	public function configure_zoho_phpmailer($phpmailer) {
		$lazytaskSettings = get_option('lazytask_settings', []);
		$smtpConfig = isset($lazytaskSettings['smtp_configuration']) && $lazytaskSettings['smtp_configuration'] ? json_decode($lazytaskSettings['smtp_configuration'], true) : [];
		$smtpHost = isset($smtpConfig['smtp_host']) && $smtpConfig['smtp_host'] ? $smtpConfig['smtp_host'] : '';
		$smtpPort = isset($smtpConfig['smtp_port']) && $smtpConfig['smtp_port'] ? $smtpConfig['smtp_port'] : '';
		$smtpUsername = isset($smtpConfig['smtp_username']) && $smtpConfig['smtp_username'] ? $smtpConfig['smtp_username'] : '';
		$smtpPassword = isset($smtpConfig['smtp_password']) && $smtpConfig['smtp_password'] ? $smtpConfig['smtp_password'] : '';
		$smtpSenderName = isset($smtpConfig['smtp_sender_name']) && $smtpConfig['smtp_sender_name'] ? $smtpConfig['smtp_sender_name'] : '';
		$smtpSenderEmail = isset($smtpConfig['smtp_sender_email']) && $smtpConfig['smtp_sender_email'] ? $smtpConfig['smtp_sender_email'] : '';

		if( $smtpHost && $smtpPort && $smtpUsername && $smtpPassword && $smtpSenderName && $smtpSenderEmail) {
			$phpmailer->isSMTP();
			$phpmailer->Host       = $smtpHost;
			$phpmailer->SMTPAuth   = true;
			$phpmailer->Username   = $smtpUsername; // Replace with your Zoho email
			$phpmailer->Password   = $smtpPassword; // Replace with your Zoho email password
			$phpmailer->SMTPSecure = 'tls'; // Use 'tls' if you are using port 587
			$phpmailer->Port       = $smtpPort; // Use 587 for TLS
			$phpmailer->From       = $smtpSenderEmail; // Replace with your Zoho email
			$phpmailer->FromName   = $smtpSenderName; // Replace with your name or site name
			$phpmailer->isHTML( true ); // Set email format to HTML
			$phpmailer->CharSet = 'UTF-8'; // Set email character encoding
		}

	}

	public function sendNotification( $subjectInfo, $channels=[], $userIds=[], $placeholders = []) {

		global $wpdb;
		$db = Lazytask_DatabaseTableSchema::get_global_wp_db($wpdb);
		$notificationHistoriesTable = LAZYTASK_TABLE_PREFIX . "notification_histories";
		$notificationsTable = LAZYTASK_TABLE_PREFIX . "notifications";

		$registeredChannels = Lazytask_NotificationController::getChannels();

		$registeredChannelSlugs = array_column($registeredChannels, 'slug');

		$currentAction = current_filter();
		// get template by action
		$notificationTemplateTable = LAZYTASK_TABLE_PREFIX . 'notification_templates';
		$notificationTemplate = $db->get_row($db->prepare("SELECT * FROM {$notificationTemplateTable} where notification_action_name=%s and status=%d", $currentAction, 1), ARRAY_A);

		$userInfo = [];

		if($notificationTemplate){
			if($channels && is_array($channels) && count($channels) > 0) {
				$templateContent = json_decode($notificationTemplate['content'], true);
				foreach ( $channels as $channel ) {
					if(in_array($channel, $registeredChannelSlugs)) {
						$content = isset($templateContent[$channel]) && $templateContent[$channel]!='' ? $templateContent[$channel] : '';

						if($userIds && is_array($userIds) && count($userIds) > 0) {

							foreach ($userIds as $userId) {
							$insertedRecord =	$db->insert($notificationHistoriesTable, array(
									'notification_template_id' => $notificationTemplate['id'],
									'content' => $this->contentPlaceholderReplace($content, $placeholders),
									'notification_action_name' => $currentAction,
									'subject_id' => isset($subjectInfo['id']) && $subjectInfo['id'] ? $subjectInfo['id'] : null,
									'subject_type' => isset($subjectInfo['type']) && $subjectInfo['type'] ? $subjectInfo['type'] : null,
									'subject_name' => isset($subjectInfo['name']) && $subjectInfo['name'] ? $subjectInfo['name'] : null,
									'channel' => $channel,
									'user_id' => $userId,
									'status' => 1,
									'created_at' => gmdate('Y-m-d H:i:s'),
								));
							if($insertedRecord){
								if($channel =='web-app'){
									$db->insert($notificationsTable, array(
										'notification_template_id' => $notificationTemplate['id'],
										'content' => $this->contentPlaceholderReplace($content, $placeholders),
										'notification_action_name' => $currentAction,
										'subject_id' => isset($subjectInfo['id']) && $subjectInfo['id'] ? $subjectInfo['id'] : null,
										'subject_type' => isset($subjectInfo['type']) && $subjectInfo['type'] ? $subjectInfo['type'] : null,
										'subject_name' => isset($subjectInfo['name']) && $subjectInfo['name'] ? $subjectInfo['name'] : null,
										'user_id' => $userId,
										'status' => 1,
										'created_at' => gmdate('Y-m-d H:i:s'),
									));
								}

								// send notification
								$user = get_userdata($userId);
								$userInfo= [
									'id' => $user->ID,
									'email' => $user->user_email,
									'first_name' => $user->first_name,
									'last_name' => $user->last_name,
									'phone_number' => get_user_meta($user->ID, 'phone_number', true),
									];

								if($channel == 'email') {
									$to = $userInfo['email'];
									$subject = isset($notificationTemplate['email_subject']) && $notificationTemplate['email_subject'] ? $notificationTemplate['email_subject'] : 'Notification';
									$message = $this->contentPlaceholderReplace($content, $placeholders);
									$headers = array('Content-Type: text/html; charset=UTF-8');
									wp_mail($to, $subject, $message, $headers);
								}elseif ($channel == 'sms') {
									// send sms
									$to = $userInfo['phone_number'];
									$message = $this->contentPlaceholderReplace($content, $placeholders);
									$from = 'PMS';
									$this->sendSMS($to, $message, $from);
								}elseif ($channel == 'web-app') {
									// send web app notification

								}

							}
							}

						}

					}

				}
			}

		}
		//insert notification

	}

	private function sendSMS($to, $message, $from) {
		// send sms
		$smsGateWay = new SmsGateWay();
		$smsGateWay->send($to, $message, $from);
	}

	public static function registeredActionLists() {
		$actionList = [
			'publish_post'=>'Publish Post',
			'user_register' => 'User Registration',
			'comment_post' => 'Wordpress Comment Post',
		];

		return apply_filters('lazycoder_integrated_action_list', $actionList);

	}

	private function contentPlaceholderReplace($string, $variables): string
	{
		if(empty($variables)){
			return nl2br($string);
		}
		$replacement = array_combine(
			array_map(function($k) { return '['.strtoupper($k).']'; }, array_keys($variables)),
			array_values($variables)
		);

		$returnString =  strtr($string, $replacement);

		return nl2br($returnString);
	}


}
new Integrations();

