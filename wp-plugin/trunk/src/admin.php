<?php
/**
* @package AspieSoftAutoEmbed
*/

if(!defined('ABSPATH')){
  http_response_code(404);
  die('404 Not Found');
}

if(!class_exists('AspieSoft_AutoEmbed_Admin')){

  class AspieSoft_AutoEmbed_Admin {

    public $plugin;
    private static $func;
    private static $options;
    private static $optionsGlobal;

    public function init($pluginData){
      // get plugin data and load common functions
      $this->plugin = $pluginData;
      require_once(plugin_dir_path(__FILE__).'../functions.php');
      global $AspieSoft_Functions_v1_4;
      self::$func = $AspieSoft_Functions_v1_4;
      self::$options = self::$func::options($this->plugin);
      self::$optionsGlobal = self::$func::options(array('setting' => 'global'));
    }

    public function start(){
      add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));

      if(self::$options['get']('disableWpEmbed', false, true)){
        add_filter('tiny_mce_plugins', array($this, 'disableWpEmbedEditor'));
        add_action('init', array($this, 'disableWpEmbedInit'), 9999);
        add_action('wp_footer', array($this, 'disableWpEmbedFooter'));
      }
    }


    function admin_enqueue(){
      if(is_admin() && self::$options['get']('enableEditorAutoUrl', false, true)){
        wp_enqueue_script('AspieSoft_Editor_AutoUrl', plugins_url('/assets/editor-auto-url.js', __FILE__), array('jquery'), '1.0', true);
      }
    }


    function disableWpEmbedEditor($plugins){
      return array_diff($plugins, array('wpview'));
    }

    function disableWpEmbedInit(){
      remove_action('rest_api_init', 'wp_oembed_register_route');
      remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);
      remove_action('wp_head', 'wp_oembed_add_discovery_links');
      remove_action('wp_head', 'wp_oembed_add_host_js');
    }

    function disableWpEmbedFooter(){
      wp_dequeue_script('wp-embed');
      remove_action('wp_enqueue_scripts', 'wp-embed', 9999);
      remove_filter('the_content', array($GLOBALS['wp_embed'], 'autoembed'), 8);
    }

  }

  $aspieSoft_AutoEmbed_Admin = new AspieSoft_AutoEmbed_Admin();

}
