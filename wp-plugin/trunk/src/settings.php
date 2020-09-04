<?php
/**
* @package AspieSoftAutoEmbed
*/

if(!defined('ABSPATH') || !current_user_can('manage_options')){
  http_response_code(404);
  die('404 Not Found');
}

if(!class_exists('AspieSoft_AutoEmbed_Settings')){

  class AspieSoft_AutoEmbed_Settings{

    // settings for admin page (client side assets/settings.js file reads this, and loads html inputs from it)
    public function getOptionList(){
      $optionList = array(
        'disableWpEmbed' => array('label' => 'Disable Wp-Embed', 'default' => 'false', 'form' => '[check][label][br]', 'type' => 'bool'),
        'altShortcode' => array('label' => 'Alternate Shortcode Name', 'default' => '', 'form' => '[label][text][br]'),
        'embedWidth' => array('label' => 'Width', 'default' => '100', 'form' => '[label][number{width:80px;}]%[br]', 'format' => '%s%'),
        'embedWidthMin' => array('label' => 'Min Width', 'default' => '300', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx'),
        'embedWidthMax' => array('label' => 'Max Width', 'default' => '2500', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx'),
        'embedRatio' => array('label' => 'Ratio', 'default' => array(16, 9), 'form' => '[label][number{width:60px;}]:[number{width:60px;}][br]', 'format' => '%s:%s'),
        'embedAuto' => array('label' => 'Auto Play', 'default' => 'false', 'form' => '[check][label]', 'type' => 'bool'),
        'embedMute' => array('label' => 'Mute', 'default' => 'false', 'form' => '[check][label][br]', 'type' => 'bool'),
        'ytEmbedChannelType' => array('label' => 'YouTube Channel Embed Type', 'default' => 'uploads', 'form' => '[label][select][br]', 'type' => 'select', 'options' => array(
          'uploads' => 'Recent Uploads',
          'popular' => 'Popular Uploads',
          'live' => 'Live Stream',
        )),
      );
      return $optionList;
    }

  }

  $aspieSoft_AutoEmbed_Settings = new AspieSoft_AutoEmbed_Settings();

}
