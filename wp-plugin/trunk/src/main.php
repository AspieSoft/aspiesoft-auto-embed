<?php
/**
* @package AspieSoftAutoEmbed
*/

if(!defined('ABSPATH')){
  http_response_code(404);
  die('404 Not Found');
}

if(!class_exists('AspieSoft_AutoEmbed_Main')){

  class AspieSoft_AutoEmbed_Main {

    public $plugin;
    private static $func;
    private static $options;

    public function init($pluginData){
      // get plugin data and load common functions
      $this->plugin = $pluginData;
      require_once(plugin_dir_path(__FILE__).'../functions.php');
      global $aspieSoft_Functions_v1;
      self::$func = $aspieSoft_Functions_v1;
      self::$options = self::$func::options($this->plugin);
    }

    public function start(){
      // add shortcode
      add_shortcode('auto-embed', array($this, 'shortcode_YoutubeEmbed'));
      $altShortcode = self::$options['get']('altShortcode');
      if($altShortcode && $altShortcode !== null){ // add custom shortcode from settings, if it exists
        add_shortcode($altShortcode, array($this, 'shortcode_YoutubeEmbed'));
      }
    }


    // shortcode adds a url to the front page, and client side embed.js converts that url into an iframe
    // client side js waits for the page to load first, so embeds don't slow down the initial page load
    function shortcode_YoutubeEmbed($atts = ''){
      $attr = shortcode_atts(array(
        'url' => false, 'id' => false,
        'width' => false, 'size' => false,
        'min-width' => false, 'min-size' => false, 'minWidth' => false, 'minSize' => false,
        'max-width' => false, 'max-size' => false, 'maxWidth' => false, 'maxSize' => false,
        'ratio' => false,
        'auto' => false, 'autoplay' => false,
        'mute' => false,
        'live' => false,
        'popular' => false,
      ), $atts);

      foreach ($attr as $k => $v) {
        $attr[sanitize_key($k)] = esc_html(sanitize_text_field($v));
      }

      $url = $attr['url'];

      if(!$url && $attr['id']){
        $url = $attr['id'];
      }

      if(substr($url, 0, 7) === 'http://'){
        $url = 'https://'.substr($url, 8);
      }else if(substr($url, 0, 8) !== 'https://'){
        $url = 'https://youtu.be/'.$url;
      }

      $queryAttrs = array(
        $this->setQueryAttrValue($attr, 'width', array('width', 'size')),
        $this->setQueryAttrValue($attr, 'min-width', array('min-width', 'min-size', 'minWidth', 'minSize')),
        $this->setQueryAttrValue($attr, 'max-width', array('max-width', 'max-size', 'maxWidth', 'maxSize')),
        $this->setQueryAttrValue($attr, 'ratio', array('ratio')),
        $this->setQueryAttrBool($attr, 'auto', array('auto', 'autoplay')),
        $this->setQueryAttrBool($attr, 'mute', array('mute')),
        $this->setQueryAttrBool($attr, 'live', array('live')),
        $this->setQueryAttrBool($attr, 'popular', array('popular')),
      );
      $queryAttrs = array_filter($queryAttrs);

      $query = implode('&', $queryAttrs);

      if($query && strpos($url, '?') !== false){
        $url = $url.'&'.$query;
      }else if($query){
        $url = $url.'?'.$query;
      }

      return '<a href="'.esc_url($url).'"></a>';
    }


    function setQueryAttrValue($attr, $key, $values){
      foreach($values as $v){
        if($attr[$v]){
          settype($attr[$v], 'string');
          return $key.'='.urlencode($attr[$v]);
        }
      }
      return null;
    }

    function setQueryAttrBool($attr, $key, $values){
      foreach($values as $v){
        if($attr[$v] === true || $attr[$v] === 'true'){
          return $key.'=1';
        }else if($attr[$v] === false || $attr[$v] === 'false'){
          return $key.'=0';
        }
      }
      return null;
    }

  }

  $aspieSoft_AutoEmbed_Main = new AspieSoft_AutoEmbed_Main();

}
