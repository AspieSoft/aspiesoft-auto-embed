<?php
/**
* @package AspieSoftAutoEmbed
*/
/*
Plugin Name: AspieSoft Auto YouTube Embed
Plugin URI: https://www.wordpress.org/plugins/aspiesoft-auto-embed
Description: Easily Embed Dynamic Youtube Videos Simply By Pasting The Url.
Version: 1.0.2
Author: AspieSoft
Author URI: https://www.aspiesoft.com
License: GPLv2 or later
Text Domain: aspiesoft-auto-embed
*/

/*
Copyright (C) 2020 aspiesoftweb@gmail.com

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// In God We Trust


// most of this plugins front end runs client side (javascript) for a faster page load
// the src directory is where the main code for this plugin is located
// the files outside the src directory are built to dynamically run the code inside the src directory

// although this plugin is currently for youtube embeds, in the future, there may be new (optional) auto embeds added (example: pdf, png, ect.)

if(!defined('ABSPATH')){
  http_response_code(404);
  die('404 Not Found');
}

if(!class_exists('AspieSoft_AutoEmbed')){

  class AspieSoft_AutoEmbed{

    public $pluginName;
    public $plugin;

    private static $func;
    private static $options;

    function __construct(){
      $this->pluginName = plugin_basename(__FILE__);
    }

    function start(){
      // run main part of the plugin on frontend only
      // also helps with testing the plugin in development, because the backend won't crash if the main plugin file has php errors
      //todo: add visual of embed to frontend (may also add widget/button if possible)
      //todo: embed images
      if(!is_admin()){
        require_once(plugin_dir_path(__FILE__).'src/main.php');
        $pName = str_replace('-', '_', sanitize_html_class($this->plugin['pluginName']));
        if(class_exists('AspieSoft_'.$pName.'_Main')){
          ${'aspieSoft_'.$pName.'_Main'}->init($this->plugin);
          ${'aspieSoft_'.$pName.'_Main'}->start();
        }
      }
    }

    function register(){
      // ensure get_plugin_data function is loaded on frontend
      if(!function_exists('get_plugin_data')){
        require_once(ABSPATH.'wp-admin/includes/plugin.php');
      }

      // grab plugin data to use dynamic to the plugin
      $pluginData = get_plugin_data(__FILE__);
      $this->plugin = array(
        'name' => sanitize_text_field($pluginData['Name']),
        'setting' => str_replace('-', '', ucwords(sanitize_text_field($pluginData['TextDomain']), '-')),
        'slug' => sanitize_text_field($pluginData['TextDomain']),
        'version' => sanitize_text_field($pluginData['Version']),
        'author' => sanitize_text_field($pluginData['AuthorName']),
        'pluginName' => str_replace('-', '', ucwords(trim(str_replace(strtolower(sanitize_text_field($pluginData['AuthorName'])), '', strtolower(sanitize_text_field($pluginData['TextDomain']))), '-'), '-')),
      );

      if(is_admin()){
        // add plugin basename to php defined var, for admin template to use get_plugin_data on correct file
        define('PLUGIN_BASENAME_'.basename(plugin_dir_path(__FILE__)), $this->pluginName);
      }

      // get common functions.php file
      // multiple plugins can use same file in the future (without functions.php class being loaded twice)
      // version added so updates to functions can still occur without breaking other plugins
      require_once(plugin_dir_path(__FILE__).'functions.php');
      global $aspieSoft_Functions_v1;
      self::$func = $aspieSoft_Functions_v1;

      self::$options = self::$func::options($this->plugin);

      add_action('wp_enqueue_scripts', array($this, 'enqueue'));
      add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));
      add_action('admin_menu', array($this, 'add_admin_pages'));
      add_filter("plugin_action_links_$this->pluginName", array($this, 'settings_link'));

      if(self::$options['get']('disableWpEmbed', false, true)){
        add_filter('tiny_mce_plugins', array($this, 'disableWpEmbedEditor'));
        add_action('init', array($this, 'disableWpEmbedInit'), 9999);
        add_action('wp_footer', array($this, 'disableWpEmbedFooter'));
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

    function settings_link($links){
      array_unshift($links, '<a href="options-general.php?page='.$this->plugin['slug'].'">Settings</a>');
      return $links;
    }

    function add_admin_pages(){
      add_options_page($this->plugin['name'], $this->plugin['name'], 'manage_options', $this->plugin['slug'], array($this, 'admin_index'));
    }

    function admin_index(){
      require_once(plugin_dir_path(__FILE__).'templates/admin.php');
    }

    public function activate(){
      $this->enableOptionsAutoload();
      //flush_rewrite_rules();
    }

    public function deactivate(){
      $this->disableOptionsAutoload();
      //flush_rewrite_rules();
    }

    function enableOptionsAutoload(){
      // ensure register function ran
      if(!$this->plugin || !self::$func){
        $this->register();
      }

      // get option list from src directory
      $optionList = array();
      require_once(plugin_dir_path(__FILE__).'src/settings.php');
      $pName = str_replace('-', '_', sanitize_html_class($this->plugin['pluginName']));
      if(class_exists('AspieSoft_'.$pName.'_Settings')){
        $optionList = ${'aspieSoft_'.$pName.'_Settings'}->getOptionList();
      }
      $optionList = self::$options['getList']($optionList);

      self::$options['setList']($optionList, false, true, true);
      self::$options['setList']($optionList, true, true, true);
    }

    function disableOptionsAutoload(){
      // when looking at my test sites database, I noticed an autoload feature on options, and looked it up
      // it seems autoload can slow down sites, and can be disabled if its not always used
      // if the plugin disables autoload for this plugins options, on deactivation, then their still saved, but not loaded when unneeded
      // then reactivating autoload (with enableOptionsAutoload function) on activation because options are being used again

      // ensure register function ran
      if(!$this->plugin || !self::$func){
        $this->register();
      }

      // get option list from src directory
      $optionList = array();
      require_once(plugin_dir_path(__FILE__).'src/settings.php');
      $pName = str_replace('-', '_', sanitize_html_class($this->plugin['pluginName']));
      if(class_exists('AspieSoft_'.$pName.'_Settings')){
        $optionList = ${'aspieSoft_'.$pName.'_Settings'}->getOptionList();
      }
      $optionList = self::$options['getList']($optionList);

      self::$options['setList']($optionList, false, false, true);
      self::$options['setList']($optionList, true, false, true);
    }

    function admin_enqueue(){
      if(is_admin() && self::$options['get']('enableEditorAutoUrl', false, true)){
        wp_enqueue_script('AspieSoft_Editor_AutoUrl', plugins_url('/assets/editor-auto-url.js', __FILE__), array('jquery'), '1.0', true);
      }
    }

    function enqueue(){
      //todo: try grabbing from github if online (check if wordpress allows it first)

      // dynamically enqueue all js and css assets from src/assets

      $assetsDir = plugin_dir_path(__FILE__).'src/assets/';
      if(file_exists($assetsDir) && is_dir($assetsDir)){

        $pName = str_replace('-', '_', sanitize_html_class($this->plugin['pluginName']));

        // check if inline settings scripts or styles file and functions exist
        // 0settings.php is used to load client side settings that should be sent (this is separate from the settings.php file outside the assets dir)
        $addInlineSettingsScript = false; $addInlineSettingsStyle = false;
        $inlineSettings = false;
        $settingsDir = plugin_dir_path(__FILE__).'src/assets/0settings.php'; // file named 0settings so it will be indexed at the top of the src/assets dir
        if(file_exists($settingsDir) && !is_dir($settingsDir)){
          require_once($settingsDir);
          if(class_exists('AspieSoft_'.$pName.'_AssetSettings')){
            $inlineSettings = ${'aspieSoft_'.$pName.'_AssetSettings'};
            $inlineSettings->init($this->plugin);
            if(is_callable(array($inlineSettings, 'addScript'))){
              $addInlineSettingsScript = true;
            }
            if(is_callable(array($inlineSettings, 'addStyle'))){
              $addInlineSettingsStyle = true;
            }
          }
        }

        // enqueue assets list
        $assets = scandir($assetsDir);
        foreach($assets as $asset){
          if(self::$func::endsWith($asset, '.js')){
            wp_enqueue_script($this->plugin['setting'].'_'.$asset, plugins_url('/src/assets/'.$asset, __FILE__), array('jquery'), $this->plugin['version'], true);

            if($addInlineSettingsScript){
              $addInlineSettingsScript = false;
              $inlineSettings->addScript($this->plugin['setting'].'_'.$asset);
            }

          }else if(self::$func::endsWith($asset, '.css')){
            wp_enqueue_style($this->plugin['setting'].'_'.$asset, plugins_url('/src/assets/'.$asset, __FILE__), array(), $this->plugin['version']);

            if($addInlineSettingsStyle){
              $addInlineSettingsStyle = $this->plugin['setting'].'_'.$asset;
            }

          }

        }
        if($addInlineSettingsStyle && $addInlineSettingsStyle !== true){
          $inlineSettings->addStyle($addInlineSettingsStyle);
        }

      }

    }

  }

  $aspieSoft_AutoEmbed = new AspieSoft_AutoEmbed();
  $aspieSoft_AutoEmbed->register();

  register_activation_hook(__FILE__, array($aspieSoft_AutoEmbed, 'activate'));
  register_deactivation_hook(__FILE__, array($aspieSoft_AutoEmbed, 'deactivate'));

  add_action('init', array($aspieSoft_AutoEmbed, 'start'));

}
