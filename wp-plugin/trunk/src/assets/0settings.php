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

    private $opts;

    public function init($pluginData){
      $this->plugin = $pluginData;
      require_once(plugin_dir_path(__FILE__).'../../functions.php');
      global $aspieSoft_Functions_v1_3;
      self::$func = $aspieSoft_Functions_v1_3;
    }


    private function addEmbedType($name, $options){
      $this->opts['fb'] = array(
        'width' => $options['get']($name.'Width'),
        'min-width' => $options['get']($name.'WidthMin'),
        'max-width' => $options['get']($name.'WidthMax'),
        'ratio' => $options['get']($name.'Ratio'),
      );
    }


    public function addScript($scriptBefore){
      // send proper settings to client

      $options = self::$func::options($this->plugin);

      $this->opts = array(
        'width' => $options['get']('embedWidth'),
        'min-width' => $options['get']('embedWidthMin'),
        'max-width' => $options['get']('embedWidthMax'),
        'ratio' => $options['get']('embedRatio'),
        'auto' => (boolval($options['get']('embedAuto', false, true)) ? '1' : null),
        'mute' => (boolval($options['get']('embedMute', false, true)) ? '1' : null),
      );

      $ytChannelEmbedType = $options['get']('ytEmbedChannelType');
      if($ytChannelEmbedType === 'popular'){
        $this->opts['popular'] = '1';
      }else if($ytChannelEmbedType === 'live'){
        $this->opts['live'] = '1';
      }

      // only embed shortcode
      if($options['get']('ytOnlyEmbedShortcode', false, true)){
        $this->opts['requireAttrs'] = array('yt-auto-embed');
      }

      if($options['get']('overrideIframes', false, true)){
        $this->opts['modifyClass'] = array('nv-iframe-embed');
        $this->opts['modifyTag'] = array('iframe');
      }


      $this->addEmbedType('fb', $options);

      $this->addEmbedType('pdf', $options);
      $this->addEmbedType('img', $options);


      $resOpts = wp_json_encode($this->opts);
      wp_add_inline_script($scriptBefore, ";var AspieSoftAutoEmbedOptions = $resOpts;", 'before');
    }

    // addStyle can be used in the future to enqueue inline styles
    /*public function addStyle($scriptBefore){
      
    }*/

  }
  
  $aspieSoft_AutoEmbed_AssetSettings = new AspieSoft_AutoEmbed_AssetSettings();

}
