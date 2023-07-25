=== Auto Embed ===
Contributors: AspieSoft
Tags: youtube, embed, auto, pdf, dynamic, simple, lazy-load, css
Requires at least: 3.0.1
Tested up to: 6.0.2
Stable tag: 1.5.8
Requires PHP: 5.2.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://buymeacoffee.aspiesoft.com

== Description ==
Easily Embed Dynamic Lazy Loading Youtube Videos And More Simply By Pasting The Url.

This plugin does most of the work client side, and waits for the page to finish loading so embeds do not slow down your site.
Shortcodes are not needed (but are available), just add a clickable link to the youtube video, and the plugin will find all the youtube.com and youtu.be links, and replace them with an embed.

You know how sites like discord let you paste a youtube url, and an embed of the video shows up?
This plugin works kind of like that, while also working with playlists, live streams, channels, youtube search, etc.

YouTube has an organized url system, and this plugin recognizes it.
Every youtube playlist id starts with "PL", and youtube uses many other consistent url methods like this.

Now supports local pdf embeds.
Now supports google doc to pdf embeds.

This plugin allowes you to optionally load assets from cdn.jsdelivr.net, to improve performance and load the assets from the github repository of this plugin. By default, the plugin loads assets locally, but you can change this to use jsdelivr in the plugin settings. When Enabled, The jsdelivr <a href="https://www.jsdelivr.com/terms/acceptable-use-policy-jsdelivr-net">Acceptable Use Policy</a> and <a href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net">Privacy Policy</a> Apply.

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

= 1.5.3 =
Added Google Doc To PDF Support

= 1.5.2 =
Improved Lazy Loading

= 1.5 =
Removed Facebook Support For Leagal Reasons

= 1.4.7 =
Now ignores links inside headers and footers

= 1.4.2 =
Added optional overriding of iframes and wp-embed

= 1.4 =
Added option to only embed shortcodes

= 1.2 =
Added support for embedding images
Now ignores links that include class, id, or name attributes (to allow button links to work as normal)

= 1.1 =
Added support for pdf files

= 1.0.3 =
Added option to load scripts and styles from jsdelivr.net (can improve performance)

= 1.0 =
Initial Commit

== Upgrade Notice ==

= 1.5.3 =
Added Google Doc To PDF Support

= 1.5.2 =
Improved Lazy Loading

= 1.5 =
Removed Facebook Support For Leagal Reasons

= 1.4.7 =
Now ignores links inside headers and footers

= 1.4.2 =
Added optional overriding of iframes and wp-embed

= 1.4 =
Added option to only embed shortcodes

= 1.2 =
Added support for embedding images
Now ignores links that include class, id, or name attributes (to allow button links to work as normal)

= 1.1 =
Added support for pdf files

= 1.0.3 =
Added option to load scripts and styles from jsdelivr.net (can improve performance)

= 1.0 =
Initial Commit
