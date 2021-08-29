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

;(function(){

  const $ = (function(){
    if(typeof jQuery !== 'undefined'){
      return jQuery;
    }else if(typeof jqAlt !== 'undefined'){
      return jqAlt.jquery();
    }
    console.error('jQuery or jqAlt were not loaded!');
    return undefined;
  })();

  defaultEmbedOptions = {
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

    yt: null, // {width, min-width, max-width, ratio}
    pdf: null, // {width, min-width, max-width, ratio}
    img: null, // {width, min-width, max-width, ratio}
    fb: null, // {width, min-width, max-width, ratio}
  };


  function mergeObj(obj1, obj2){
    let objI = false, objSize;
    if(Array.isArray(obj1)){
      objSize = obj1.length;
    }else{
      objI = Object.keys(obj1);
      objSize = objI.length;
    }

    for(let i = 0; i < objSize; i++){
      let key = i;
      if(objI){key = objI[i];}
      if(obj1[key] != null && obj2[key] != null && (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') || (Array.isArray(obj1[key]) && Array.isArray(obj2[key]))){
        obj1[key] = mergeObj(obj1[key], obj2[key]);
      }else if(obj2[key] != null){
        obj1[key] = obj2[key];
      }
    }

    return obj1;
  }

  if(typeof AspieSoftAutoEmbedOptions === 'object'){
    defaultEmbedOptions = mergeObj(defaultEmbedOptions, AspieSoftAutoEmbedOptions);
  }

  $(document).ready(function(){
    embedLinks();
    setInterval(embedLinks, 100);
    setInterval(fixEmbedRatio, 100);
  });

  function embedLinks(){
    $('a').each(function(){
      let elm = this;

      if(elm.hasAttribute('auto-embed-checked') || elm.hasAttribute('ignore')){
        return;
      }else{
        elm.setAttribute('auto-embed-checked', '');
      }
      

      if(Array.isArray(defaultEmbedOptions.requireAttrs)){
        for(let i in defaultEmbedOptions.requireAttrs){
          if(!elm.hasAttribute(defaultEmbedOptions.requireAttrs[i])){
            return;
          }
        }
      }

      if(Array.isArray(defaultEmbedOptions.ignoreAttrs)){
        for(let i in defaultEmbedOptions.ignoreAttrs){
          if(defaultEmbedOptions.ignoreAttrs[i] === 'class'){
            if(elm.classList.length){
              if(Array.isArray(defaultEmbedOptions.ignoreClass)){
                for(let c in defaultEmbedOptions.ignoreClass){
                  if(!elm.classList.contains(defaultEmbedOptions.ignoreClass[c])){
                    return;
                  }
                }
              }else{
                return;
              }
            }
          }else if(elm.hasAttribute(defaultEmbedOptions.ignoreAttrs[i])){
            return;
          }
        }
      }

      if(Array.isArray(defaultEmbedOptions.ignoreClass) && (!Array.isArray(defaultEmbedOptions.ignoreAttrs) || !defaultEmbedOptions.ignoreAttrs.includes('class'))){
        for(let c in defaultEmbedOptions.ignoreClass){
          if(elm.classList.contains(defaultEmbedOptions.ignoreClass[c])){
            return;
          }
        }
      }

      
      let url = $(elm).attr('href');
      if(!url || url.trim() === ''){
        return;
      }

      let title = $(elm).text();
      if(!title || title.trim() === '' || title === url){
        title = $(elm).attr('title');
        if(!title || title.trim() === ''){
          title = undefined;
        }
      }

      let description = $(elm).attr('description');
      if(!description || description.trim() === ''){
        description = $(elm).attr('desc');
        if(!description || description.trim() === ''){
          description = undefined;
        }
      }
      
      
      url = decodeURIComponent(url);

      data = getEmbedUrl(url);
      if(!data){
        return;
      }

      let attrs = '';
      let styles = ' style="opacity:0;height:0;';
      let youtubeQueryAttrs = '&rel=0&autohide=1&showinfo=0';
      if(!data.attrs){
        data.attrs = {...defaultEmbedOptions};
      }else{
        data.attrs = mergeObj({...defaultEmbedOptions}, data.attrs);
      }

      if(!data.attrs.width && data.attrs.size){
        data.attrs.width = data.attrs.size;
      }
      if(!data.attrs['min-width'] && data.attrs['min-size']){
        data.attrs['min-width'] = data.attrs['min-size'];
      }
      if(!data.attrs['max-width'] && data.attrs['max-size']){
        data.attrs['max-width'] = data.attrs['max-size'];
      }
      if(!data.attrs['auto'] && data.attrs['autoplay']){
        data.attrs['auto'] = data.attrs['autoplay'];
      }

      if(data.attrs[data.exactType]?.width){
        let width = data.attrs[data.exactType].width;
        if(!width.match(/[0-9]%$/)){
          width += '%';
        }
        styles += 'width:'+width.replace(/\\?"/g, '\\"')+';';
      }else if(data.attrs.width){
        let width = data.attrs.width;
        if(!width.match(/[0-9]%$/)){
          width += '%';
        }
        styles += 'width:'+width.replace(/\\?"/g, '\\"')+';';
      }

      if(data.attrs[data.exactType]?.['min-width']){
        let width = data.attrs[data.exactType]['min-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'min-width:'+width.replace(/\\?"/g, '\\"')+';';
      }else if(data.attrs['min-width']){
        let width = data.attrs['min-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'min-width:'+width.replace(/\\?"/g, '\\"')+';';
      }

      if(data.attrs[data.exactType]?.['max-width']){
        let width = data.attrs[data.exactType]['max-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'max-width:'+width.replace(/\\?"/g, '\\"')+';';
      }else if(data.attrs['max-width']){
        let width = data.attrs['max-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'max-width:'+width.replace(/\\?"/g, '\\"')+';';
      }

      if(data.attrs[data.exactType]?.ratio){
        attrs += ' ratio="'+data.attrs[data.exactType]?.ratio.replace(/\\?"/g, '\\"')+'"';
      }else if(data.attrs.ratio){
        attrs += ' ratio="'+data.attrs.ratio.replace(/\\?"/g, '\\"')+'"';
      }


      if(data.embedType === 'video' && data.attrs.auto && data.attrs.auto !== '0'){
        youtubeQueryAttrs += '&auto=1';
        if(data.attrs.mute && data.attrs.mute !== '0'){
          youtubeQueryAttrs += '&mute=1';
        }else{
          youtubeQueryAttrs += '&mute=0';
        }
      }else if(data.embedType === 'video' && data.attrs.mute && data.attrs.mute !== '0'){
        youtubeQueryAttrs += '&mute=1';
      }

      if(!title && (data.attrs.title || data.attrs.name)){
        title = data.attrs.title || data.attrs.name;
      }

      if(!description && (data.attrs.description || data.attrs.desc)){
        description = data.attrs.description || data.attrs.desc;
      }

      styles += '"';

      let iframe = undefined;
      if(data.embedType === 'video'){
        data.url = data.url.replace(/\\?"/g, '\\"')+youtubeQueryAttrs;
        iframe = $('<div class="aspiesoft-embed" doing-init-animation'+attrs+styles+'><iframe class="aspiesoft-embed-content" style="opacity: 0;" src="'+data.url+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>').insertAfter(elm);
      }else if(data.embedType === 'embed'){
        iframe = $('<div class="aspiesoft-embed" doing-init-animation'+attrs+styles+'><iframe class="aspiesoft-embed-content" style="opacity: 0;" src="'+data.url+'" frameborder="0" allowfullscreen allow="encrypted-media" allowtransparency="true"></iframe></div>').insertAfter(elm);
        iframe.css('border-radius', '5px');
      }else if(data.embedType === 'image'){
        iframe = $('<div class="aspiesoft-embed" doing-init-animation'+attrs+styles+'><img class="aspiesoft-embed-content" style="opacity: 0;" src="'+data.url+'"></div>').insertAfter(elm);
      }

      if(!iframe){
        return;
      }
      
      $(elm).remove();

      if(title){
        iframe.before('<h2>'+(title.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'))+'</h2><br>');
      }

      if(description){
        iframe.after('<br><h3>'+(description.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'))+'</h3>');
      }

      let newHeight = getRatioHeight(iframe);
      iframe.css('transition', 'none');
      iframe.css('height', '0');
      iframe.css('margin-bottom', newHeight);
      
      setTimeout(function(){
        iframe.css('transition', '');
      }, 10);

      $('.aspiesoft-embed-content', iframe).on('load', function(){
        $(this).css('opacity', 1);
      });

      setTimeout(function(){
        iframe.css('margin-bottom', '');
        iframe.removeAttr('doing-init-animation');
        iframe.css('opacity', 1);
      }, 200);

    });
  }

  function fixEmbedRatio(){
    $('.aspiesoft-embed').each(function(){
      let elm = this;

      if(elm.hasAttribute('doing-init-animation')){
        return;
      }
      let newHeight = getRatioHeight(elm);
      if(newHeight !== $(elm).attr('height')){
        $(elm).attr('height', newHeight);
        $(elm).css('height', newHeight);
      }
    });
  }

  function getRatioHeight(elm){
    let width = $(elm).width();
    let ratio = $(elm).attr('ratio');
    if(!ratio || ratio.trim() == ''){
      ratio = '16:9';
    }
    ratio = ratio.split(':', 2);
    let newHeight = Math.round(width*Number(ratio[1])/Number(ratio[0]))+'px';
    return newHeight;
  }

  function getEmbedUrl(url){
    let attrs = undefined;
    let queryObject = undefined;
    let embedType = undefined;
    let exactType = undefined;

    url.replace(/^(?:https?:\/\/|)(?:www\.|)(.*?)(?:\/(.*?)|)(?:\?(.*?)|)$/i, function(_, domain, page, query){
      query = queryObj(query);
      queryObject = query;
      if(page){
        page = page.replace(/\\/g, '/').replace(/\/$/, '');
      }else{
        page = '';
      }
      if(domain === 'youtu.be'){
        embedType = 'video';
        exactType = 'yt';
        page = page.replace(/^(.*?)\/.*/, '$1');
        if(page.startsWith('UC') || page.startsWith('UU') || page.startsWith('PU')){
          if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))){
            page = page.replace('UC', 'PU');
          }else if((query && query.live && query.live !== '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))){
            url = 'https://www.youtube.com/embed/live_stream?channel='+page.replace('UC', 'UU');
            return;
          }else{
            page = page.replace('UC', 'UU');
          }
          url = 'https://www.youtube.com/embed?listType=playlist&list='+page+'&t=0';
          return;
        }else if(page.startsWith('PL')){
          url = 'https://www.youtube.com/embed?listType=playlist&list='+page+'&t=0';
          return;
        }else if(query.search && query.search !== '0'){
          url = 'https://www.youtube.com/embed/?listType=search&list='+page+'&t=0';
          return;
        }else{
          url = 'https://www.youtube.com/embed/'+page+'?t=0';
          return;
        }
      }else if(domain === 'youtube.com'){
        embedType = 'video';
        exactType = 'yt';
        if(page.startsWith('channel/')){
          page = page.replace('channel/', '');
          if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))){
            page = page.replace('UC', 'PU');
          }else if((query && query.live && query.live !== '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))){
            url = 'https://www.youtube.com/embed/live_stream?channel='+page.replace('UC', 'UU');
            return;
          }else if(query.search && query.search !== '0'){
            url = 'https://www.youtube.com/embed/?listType=search&list='+page+'&t=0';
            return;
          }else{
            page = page.replace('UC', 'UU');
          }
          url = 'https://www.youtube.com/embed?listType=playlist&list='+page+'&t=0';
          return;
        }else if(page.startsWith('c/')){
          page = page.replace('c/', '');
          url = 'https://www.youtube.com/embed?listType=playlist&list='+page+'&t=0';
          return;
        }else if(page.startsWith('playlist')){
          if(!query){
            url = false;
            return;
          }
          let pl = query.list;
          url = 'https://www.youtube.com/embed?listType=playlist&list='+pl+'&t=0';
          return;
        }else if(page.startsWith('watch')){
          if(!query){
            url = false;
            return;
          }
          let v = query.v;
          url = 'https://www.youtube.com/embed/'+v+'?t=0';
          return;
        }
      }else if(domain === 'facebook.com'){
        if(page.includes('video')){
          //todo: embed facebook video
          url = false;
          return;
        }

        let href;
        if(page === 'plugins/page' || page === 'plugins/page.php'){
          href = query.href;
        }else{
          page = page.split('/');
          if(page[0] === 'page'){
            href = `https%3A%2F%2Fwww.facebook.com%2F${page[1].toString().replace(/[^\w_\-$\.]/g, '')}%2F`;
          }else{
            href = `https%3A%2F%2Fwww.facebook.com%2F${page[0].replace(/[^\w_\-$\.]/g, '')}%2F`;
          }
        }

        url = `https://www.facebook.com/plugins/page.php?href=${href}&tabs=timeline&width=500&height=800&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`;
        embedType = 'embed';
        exactType = 'fb';
        return;
      }else if(!domain || domain.trim() === '' || domain === window.location.hostname || window.location.hostname.endsWith(domain)){
        // if local
        if(!page || page.trim() === ''){
          url = false;
          return;
        }
        if(page.endsWith('.pdf')){
          embedType = 'embed';
          exactType = 'pdf';
          return;
        }else if(page.match(/\.(png|jpe?g|gif|svg|webp|ico|bmp|img|heif|tiff?|jfif)$/i)){
          embedType = 'image';
          exactType = 'img';
          return;
        }
      }
      url = false;
    });
    if(!url){
      return false;
    }
    if(queryObject){
      attrs = queryObject;
    }
    return {url, attrs, embedType, exactType};
  }

  function queryObj(query){
    if(query){
      let queryList = query.split('&');
      query = {};
      for(let i = 0; i < queryList.length; i++){
        if(queryList[i] && queryList[i] !== ''){
          listItem = queryList[i].split(/^(.*?)=/, 3);
          query[listItem[1]] = listItem[2];
        }
      }
      return query;
    }
    return {};
  }

})();
