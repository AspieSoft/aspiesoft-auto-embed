/*
The MIT License

Copyright (c) 2020 aspiesoftweb@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

; (function() {

  let isJquery = true;

  const $ = (function() {
    if(typeof jQuery !== 'undefined') {
      isJquery = true;
      return jQuery;
    } else if(typeof jqAlt !== 'undefined') {
      return jqAlt.jquery();
    }
    console.error('jQuery or jqAlt were not loaded!');
    return undefined;
  })();


  $('head').append('<link rel="dns-prefetch" href="https://www.youtube.com"/>');


  let defaultEmbedOptions = {
    'width': '90%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '16:9',
    'auto': '0',
    'mute': '0',
    'popular': '0',
    'live': '0',
    'start': null,
    'end': null,

    'ignoreAttrs': ['class', 'id', 'name', 'target'], // optional [array] list of attributes to ignore
    'ignoreClass': null, // optional [array] list of classes to ignore (reverses to required if ignoreAttrs includes "class")
    'requireAttrs': null, // optional [array] list of attributes to require
    'ignoreHeaders': true, // ignore embedable links if inside a header or footer

    'modifyClass': null, // optional [array] list of classes to override as an aspiesoft embed
    'modifyTag': null, // optional [array] list of tags to override as an aspiesoft embed

    'includeDomains': null, // optional [array] list of domains to include (if not already supported) without smart methods to find the proper embedable url from that domain
    // includeDomains will use the localhost method for embeds first, or fallback to a regular embed

    // exactType default settings (null to use above defaults)
    yt: null, // {width, min-width, max-width, ratio}
    pdf: {'width': '100%', 'min-width': '300px', 'max-width': '2500px', 'ratio': '9:12'},
    img: null, // {width, min-width, max-width, ratio}
  };


  const embedUrlHandler = {
    'localhost': function(page, query, domain) {
      if(!page || page.trim() === '') {
        return;
      }

      let url = window.location.protocol + '//' + domain + '/' + page;
      let key = Object.keys(query);
      for(let i = 0; i < key.length; i++) {
        if(i === 0) {
          url += '?';
        } else {
          url += '&';
        }
        url += `${encodeURIComponent(key[i])}=${encodeURIComponent(query[key[i]])}`;
      }

      if(page.endsWith('.pdf')) {
        embedType = 'embed';
        exactType = 'pdf';
        return {url, embedType, exactType};
      } else if(page.match(/\.(png|jpe?g|gif|svg|webp|ico|bmp|img|heif|tiff?|jfif)$/i)) {
        embedType = 'image';
        exactType = 'img';
        return {url, embedType, exactType};
      }
    },

    'simple-embed': function(page, query, domain) {
      let url = window.location.protocol + '//' + domain + '/' + page;

      let key = Object.keys(query);
      for(let i = 0; i < key.length; i++) {
        if(i === 0) {
          url += '?';
        } else {
          url += '&';
        }
        url += `${encodeURIComponent(key[i])}=${encodeURIComponent(query[key[i]])}`;
      }

      embedType = 'embed';
      exactType = 'default';
      return {url, embedType, exactType};
    },


    'youtu.be': function(page, query) {
      embedType = 'video';
      exactType = 'yt';
      page = page.replace(/^(.*?)\/.*/, '$1');

      if(page.startsWith('UC') || page.startsWith('UU') || page.startsWith('PU')) {
        if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))) {
          page = page.replace('UC', 'PU');
        } else if((query && query.live && query.live !== '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))) {
          url = 'https://www.youtube.com/embed/live_stream?channel=' + page.replace('UC', 'UU');
          return {url, embedType, exactType};
        } else {
          page = page.replace('UC', 'UU');
        }
        url = 'https://www.youtube.com/embed?listType=playlist&list=' + page + '&t=0';
        return {url, embedType, exactType};
      } else if(page.startsWith('PL')) {
        url = 'https://www.youtube.com/embed?listType=playlist&list=' + page + '&t=0';
        return {url, embedType, exactType};
      } else if(query.search && query.search !== '0') {
        url = 'https://www.youtube.com/embed/?listType=search&list=' + page + '&t=0';
        return {url, embedType, exactType};
      } else {
        url = 'https://www.youtube.com/embed/' + page + '?t=0';
        return {url, embedType, exactType};
      }
    },

    'youtube.com': function(page, query) {
      embedType = 'video';
      exactType = 'yt';

      if(page.startsWith('channel/')) {
        page = page.replace('channel/', '');
        if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))) {
          page = page.replace('UC', 'PU');
        } else if((query && query.live && query.live !== '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))) {
          url = 'https://www.youtube.com/embed/live_stream?channel=' + page.replace('UC', 'UU');
          return {url, embedType, exactType};
        } else if(query.search && query.search !== '0') {
          url = 'https://www.youtube.com/embed/?listType=search&list=' + page + '&t=0';
          return {url, embedType, exactType};
        } else {
          page = page.replace('UC', 'UU');
        }
        url = 'https://www.youtube.com/embed?listType=playlist&list=' + page + '&t=0';
        return {url, embedType, exactType};
      } else if(page.startsWith('c/')) {
        page = page.replace('c/', '');
        url = 'https://www.youtube.com/embed?listType=playlist&list=' + page + '&t=0';
        return {url, embedType, exactType};
      } else if(page.startsWith('playlist')) {
        if(!query) {
          url = false;
          return;
        }
        let pl = query.list;
        url = 'https://www.youtube.com/embed?listType=playlist&list=' + pl + '&t=0';
        return {url, embedType, exactType};
      } else if(page.startsWith('watch')) {
        if(!query) {
          url = false;
          return;
        }
        let v = query.v;
        url = 'https://www.youtube.com/embed/' + v + '?t=0';
        return {url, embedType, exactType};
      } else if(page.startsWith('embed/') && typeof embedUrlHandler['youtu.be'] === 'function') {
        return embedUrlHandler['youtu.be'](page.replace('embed/', ''), query);
      }
    },

    'docs.google.com': function(page) {
      page = page.replace(/^document\/d\/([\w_-]+)(?:\/.*|)$/, '$1');

      return {
        url: 'https://gdoc.aspiesoft.com/doc/' + page + '.pdf?key=cc980d309adf012c6d114cbe1eed34bd73448d35facf64965f8324b1bcfd517f',
        embedType: 'embed',
        exactType: 'pdf',
      };
    },

    'gdoc.aspiesoft.com': function(page) {
      page = page.replace(/^doc\//, '').replace(/\.pdf$/, '');

      return {
        url: 'https://gdoc.aspiesoft.com/doc/' + page + '.pdf?key=cc980d309adf012c6d114cbe1eed34bd73448d35facf64965f8324b1bcfd517f',
        embedType: 'embed',
        exactType: 'pdf',
      };
    },
  };


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function mergeObj(obj1, obj2) {
    let objI = false, objSize;
    if(Array.isArray(obj1)) {
      objSize = obj1.length;
    } else {
      objI = Object.keys(obj1);
      objSize = objI.length;
    }

    for(let i = 0; i < objSize; i++) {
      let key = i;
      if(objI) {key = objI[i];}
      if(obj1[key] != null && obj2[key] != null && (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') || (Array.isArray(obj1[key]) && Array.isArray(obj2[key]))) {
        obj1[key] = mergeObj(obj1[key], obj2[key]);
      } else if(obj2[key] != null) {
        obj1[key] = obj2[key];
      }
    }

    return obj1;
  }


  if(typeof AspieSoftAutoEmbedOptions === 'object') {
    defaultEmbedOptions = mergeObj(defaultEmbedOptions, AspieSoftAutoEmbedOptions);
  }

  $(document).ready(function() {
    let cSel = undefined;
    let tSel = undefined;
    if(Array.isArray(defaultEmbedOptions.modifyClass)) {
      cSel = defaultEmbedOptions.modifyClass.map(c => '.' + c).join(', ');
    }
    if(Array.isArray(defaultEmbedOptions.modifyTag)) {
      tSel = defaultEmbedOptions.modifyTag.join(', ');
    }


    embedLinks(cSel, tSel);

    if(cSel || tSel) {
      setInterval(function() {embedLinks(cSel, tSel)}, 500);
    } else {
      setInterval(embedLinks, 500);
    }

    setInterval(fixEmbedRatio, 100);
  });


  function embedLinks(classSel, tagSel) {
    let sel = 'a'
    if(classSel) {
      sel += ', ' + classSel;
    }
    if(tagSel) {
      sel += ', ' + tagSel;
    }
    $(sel).each(async function() {
      if(window.location.search.toString().match(/[?&]fl_builder/)){
        return;
      }

      let elm = this;
      if(elm.hasAttribute('auto-embed-checked') || elm.hasAttribute('ignore') || elm.classList.contains('aspiesoft-embed') || elm.classList.contains('aspiesoft-embed-content')) {
        return;
      } else {
        elm.setAttribute('auto-embed-checked', '');
      }


      if(defaultEmbedOptions.ignoreHeaders) {
        // ignore header and footer
        if(isJquery) {
          if($(elm).parents('header').length || $(elm).parents('footer').length) {
            return;
          }
        } else {
          if($(elm).parent('header').length || $(elm).parent('footer').length) {
            return;
          }
        }
      }


      let isClassSel = false;
      if(classSel && elm.classList.length && Array.isArray(defaultEmbedOptions.modifyClass)) {
        for(let i = 0; i < defaultEmbedOptions.modifyClass.length; i++) {
          if(elm.classList.contains(defaultEmbedOptions.modifyClass[i])) {
            isClassSel = true;
            break;
          }
        }
      }


      if(Array.isArray(defaultEmbedOptions.requireAttrs)) {
        for(let i in defaultEmbedOptions.requireAttrs) {
          if(!elm.hasAttribute(defaultEmbedOptions.requireAttrs[i])) {
            return;
          }
        }
      }

      if(Array.isArray(defaultEmbedOptions.ignoreAttrs)) {
        for(let i in defaultEmbedOptions.ignoreAttrs) {
          if(!isClassSel && defaultEmbedOptions.ignoreAttrs[i] === 'class') {
            if(elm.classList.length) {
              if(Array.isArray(defaultEmbedOptions.ignoreClass)) {
                for(let c in defaultEmbedOptions.ignoreClass) {
                  if(!elm.classList.contains(defaultEmbedOptions.ignoreClass[c])) {
                    return;
                  }
                }
              } else {
                return;
              }
            }
          } else if(defaultEmbedOptions.ignoreAttrs[i] !== 'class' && elm.hasAttribute(defaultEmbedOptions.ignoreAttrs[i])) {
            return;
          }
        }
      }

      if(!isClassSel && Array.isArray(defaultEmbedOptions.ignoreClass) && (!Array.isArray(defaultEmbedOptions.ignoreAttrs) || !defaultEmbedOptions.ignoreAttrs.includes('class'))) {
        for(let c in defaultEmbedOptions.ignoreClass) {
          if(elm.classList.contains(defaultEmbedOptions.ignoreClass[c])) {
            return;
          }
        }
      }


      let url = $(elm).attr('href');
      if(!url || url.trim() === '') {
        url = $(elm).attr('src');
      }


      let inClassElm = undefined;
      if(!url || url.trim() === '' && isClassSel) {
        inClassElm = $('a, ' + tagSel, elm);
        url = inClassElm.attr('href');
        if(!url || url.trim() === '') {
          url = inClassElm.attr('src');
        }
      }

      if(!url || url.trim() === '') {
        return;
      }


      let title = $(elm).text();
      if(inClassElm || !title || title.trim() === '' || title === url) {
        title = $(elm).attr('title');
        if(!title || title.trim() === '') {
          title = undefined;
        }
      }

      if(!title && inClassElm) {
        title = inClassElm.text();
        if(!title || title.trim() === '' || title === url) {
          title = inClassElm.attr('title');
          if(!title || title.trim() === '') {
            title = undefined;
          }
        }
      }

      let description = $(elm).attr('description');
      if(!description || description.trim() === '') {
        description = $(elm).attr('desc');
        if(!description || description.trim() === '') {
          description = undefined;
        }
      }

      if(!description && inClassElm) {
        let tElm = $('a, ' + tagSel, elm);
        description = tElm.attr('desc');
        if(!description || description.trim() === '') {
          description = undefined;
        }
      }


      url = decodeURIComponent(url);

      data = getEmbedUrl(url);
      if(!data) {
        return;
      }

      let attrs = '';
      let styles = ' style="opacity:0;height:0;';
      let youtubeQueryAttrs = '&rel=0&autohide=1&showinfo=0&feature=oembed';
      if(!data.attrs) {
        data.attrs = {...defaultEmbedOptions};
      } else {
        data.attrs = mergeObj({...defaultEmbedOptions}, data.attrs);
      }

      if(!data.attrs.width && data.attrs.size) {
        data.attrs.width = data.attrs.size;
      }
      if(!data.attrs['min-width'] && data.attrs['min-size']) {
        data.attrs['min-width'] = data.attrs['min-size'];
      }
      if(!data.attrs['max-width'] && data.attrs['max-size']) {
        data.attrs['max-width'] = data.attrs['max-size'];
      }
      if(!data.attrs['auto'] && data.attrs['autoplay']) {
        data.attrs['auto'] = data.attrs['autoplay'];
      }

      if(data.attrs[data.exactType]?.width) {
        let width = data.attrs[data.exactType].width;
        if(!width.match(/[0-9]%$/)) {
          width += '%';
        }
        styles += 'width:' + width.replace(/\\?"/g, '\\"') + ';';
      } else if(data.attrs.width) {
        let width = data.attrs.width;
        if(!width.match(/[0-9]%$/)) {
          width += '%';
        }
        styles += 'width:' + width.replace(/\\?"/g, '\\"') + ';';
      }

      if(data.attrs[data.exactType]?.['min-width']) {
        let width = data.attrs[data.exactType]['min-width'];
        if(!width.match(/[0-9]px$/)) {
          width += 'px';
        }
        styles += 'min-width:' + width.replace(/\\?"/g, '\\"') + ';';
      } else if(data.attrs['min-width']) {
        let width = data.attrs['min-width'];
        if(!width.match(/[0-9]px$/)) {
          width += 'px';
        }
        styles += 'min-width:' + width.replace(/\\?"/g, '\\"') + ';';
      }

      if(data.attrs[data.exactType]?.['max-width']) {
        let width = data.attrs[data.exactType]['max-width'];
        if(!width.match(/[0-9]px$/)) {
          width += 'px';
        }
        styles += 'max-width:' + width.replace(/\\?"/g, '\\"') + ';';
      } else if(data.attrs['max-width']) {
        let width = data.attrs['max-width'];
        if(!width.match(/[0-9]px$/)) {
          width += 'px';
        }
        styles += 'max-width:' + width.replace(/\\?"/g, '\\"') + ';';
      }

      if(data.attrs[data.exactType]?.ratio) {
        attrs += ' ratio="' + data.attrs[data.exactType]?.ratio.replace(/\\?"/g, '\\"') + '"';
      } else if(data.attrs.ratio) {
        attrs += ' ratio="' + data.attrs.ratio.replace(/\\?"/g, '\\"') + '"';
      }


      if(data.embedType === 'video' && data.attrs.auto && data.attrs.auto !== '0') {
        youtubeQueryAttrs += '&auto=1';
        if(data.attrs.mute && data.attrs.mute !== '0') {
          youtubeQueryAttrs += '&mute=1';
        } else {
          youtubeQueryAttrs += '&mute=0';
        }
      } else if(data.embedType === 'video' && data.attrs.mute && data.attrs.mute !== '0') {
        youtubeQueryAttrs += '&mute=1';
      }

      if(data.attrs['start']) {
        if(data.attrs['start'].includes(':')) {
          let time = data.attrs['start'].split(':');
          youtubeQueryAttrs += '&start=' + ((Number(time[0]) * 60) + Number(time[1]));
        } else if(data.attrs['start'].endsWith('s')) {
          youtubeQueryAttrs += '&start=' + data.attrs['start'].replace(/s$/, '');
        } else {
          youtubeQueryAttrs += '&start=' + data.attrs['start'];
        }
      }
      if(data.attrs['end']) {
        if(data.attrs['end'].includes(':')) {
          let time = data.attrs['end'].split(':');
          youtubeQueryAttrs += '&end=' + ((Number(time[0]) * 60) + Number(time[1]));
        } else if(!data.attrs['end'].endsWith('s')) {
          youtubeQueryAttrs += '&end=' + data.attrs['end'].replace(/s$/, '');
        } else {
          youtubeQueryAttrs += '&end=' + data.attrs['end'];
        }
        //youtubeQueryAttrs += '&version=3';
        data.url.replace(/\?t=0&/, '?version=3&').replace(/\?(.*?)&t=0&/, '$1&version=3&');
      }

      if(!title && (data.attrs.title || data.attrs.name)) {
        title = data.attrs.title || data.attrs.name;
      }

      if(!description && (data.attrs.description || data.attrs.desc)) {
        description = data.attrs.description || data.attrs.desc;
      }

      styles += '"';

      let iframe = undefined;
      if(data.embedType === 'video') {
        data.url = data.url.replace(/\\?"/g, '\\"') + youtubeQueryAttrs;
        iframe = $('<div class="aspiesoft-embed" doing-init-animation' + attrs + styles + '><iframe class="aspiesoft-embed-content" style="opacity: 0;" lazy-src="' + data.url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>').insertAfter(elm);
      } else if(data.embedType === 'embed') {
        iframe = $('<div class="aspiesoft-embed" doing-init-animation' + attrs + styles + '><iframe class="aspiesoft-embed-content" style="opacity: 0;" lazy-src="' + data.url + '" frameborder="0" allowfullscreen allow="encrypted-media" allowtransparency="true"></iframe></div>').insertAfter(elm);
        iframe.css('border-radius', '5px');
      } else if(data.embedType === 'image') {
        iframe = $('<div class="aspiesoft-embed" doing-init-animation' + attrs + styles + '><img class="aspiesoft-embed-content" style="opacity: 0;" lazy-src="' + data.url + '"></div>').insertAfter(elm);
      }

      if(!iframe) {
        return;
      }

      $(elm).remove();

      if(title) {
        iframe.before('<h2>' + (title.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')) + '</h2><br>');
      }

      if(description) {
        iframe.after('<br><h3>' + (description.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')) + '</h3>');
      }

      let newHeight = getRatioHeight(iframe);
      iframe.css('transition', 'none');
      iframe.css('max-height', '90vh'); // prevent embed from becoming taller than the browser window
      iframe.css('height', '0');
      iframe.css('margin-bottom', newHeight);

      setTimeout(function() {
        iframe.css('transition', '');
      }, 10);

      $('.aspiesoft-embed-content', iframe).on('load', function() {
        $(this).css('opacity', 1);
      });

      setTimeout(function() {
        iframe.css('margin-bottom', '');
        iframe.removeAttr('doing-init-animation');
        iframe.css('opacity', 1);
      }, 200);

      await sleep(10);

    });
  }

  function fixEmbedRatio() {
    $('.aspiesoft-embed').each(function() {
      let elm = this;

      if(elm.hasAttribute('doing-init-animation')) {
        return;
      }
      let newHeight = getRatioHeight(elm);
      if(newHeight !== $(elm).attr('height')) {
        $(elm).attr('height', newHeight);
        $(elm).css('height', newHeight);
      }
    });
  }

  function getRatioHeight(elm) {
    let width = $(elm).width();
    let ratio = $(elm).attr('ratio');
    if(!ratio || ratio.trim() == '') {
      ratio = '16:9';
    }
    ratio = ratio.split(':', 2);
    let newHeight = Math.round(width * Number(ratio[1]) / Number(ratio[0])) + 'px';
    return newHeight;
  }

  function getEmbedUrl(url) {
    let attrs = undefined;
    let queryObject = undefined;
    let embedType = undefined;
    let exactType = undefined;

    url.replace(/^(?:https?:\/\/|)(?:www\.|)(.*?)(?:\/(.*?)|)(?:\?(.*?)|)$/i, function(_, domain, page, query) {
      query = queryObj(query);
      queryObject = query;
      if(page) {
        page = page.replace(/\\/g, '/').replace(/\/$/, '');
      } else {
        page = '';
      }

      if(!domain || domain.trim() === '' || domain === window.location.hostname || window.location.hostname.endsWith(domain) || domain.endsWith(window.location.hostname.replace(/^www\./g, ''))) {
        // if local site
        if(typeof embedUrlHandler['localhost'] === 'function') {
          let res = embedUrlHandler['localhost'](page, query, domain);
          if(!res) {
            url = false;
          } else if(typeof res === 'object') {
            url = res.url || url;
            embedType = res.embedType || embedType;
            exactType = res.exactType || exactType;
          }
        }
        return;
      } else if(typeof embedUrlHandler[domain] === 'function') {
        let res = embedUrlHandler[domain](page, query);
        if(!res) {
          url = false;
        } else if(typeof res === 'object') {
          url = res.url || url;
          embedType = res.embedType || embedType;
          exactType = res.exactType || exactType;
        }
        return;
      } else if((Array.isArray(defaultEmbedOptions.includeDomains) && defaultEmbedOptions.includeDomains.includes(domain))) {
        let res = undefined;

        if(typeof embedUrlHandler['localhost'] === 'function') {
          res = embedUrlHandler['localhost'](page, query, domain);
        }

        if(!res && typeof embedUrlHandler['simple-embed'] === 'function') {
          res = embedUrlHandler['simple-embed'](page, query, domain);
        }

        if(typeof res === 'object') {
          url = res.url || url;
          embedType = res.embedType || embedType;
          exactType = res.exactType || exactType;
        }
        return;
      }

      url = false;
    });
    if(!url) {
      return false;
    }
    if(queryObject) {
      attrs = queryObject;
    }
    return {url, attrs, embedType, exactType};
  }

  function queryObj(query) {
    if(query) {
      let queryList = query.split('&');
      query = {};
      for(let i = 0; i < queryList.length; i++) {
        if(queryList[i] && queryList[i] !== '') {
          listItem = queryList[i].split(/^(.*?)=/, 3);
          query[listItem[1]] = listItem[2];
        }
      }
      return query;
    }
    return {};
  }


  function renderLazySrc(){
    const windowOffset = $(window).scrollTop() + window.innerHeight;
    $('[lazy-src]').each(function(){
      let offsetTop = $(this).offset().top;
      if(offsetTop === 0){
        return;
      }

      if(windowOffset > offsetTop - 500 && windowOffset < window.innerHeight + offsetTop + 500){
        $(this).attr('src', $(this).attr('lazy-src'));
        this.removeAttribute('lazy-src');
      }
    });
  }

  renderLazySrc();
  setInterval(renderLazySrc, 500);

})();
