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

    private $localOptionList;

    private function addEmbedType($name, $default = null){
      $sizes = array(
        'width' => '100',
        'min-width' => '300',
        'max-width' => '2500',
        'ratio' => array(16, 9),
      );
      if(is_array($default)){
        if($default['width'] !== null){
          $sizes['width'] = $default['width'];
        }
        if($default['min-width'] !== null){
          $sizes['min-width'] = $default['min-width'];
        }
        if($default['max-width'] !== null){
          $sizes['max-width'] = $default['max-width'];
        }
        if($default['ratio'] !== null){
          $sizes['ratio'] = $default['ratio'];
        }
      }

      $this->localOptionList[$name.'Width'] = array('label' => 'Width', 'default' => '100', 'form' => '[br][hr][h2]Image[/h2][br][label][number{width:80px;}]%[br]', 'format' => '%s%');
      $this->localOptionList[$name . 'WidthMin'] = array('label' => 'Min Width', 'default' => '300', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx');
      $this->localOptionList[$name . 'WidthMax'] = array('label' => 'Max Width', 'default' => '2500', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx');
      $this->localOptionList[$name . 'Ratio'] = array('label' => 'Ratio', 'default' => array(16, 9), 'form' => '[label][number{width:60px;}]:[number{width:60px;}][br][br]', 'format' => '%s:%s');
    }

    // settings for admin page (client side assets/settings.js file reads this, and loads html inputs from it)
    public function getOptionList(){
      $this->localOptionList = array(
        'jsdelivr' => array('label' => 'Load Assets From', 'default' => 'default', 'form' => '[label][select][br]', 'type' => 'select', 'options' => array(
          'default' => 'Default',
          'local' => 'Your Site',
          'jsdelivr' => 'Github (jsdelivr.net) (recommended)',
        )),

        'disableWpEmbed' => array('label' => 'Disable Wp-Embed', 'default' => 'false', 'form' => '[check][label][br]', 'type' => 'bool'),
        'enableEditorAutoUrl' => array('label' => 'Automatically Make URLs Clickable In Page Editor', 'default' => 'false', 'form' => '[check][label][br][br]', 'type' => 'bool'),

        'altShortcode_default' => array('label' => 'Alternate Shortcode Name', 'default' => '', 'form' => '[label][text][br]'),
        'altShortcode' => array('label' => 'Alternate YouTube Shortcode Name', 'default' => '', 'form' => '[label][text][br][br]'),

        'embedWidth' => array('label' => 'Width', 'default' => '100', 'form' => '[br][hr][h2]YouTube[/h2][br][label][number{width:80px;}]%[br]', 'format' => '%s%'),
        'embedWidthMin' => array('label' => 'Min Width', 'default' => '300', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx'),
        'embedWidthMax' => array('label' => 'Max Width', 'default' => '2500', 'form' => '[label][number{width:80px;}]px[br]', 'format' => '%spx'),
        'embedRatio' => array('label' => 'Ratio', 'default' => array(16, 9), 'form' => '[label][number{width:60px;}]:[number{width:60px;}][br][br]', 'format' => '%s:%s'),

        'ytEmbedChannelType' => array('label' => 'Channel Embed Type', 'default' => 'uploads', 'form' => '[label][select][br]', 'type' => 'select', 'options' => array(
          'uploads' => 'Recent Uploads',
          'popular' => 'Popular Uploads',
          'live' => 'Live Stream',
        )),
        'embedAuto' => array('label' => 'Auto Play', 'default' => 'false', 'form' => '[check][label]', 'type' => 'bool'),
        'embedMute' => array('label' => 'Mute', 'default' => 'false', 'form' => '[check][label][br]', 'type' => 'bool'),

        'ytOnlyEmbedShortcode' => array('label' => 'Only Embed Shortcodes', 'default' => 'false', 'form' => '[check][label][br]', 'type' => 'bool'),

      );


      $this->addEmbedType('fb', array(
        'max-width' => '500',
        'ratio' => array(5, 8),
      ));


      $this->addEmbedType('pdf', array(
        'max-width' => '500',
        'ratio' => array(9, 12),
      ));

      $this->addEmbedType('img');


      return $this->localOptionList;
    }

    // global settings shared by all plugins
    public function getOptionListGlobal(){
      $optionList = array(
        'jsdelivr' => array('label' => 'Load Assets From', 'default' => 'local', 'form' => '[label][select][br][hr]', 'type' => 'select', 'options' => array(
          'local' => 'Your Site',
          'jsdelivr' => 'Github (jsdelivr.net) (recommended)',
        )),
      );
      return $optionList;
    }

  }

  $aspieSoft_AutoEmbed_Settings = new AspieSoft_AutoEmbed_Settings();

}
