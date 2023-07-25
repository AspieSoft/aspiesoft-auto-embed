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
      global $AspieSoft_Functions_v1_4;
      self::$func = $AspieSoft_Functions_v1_4;
      self::$options = self::$func::options($this->plugin);
    }

    public function start(){
      if(self::$options['get']('disableWpEmbed', false, true)){
        add_filter('tiny_mce_plugins', array($this, 'disableWpEmbedEditor'));
        add_action('init', array($this, 'disableWpEmbedInit'), 9999);
        add_action('wp_footer', array($this, 'disableWpEmbedFooter'));
      }

      // add shortcode
      add_shortcode('auto-embed', array($this, 'shortcode_Embed'));

      $altShortcode_default = self::$options['get']('altShortcode_default');
      if(isset($altShortcode_default)){
        add_shortcode($altShortcode_default, array($this, 'shortcode_Embed'));
      }

      $altShortcode = self::$options['get']('altShortcode');
      if(isset($altShortcode)){ // add custom shortcode from settings, if it exists
        add_shortcode($altShortcode, array($this, 'shortcode_YoutubeEmbed'));
      }
    }


    // shortcode adds a url to the front page, and client side embed.js converts that url into an iframe
    // client side js waits for the page to load first, so embeds don't slow down the initial page load
    function shortcode_Embed($atts = ''){
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
        'search' => false,
        'title' => false, 'name' => false,
        'description' => false, 'desc' => false,
        'start' => false,
        'end' => false,
      ), $atts);

      $attr = self::$func::cleanShortcodeAtts($attr);

      $url = $attr['url'];

      if(!$url && $attr['id']){
        $url = $attr['id'];
      }

      if(substr($url, 0, 7) === 'http://'){
        $url = 'https://'.substr($url, 8);
      }else if(substr($url, 0, 8) !== 'https://'){
        $url = get_home_url(null, $url);
      }

      return $this->setEmbedHtmlLink($url, $attr);
    }

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
        'search' => false,
        'title' => false, 'name' => false,
        'description' => false, 'desc' => false,
        'start' => false,
        'end' => false,
      ), $atts);

      $attr = self::$func::cleanShortcodeAtts($attr);

      $url = $attr['url'];
      if(!$url && $attr['id']){
        $url = $attr['id'];
      }

      if(substr($url, 0, 7) === 'http://'){
        $url = 'https://'.substr($url, 8);
      }else if(substr($url, 0, 8) !== 'https://'){
        $url = 'https://youtu.be/'.$url;
      }

      return $this->setEmbedHtmlLink($url, $attr);
    }


    function setEmbedHtmlLink($url, $attr){
      $queryAttrs = array(
        $this->setQueryAttrValue($attr, 'width', array('width', 'size')),
        $this->setQueryAttrValue($attr, 'min-width', array('min-width', 'min-size', 'minWidth', 'minSize')),
        $this->setQueryAttrValue($attr, 'max-width', array('max-width', 'max-size', 'maxWidth', 'maxSize')),
        $this->setQueryAttrValue($attr, 'ratio', array('ratio')),
        $this->setQueryAttrBool($attr, 'auto', array('auto', 'autoplay')),
        $this->setQueryAttrBool($attr, 'mute', array('mute')),
        $this->setQueryAttrBool($attr, 'live', array('live')),
        $this->setQueryAttrBool($attr, 'popular', array('popular')),
        $this->setQueryAttrBool($attr, 'search', array('search')),
        $this->setQueryAttrValue($attr, 'start', array('start')),
        $this->setQueryAttrValue($attr, 'end', array('end')),
      );
      $queryAttrs = array_filter($queryAttrs);

      $query = implode('&', $queryAttrs);

      if($query && strpos($url, '?') !== false){
        $url = $url.'&'.$query;
      }else if($query){
        $url = $url.'?'.$query;
      }

      $result = '<a href="'.esc_url($url).'"';
      if($attr['description'] || $attr['desc']){
        $result .= ' description="'.($attr['description'] || $attr['desc']).'"';
      }

      if(self::$options['get']('ytOnlyEmbedShortcode', false, true)){
        $result .= ' aspiesoft-auto-embed';
      }

      $result .= '>';
      if($attr['title'] || $attr['name']){
        $result .= ($attr['title'] || $attr['name']);
      }
      $result .= '</a>';

      return $result;
    }


    function setQueryAttrValue($attr, $key, $values){
      foreach($values as $v){
        if($attr[$v] && $attr[$v] !== false && $attr[$v] !== 'false'){
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

  $aspieSoft_AutoEmbed_Main = new AspieSoft_AutoEmbed_Main();

}
