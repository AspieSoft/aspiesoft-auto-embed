# Auto YouTube Embed

Easily Embed Dynamic Youtube Videos Simply By Pasting The Url.

Note: Requires jQuery (or AspieSoft jqAlt) To Run

This plugin does most of the work client side, and waits for the page to finish loading so embeds do not slow down your site.
Shortcodes are not needed (but are available), just add a clickable link to the youtube video, and the plugin will find all the youtube.com and youtu.be links, and replace them with an embed.

You know how sites like facebook and discord let you paste a youtube url, and an embed of the video shows up?
This plugin works kind of like that, while also working with playlists, live streams, channels, youtube search, etc.

YouTube has an organized url system, and this plugin recognizes it.
Every youtube playlist id starts with "PL", and youtube uses many other consistent url methods like this.

Now supports local pdf embeds.

## CDN Installation

```html
<!-- jquery dependency -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<!-- or alternatively jqAlt (by AspieSoft) - v0.0.16 (alpha) or later -->
<script src="https://cdn.jsdelivr.net/gh/AspieSoft/jqalt@0.0.16/jqalt/index.js"></script>

<script src="https://cdn.jsdelivr.net/gh/AspieSoft/aspiesoft-auto-embed@1.4.1/cdn/embed.js"></script>
```

---

## Wordpress Installation

1. Upload plugin to the /wp-content/plugins
2. Activate the plugin through the "Plugins" menu in WordPress
3. Enjoy

## Usage

### How do I embed a video/playlist/channel uploads?

Just put a clickable link to the video/playlist/channel, and the plugin will do the rest.

---

### How to use the wordpress shortcode

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
  search="optional embed playlist based on a youtube search (default: false)"
]
```

---

### How to set default options for cdn (not wordpress)

```javascript
// add this before the cdn script is loaded
AspieSoftAutoEmbedOptions = {
  'width': '100%',
  'min-width': '300px',
  'max-width': '2500px',
  'ratio': '16:9',
  'auto': '0',
  'mute': '0',
  'popular': '0',
  'live': '0',

  'ignoreAttrs': ['class', 'id', 'name', 'target'], // optional [array] list of attributes to ignore
  'ignoreClass': null, // optional [array] list of classes to ignore (reverses to required if ignoreAttrs includes "class")
  'requireAttrs': null, // optional [array] list of attributes to require


  yt: { // seperate options for youtube embeds
    'width': '100%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '16:9',
  },

  fb: { // seperate options for facebook page embeds
    'width': '100%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '16:9',
  },

  pdf: { // seperate options for pdf
    'width': '100%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '9:12',
  },

  img: { // seperate options for images
    'width': '100%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '16:9',
  },

};
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

### How to embed a playlist based on a youtube search

> Set the link to "https://youtu.be/<insert search query>?search=1"

---

### How to make the embed take up more width on mobile

> Add "?min-width=\<insert min width>&max-width=\<insert max width>" to the url

### How to embed a pdf

> Any url that points to the current domain and ends with ".pdf" will automatically be seen as a pdf
