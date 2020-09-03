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

;(function($){

  defaultEmbedOptions = {
    'width': '100%',
    'min-width': '300px',
    'max-width': '2500px',
    'ratio': '16:9',
    'auto': '0',
    'mute': '0',
    'popular': '0',
    'live': '0',
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
      if(typeof obj2[key] && typeof obj2[key] === typeof obj1[key]){
        if(typeof obj1[key] === 'object' || Array.isArray(obj1[key])){
          obj1[key] = mergeObj(obj1[key], obj2[key]);
        }else{
          obj1[key] = obj2[key];
        }
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
      if(this.hasAttribute('auto-embed-checked')){
        return;
      }else{
        this.setAttribute('auto-embed-checked', '');
      }
      
      let url = $(this).attr('href');
      if(!url || url.trim() === ''){
        return;
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

      if(data.attrs.width){
        let width = data.attrs.width;
        if(!width.match(/[0-9]%$/)){
          width += '%';
        }
        styles += 'width:'+width.replace(/\\?"/g, '\\"')+';';
      }
      if(data.attrs['min-width']){
        let width = data.attrs['min-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'min-width:'+width.replace(/\\?"/g, '\\"')+';';
      }
      if(data.attrs['max-width']){
        let width = data.attrs['max-width'];
        if(!width.match(/[0-9]px$/)){
          width += 'px';
        }
        styles += 'max-width:'+width.replace(/\\?"/g, '\\"')+';';
      }

      if(data.attrs.ratio){
        attrs += ' ratio="'+data.attrs.ratio.replace(/\\?"/g, '\\"')+'"';
      }
      
      if(data.attrs.auto && data.attrs.auto !== '0'){
        youtubeQueryAttrs += '&auto=1';
        if(data.attrs.mute && data.attrs.mute !== '0'){
          youtubeQueryAttrs += '&mute=1';
        }else{
          youtubeQueryAttrs += '&mute=0';
        }
      }else if(data.attrs.mute && data.attrs.mute !== '0'){
        youtubeQueryAttrs += '&mute=1';
      }

      styles += '"';

      data.url = data.url.replace(/\\?"/g, '\\"')+youtubeQueryAttrs;
      let iframe = $('<div class="aspiesoft-video-embed" doing-init-animation'+attrs+styles+'><iframe style="opacity: 0;" src="'+data.url+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>').insertAfter(this);
      $(this).remove();

      let newHeight = getRatioHeight(iframe);
      iframe.css('transition', 'none');
      iframe.css('height', '0');
      iframe.css('margin-bottom', newHeight);
      
      setTimeout(function(){
        iframe.css('transition', '');
      }, 10);

      $('iframe', iframe).load('ready', function(){
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
    $('.aspiesoft-video-embed').each(function(){
      if(this.hasAttribute('doing-init-animation')){
        return;
      }
      let newHeight = getRatioHeight(this);
      if(newHeight !== $(this).attr('height')){
        $(this).attr('height', newHeight);
        $(this).css('height', newHeight);
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

    //todo: add search option to plugin (use ?search do search for the video id, or value for search)
    // https://www.youtube.com/embed/?listType=search&list=AspieSoft

    url.replace(/^(?:https?:\/\/|)(?:www\.|)(.*?)(?:\/(.*?)|)(?:\?(.*?)|)$/i, function(_, domain, page, query){
      query = queryObj(query);
      queryObject = query;
      if(domain === 'youtu.be'){
        page = page.replace(/^(.*?)\/.*/, '$1');
        if(page.startsWith('UC') || page.startsWith('UU') || page.startsWith('PU')){
          if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))){
            page = page.replace('UC', 'PU');
          }else if((query && query.live && query.live != '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))){
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
        }else{
          url = 'https://www.youtube.com/embed/'+page+'?t=0';
          return;
        }
      }else if(domain === 'youtube.com'){
        if(page.startsWith('channel/')){
          page = page.replace('channel/', '');
          if((query && query.popular && query.popular !== '0') || (defaultEmbedOptions.popular && defaultEmbedOptions.popular !== '0' && (!query || query.popular !== '0'))){
            page = page.replace('UC', 'PU');
          }else if((query && query.live && query.live != '0') || (defaultEmbedOptions.live && defaultEmbedOptions.live !== '0' && (!query || query.live !== '0'))){
            url = 'https://www.youtube.com/embed/live_stream?channel='+page.replace('UC', 'UU');
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
      }
      url = false;
    });
    if(!url){
      return false;
    }
    if(queryObject){
      attrs = queryObject;
    }
    return {url, attrs};
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
    }
    return query;
  }

})(jQuery);
