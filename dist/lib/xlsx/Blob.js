!function(t){"use strict";if(t.URL=t.URL||t.webkitURL,t.Blob&&t.URL)try{return new Blob}catch(t){}var a=t.BlobBuilder||t.WebKitBlobBuilder||t.MozBlobBuilder||function(t){function c(t){return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1]}function e(){this.data=[]}function l(t,e,n){this.data=t,this.size=t.length,this.type=e,this.encoding=n}function s(t){this.code=this[this.name=t]}var n=e.prototype,o=l.prototype,d=t.FileReaderSync,i="NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),a=i.length,r=t.URL||t.webkitURL||t,u=r.createObjectURL,f=r.revokeObjectURL,R=r,p=t.btoa,h=t.atob,b=t.ArrayBuffer,g=t.Uint8Array,w=/^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;for(l.fake=o.fake=!0;a--;)s.prototype[i[a]]=a+1;return(R=r.createObjectURL?R:t.URL=function(t){var e=document.createElementNS("http://www.w3.org/1999/xhtml","a");return e.href=t,"origin"in e||("data:"===e.protocol.toLowerCase()?e.origin=null:(t=t.match(w),e.origin=t&&t[1])),e}).createObjectURL=function(t){var e=t.type;return null===e&&(e="application/octet-stream"),t instanceof l?(e="data:"+e,"base64"===t.encoding?e+";base64,"+t.data:"URI"===t.encoding?e+","+decodeURIComponent(t.data):p?e+";base64,"+p(t.data):e+","+encodeURIComponent(t.data)):u?u.call(r,t):void 0},R.revokeObjectURL=function(t){"data:"!==t.substring(0,5)&&f&&f.call(r,t)},n.append=function(t){var e=this.data;if(g&&(t instanceof b||t instanceof g)){for(var n="",o=new g(t),i=0,a=o.length;i<a;i++)n+=String.fromCharCode(o[i]);e.push(n)}else if("Blob"===c(t)||"File"===c(t)){if(!d)throw new s("NOT_READABLE_ERR");var r=new d;e.push(r.readAsBinaryString(t))}else t instanceof l?"base64"===t.encoding&&h?e.push(h(t.data)):"URI"===t.encoding?e.push(decodeURIComponent(t.data)):"raw"===t.encoding&&e.push(t.data):("string"!=typeof t&&(t+=""),e.push(unescape(encodeURIComponent(t))))},n.getBlob=function(t){return arguments.length||(t=null),new l(this.data.join(""),t,"raw")},n.toString=function(){return"[object BlobBuilder]"},o.slice=function(t,e,n){var o=arguments.length;return o<3&&(n=null),new l(this.data.slice(t,1<o?e:this.data.length),n,this.encoding)},o.toString=function(){return"[object Blob]"},o.close=function(){this.size=0,delete this.data},e}(t),e=(t.Blob=function(t,e){var e=e&&e.type||"",n=new a;if(t)for(var o=0,i=t.length;o<i;o++)Uint8Array&&t[o]instanceof Uint8Array?n.append(t[o].buffer):n.append(t[o]);e=n.getBlob(e);return!e.slice&&e.webkitSlice&&(e.slice=e.webkitSlice),e},Object.getPrototypeOf||function(t){return t.__proto__});t.Blob.prototype=e(new t.Blob)}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content||this);