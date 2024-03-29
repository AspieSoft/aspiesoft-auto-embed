<?php
/**
* @package AspieSoftAutoEmbed
*/
/*
Plugin Name: Auto Embed
Plugin URI: https://github.com/AspieSoft/aspiesoft-auto-embed
Description: Easily Embed Dynamic Lazy Loading Youtube Videos And More Simply By Pasting The Url.
Version: 1.5.8
Author: AspieSoft
Author URI: https://www.aspiesoft.com
License: GPLv2 or later
Text Domain: aspiesoft-auto-embed
*/

/*
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

/*
  This plugin is made from a template by AspieSoft: https://github.com/AspieSoft/wp-auto-embed
  The main source code that is modified from the template is in the "src" directory
*/


// In God We Trust


// most of this plugins front end runs client side (javascript) for a faster page load
// the src directory is where the main code for this plugin is located
// the files outside the src directory are built to dynamically run the code inside the src directory

if(!defined('ABSPATH')){
  http_response_code(404);
  die('404 Not Found');
}

if(!class_exists('AspieSoft_AutoEmbed')){

  class AspieSoft_AutoEmbed{

    public $githubURL = 'https://github.com/AspieSoft/aspiesoft-auto-embed';
    public $jsdelivrURL = 'https://cdn.jsdelivr.net/gh/AspieSoft/aspiesoft-auto-embed';

    public $pluginName;
    public $plugin;

    private static $func;
    private static $options;
    private static $optionsGlobal;

    private $useJSDelivr;

    function __construct(){
      $this->pluginName = plugin_basename(__FILE__);
    }

    function start(){
      // run main part of the plugin on frontend only
      // also helps with testing the plugin in development, because the backend won't crash if the main plugin file has php errors
      //todo: add visual of embed to frontend (may also add widget/button if possible)
      //todo: embed images

      if(!is_admin()){
        $this->loadPluginFile('main');
      }else if(is_admin()){
        $this->loadPluginFile('admin');
      }

    }


    private function loadPluginFile($name){
      $path = plugin_dir_path(__FILE__).'src/'.$name.'.php';
      if(file_exists($path)){
        $name = str_replace('-', '', ucwords($name, '-'));
        require_once($path);
        $pName = str_replace('-', '_', sanitize_html_class($this->plugin['pluginName']));
        if(class_exists('AspieSoft_'.$pName.'_'.$name)){
          ${'aspieSoft_'.$pName.'_'.$name}->init($this->plugin);
          ${'aspieSoft_'.$pName.'_'.$name}->start();
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
        'name' => preg_replace('/\s*\(.*?\)/', '', sanitize_text_field($pluginData['Name'])),
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
      global $AspieSoft_Functions_v1_4;
      self::$func = $AspieSoft_Functions_v1_4;

      self::$options = self::$func::options($this->plugin);
      self::$optionsGlobal = self::$func::options(array('setting' => 'global'));

      $jsdelivrOption = self::$options['get']('jsdelivr', 'default');
      if($jsdelivrOption === 'default'){
        $jsdelivrOption = self::$optionsGlobal['get']('jsdelivr', 'local');
      }
      if($jsdelivrOption === 'jsdelivr'){
        $this->useJSDelivr = true;
      }else{
        $this->useJSDelivr = false;
      }

      add_action('wp_enqueue_scripts', array($this, 'enqueue'));

      if(file_exists(plugin_dir_path(__FILE__).'src/settings.php')){
        add_action('admin_menu', array($this, 'add_admin_pages'));
        add_filter("plugin_action_links_$this->pluginName", array($this, 'settings_link'));
      }
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
      if(file_exists(plugin_dir_path(__FILE__).'src/settings.php')){
        $this->enableOptionsAutoload();
      }
      flush_rewrite_rules();
    }

    public function deactivate(){
      if(file_exists(plugin_dir_path(__FILE__).'src/settings.php')){
        $this->disableOptionsAutoload();
      }
      flush_rewrite_rules();
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

    function enqueue(){
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
            wp_enqueue_script($this->plugin['setting'].'_'.$asset, $this->pluginAssetPath($asset), array('jquery'), $this->plugin['version'], true);

            if($addInlineSettingsScript){
              $addInlineSettingsScript = false;
              $inlineSettings->addScript($this->plugin['setting'].'_'.$asset);
            }

          }else if(self::$func::endsWith($asset, '.css')){
            wp_enqueue_style($this->plugin['setting'].'_'.$asset, $this->pluginAssetPath($asset), array(), $this->plugin['version']);

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

    function pluginAssetPath($path){
      if(substr($path, 0, 1) !== '/'){
        $path = '/'.$path;
      }
      if($this->useJSDelivr){
        return $this->jsdelivrURL.'@'.$this->plugin['version'].'/wp-plugin/trunk/src/assets'.$path;
      }
      return plugins_url('/src/assets'.$path, __FILE__);
    }

  }

  $aspieSoft_AutoEmbed = new AspieSoft_AutoEmbed();
  $aspieSoft_AutoEmbed->register();

  register_activation_hook(__FILE__, array($aspieSoft_AutoEmbed, 'activate'));
  register_deactivation_hook(__FILE__, array($aspieSoft_AutoEmbed, 'deactivate'));

  add_action('init', array($aspieSoft_AutoEmbed, 'start'));

}
