# AspieSoft Auto Embed

Easily Embed Dynamic Youtube Videos Simply By Pasting The Url.

Note: This plugin depends on jQuery

This plugin does most of the work client side, and waits for the page to finish loading so embeds do not slow down your site.
Shortcodes are not needed (but are available), just add a clickable link to the youtube video, and the plugin will find all the youtube.com and youtu.be links, and replace them with an embed.

You know how sites like facebook and discord let you paste a youtube url, and an embed of the video shows up?
This plugin works kind of like that.

## Installation

1. Upload plugin to the /wp-content/plugins
2. Activate the plugin through the "Plugins" menu in WordPress
3. Enjoy

## Usage

### How do I embed a video/playlist/channel uploads?

Just put a clickable link to the video/playlist/channel, and the plugin will do the rest.

---

### How to use the shortcode

```WordPress
[auto-embed
  url="<url to video>"
  width="<optional width %> default: 100%"
  min-width="<optional minimum width px> default: 300px"
  max-width="<optional maximum width px> default: 2500px"
  ratio="<optional width:height ratio> default: 16:9"
  autoplay="<optional autoplay video> default: false"
  mute="<optional mute video> default: false"
  live="<optional embed live video> default: false"
  popular="<optional embed popular uploads playlist> default: false"
]
```

---

### How to embed a live stream

> Just add "?live" or "&live" to the url. The plugin checks query parameters of the url and makes changes as needed.

---

### How to change the width of an embed

> Add "?width=\<any valid css width (% recommended)>" to the url.

---

### How to change the ratio of an embed

> Add "?ratio=w:h" to the url.
> Replace "w" with the ratio width, and "h" with the ratio height.

---

### How to embed the popular uploads from my channel

> Add a link to your YouTube channel and add "?popular" or "&popular" to the url

---

### How to make the embed take up more width on mobile

> Add "?min-width=\<insert min width>&max-width=\<insert max width>" to the url
