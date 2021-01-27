=== Auto YouTube Embed ===
Contributors: AspieSoft
Tags: youtube, embed, auto, pdf, dynamic, simple, lazy-load, css
Requires at least: 3.0.1
Tested up to: 5.6
Stable tag: 5.6
Requires PHP: 5.2.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://buymeacoffee.aspiesoft.com

== Description ==
Easily Embed Dynamic Lazy Loading Youtube Videos Simply By Pasting The Url.

This plugin does most of the work client side, and waits for the page to finish loading so embeds do not slow down your site.
Shortcodes are not needed (but are available), just add a clickable link to the youtube video, and the plugin will find all the youtube.com and youtu.be links, and replace them with an embed.

You know how sites like facebook and discord let you paste a youtube url, and an embed of the video shows up?
This plugin works kind of like that.

Now supports local pdf embeds.

== Installation ==

1. Upload plugin to the /wp-content/plugins
2. Activate the plugin through the "Plugins" menu in WordPress
3. Enjoy

== Frequently Asked Questions ==

= How do I embed a video/playlist/channel uploads? =
Just put a clickable link to the video/playlist/channel, and the plugin will do the rest.

= How do I use the shortcode? =
[auto-embed
  url="url to video"
  width="optional width in % (default: 100%)"
  min-width="optional minimum width in px (default: 300px)"
  max-width="optional maximum width in px (default: 2500px)"
  ratio="optional width:height ratio (default: 16:9)"
  autoplay="optional autoplay video (default: false)"
  mute="optional mute video (default: false)"
  live="optional embed live video (default: false)"
  popular="optional embed popular uploads playlist (default: false)"
  search="optional embed playlist based on a youtube search (default: false)"
]

= How do I embed a live stream? =
Just add "?live" or "&live" to the url. The plugin checks query parameters of the url and makes changes as needed.

= How do I change the width of an embed? =
Add "?width=any valid css width" to the url.

= How do I change the ratio of an embed? =
Add "?ratio=w:h" to the url.
Replace "w" with the ratio width, and "h" with the ratio height.

= How do I embed the popular uploads from my channel? =
Add a link to your YouTube channel and add "?popular" or "&popular" to the url

= How do I embed a playlist based on a youtube search? =
Set the link to "https://youtu.be/(insert search query)?search=1"

= How do I make the embed take up more width on mobile? =
Add "?min-width=(insert min width)&max-width=(insert max width)" to the url

= How do I embed a pdf? =
Any url that points to the current domain and ends with ".pdf" will automatically be seen as a pdf

== Changelog ==

= 1.1 =
Added support for pdf files

= 1.0.3 =
Added option to load scripts and styles from jsdelivr.net (can improve performance)

= 1.0 =
Initial Commit

== Upgrade Notice ==

= 1.1 =
Added support for pdf files

= 1.0.3 =
Added option to load scripts and styles from jsdelivr.net (can improve performance)

= 1.0 =
Initial Commit
