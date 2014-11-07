define([
    "../libs/jquery/jquery-1.8.3.min",
    "../libs/jquery.browser"
], function(jQuery) {
    (function($, window) {
       var ajaxFU = $.ajaxFU = {};
       $.extend(ajaxFU, {
           createUploadIframe: function (id, uri) {
               //create frame
               var frameId = 'jUploadFrame' + id;

               var io = null;
               if (window.ActiveXObject) {
                   //fix ie9 and ie 10-------------
                   if ($.browser.version == "9.0" || $.browser.version == "10.0" || $.browser.version == "11.0") {
                       io = document.createElement('iframe');
                       io.id = frameId;
                       io.name = frameId;
                   } else if ($.browser.version == "6.0" || $.browser.version == "7.0" || $.browser.version == "8.0") {
                       io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
                   }
               }
               else {
                   io = document.createElement('iframe');
                   io.id = frameId;
                   io.name = frameId;
               }

               if (typeof uri == 'boolean') {
                   io.src = 'javascript:false';
               }
               else if (typeof uri == 'string') {
                   io.src = uri;
               }

               io.style.position = 'absolute';
               io.style.top = '-1000px';
               io.style.left = '-1000px';

//            io.document.domain ="entboost.com";
//            alert(document.domain);
//            alert(io.document.domain);
//            alert(io.src);

               document.body.appendChild(io);

               return io;
           },
           createUploadForm: function (id, fileElementId, tag_name, tag_link, tag_sort, tag_status, tag_id) {
               //create form
               var formId = 'jUploadForm' + id;
               var fileId = 'jUploadFile' + id;
               //--
//        var tagNameId = 'tag_name' + id;  
//        var tagLinkId = 'tag_link' + id;  
//        var tagSortId = 'tag_sort' + id;  
//        var tagStatusId = 'tag_status' + id;  
//        var tagIdId = 'tag_id' + id;  
               //--end
               var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
               var oldElement = $('#' + fileElementId);
               var newElement = $(oldElement).clone();
               //--
//        var tagNameElement = '<input type="text" name="tag_name" value="'+tag_name+'">';    
//        var tagLinkElement = '<input type="text" name="tag_link" value="'+tag_link+'">';  
//        var tagSortElement = '<input type="text" name="tag_sort" value="'+tag_sort+'">';  
//        var tagStatusElement = '<input type="text" name="tag_status" value="'+tag_status+'">';  
//        var tagIdElement = '<input type="text" name="tag_id" value="'+tag_id+'">';  
               //--end
               $(oldElement).attr('id', fileId);
               $(oldElement).before(newElement);
               $(oldElement).appendTo(form);
               //--
//        $(tagNameElement).appendTo(form);  
//        $(tagLinkElement).appendTo(form);  
//        $(tagSortElement).appendTo(form);  
//        $(tagStatusElement).appendTo(form);  
//        $(tagIdElement).appendTo(form);  
               //--end
               //set attributes
               $(form).css('position', 'absolute');
               $(form).css('top', '-1200px');
               $(form).css('left', '-1200px');
               $(form).appendTo('body');
               return form;
           },

           ajaxFileUpload: function (s) {
               // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
               s = $.extend({}, $.ajaxSettings, s);
               var id = new Date().getTime();
               ajaxFU.createUploadForm(id, s.fileElementId, s.tag_name, s.tag_link, s.tag_sort, s.tag_status, s.tag_id);
               ajaxFU.createUploadIframe(id, s.secureuri);
               var frameId = 'jUploadFrame' + id;
               var formId = 'jUploadForm' + id;
               // Watch for a new set of requests
               if (s.global && !($.active++)) {
                   $.event.trigger("ajaxStart");
               }
               var requestDone = false;
               // Create the request object
               var xml = {};
               if (s.global)
                   $.event.trigger("ajaxSend", [xml, s]);
               // Wait for a response to come back
               var uploadCallback = function (isTimeout) {
                   var io = document.getElementById(frameId);
                   var execontent = function () {
                       try {
                           if (io.contentWindow) {
                               xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                               xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                           } else if (io.contentDocument) {
                               xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                               xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                           }
                       } catch (e) {
                           ajaxFU.handleError(s, xml, null, e);
                       }
                       if (xml || isTimeout == "timeout") {
                           requestDone = true;
                           var status;
                           try {
                               status = isTimeout != "timeout" ? "success" : "error";
                               // Make sure that the request was successful or notmodified
                               if (status != "error") {
                                   // process the data (runs the xml through httpData regardless of callback)
                                   var data = ajaxFU.uploadHttpData(xml, s.dataType);
                                   // If a local callback was specified, fire it and pass it the data
                                   if (s.success) s.success(data, status);
                                   // Fire the global callback
                                   if (s.global) $.event.trigger("ajaxSuccess", [xml, s]);
                               } else ajaxFU.handleError(s, xml, status);
                           } catch (e) {
                               status = "error";
                               ajaxFU.handleError(s, xml, status, e);
                           }
                           // The request was completed
                           if (s.global) $.event.trigger("ajaxComplete", [xml, s]);
                           // Handle the global AJAX counter
                           if (s.global && !--$.active) $.event.trigger("ajaxStop");
                           // Process result
                           if (s.complete) s.complete(xml, status);
                           $(io).unbind();
                           setTimeout(function () {
                                   try {
                                       $(io).remove();
                                       $(form).remove();
                                   } catch (e) {
                                       ajaxFU.handleError(s, xml, null, e);
                                   }
                               },
                               100);
                           xml = null;
                       }
                   };
                   var crossdomain = !$.browser.msie || document.domain == location.hostname;
                   if (!crossdomain) {
                       io.src = "javascript:try{"
                           + "document.domain=window.location.hostname.split('.').reverse().slice(0,2).reverse().join('.');"
                           + "parent.document.getElementById('" + frameId + "').setAttribute('uploaded','uploaded');"
                           + "}catch(e){}";
                       var timer = window.setInterval(function () {
                           try {
                               if (io.getAttribute("uploaded") == "uploaded") {
                                   crossdomain = true;
                                   window.clearInterval(timer);
                                   execontent();
                               }
                           } catch (e) {
                           }
                       }, 1000);
                   } else {
                       execontent();
                   }
               };

               // Timeout checker
               if (s.timeout > 0) {
                   setTimeout(function () {
                       // Check to see if the request is still happening
                       if (!requestDone) uploadCallback("timeout");
                   }, s.timeout);
               }
               try {
                   //alert(document.domain);
                   // var io = $('#' + frameId);
                   var form = $('#' + formId);
                   $(form).attr('action', s.url);
                   $(form).attr('method', 'POST');
                   $(form).attr('target', frameId);
                   if (form.encoding) {
                       form.encoding = 'multipart/form-data';
                   }
                   else {
                       form.enctype = 'multipart/form-data';
                   }
                   $(form).submit();

               } catch (e) {
                   //alert(e);
                   ajaxFU.handleError(s, xml, null, e);
               }
               if (window.attachEvent) {
                   document.getElementById(frameId).attachEvent('onload', uploadCallback);
               }
               else {
                   document.getElementById(frameId).addEventListener('load', uploadCallback, false);
               }
               return {abort: function () {
               }};

           },

           uploadHttpData: function (r, type) {
               var data = !type;
               data = type == "xml" || data ? r.responseXML : r.responseText;
               // If the type is "script", eval it in global context
               if (type == "script")
                   $.globalEval(data);
               // Get the JavaScript object, if JSON is used.
               if (type == "json")
                   eval("data = " + data);
               // evaluate scripts within html
               if (type == "html")
                   $("<div>").html(data).evalScripts();
               //alert($('param', data).each(function(){alert($(this).attr('value'));}));
               return data;
           },

           // handleError 方法在jquery1.4.2之后移除了，此处重写改方法
           handleError: function (s, xhr, status, e) {
               // If a local callback was specified, fire it
               if (s.error) {
                   s.error.call(s.context || s, xhr, status, e);
               }

               // Fire the global callback
               if (s.global) {
                   (s.context ? $(s.context) : $.event).trigger("ajaxError", [xhr, s, e]);
               }
           }
       });
   })(jQuery, window);
});