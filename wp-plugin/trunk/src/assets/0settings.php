<?php
/**
* @package AspieSoftAutoEmbed
*/

if(!defined('ABSPATH')){
  http_response_code(404);
  die('404 Not Found');
}

// file named 0settings so it will be indexed at the top of the src/assets dir

if(!class_exists('AspieSoft_AutoEmbed_AssetSettings')){

  class AspieSoft_AutoEmbed_AssetSettings{

    public $plugin;
    public static $func;

    public function init($pluginData){
      $this->plugin = $pluginData;
      require_once(plugin_dir_path(__FILE__).'../../functions.php');
      global $aspieSoft_Functions_v1_3;
      self::$func = $aspieSoft_Functions_v1_3;
    }

    public function addScript($scriptBefore){
      // send proper settings to client

      $options = self::$func::options($this->plugin);

      $opts = array(
        'width' => $options['get']('embedWidth'),
        'min-width' => $options['get']('embedWidthMin'),
        'max-width' => $options['get']('embedWidthMax'),
        'ratio' => $options['get']('embedRatio'),
        'auto' => (boolval($options['get']('embedAuto', false, true)) ? '1' : null),
        'mute' => (boolval($options['get']('embedMute', false, true)) ? '1' : null),


        'pdf' => array(
          'width' => $options['get']('pdfWidth'),
          'min-width' => $options['get']('pdfWidthMin'),
          'max-width' => $options['get']('pdfWidthMax'),
          'ratio' => $options['get']('pdfRatio'),
        ),

        'img' => array(
          'width' => $options['get']('imgWidth'),
          'min-width' => $options['get']('imgWidthMin'),
          'max-width' => $options['get']('imgWidthMax'),
          'ratio' => $options['get']('imgRatio'),
        ),

      );

      $ytChannelEmbedType = $options['get']('ytEmbedChannelType');
      if($ytChannelEmbedType === 'popular'){
        $opts['popular'] = '1';
      }else if($ytChannelEmbedType === 'live'){
        $opts['live'] = '1';
      }

      $opts = wp_json_encode($opts);
      wp_add_inline_script($scriptBefore, ";var AspieSoftAutoEmbedOptions = $opts;", 'before');
    }

    // addStyle can be used in the future to enqueue inline styles
    /*public function addStyle($scriptBefore){
      
    }*/

  }
  
  $aspieSoft_AutoEmbed_AssetSettings = new AspieSoft_AutoEmbed_AssetSettings();

}
