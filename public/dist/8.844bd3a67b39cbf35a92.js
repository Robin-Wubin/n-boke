webpackJsonp([8],{174:function(t,n,e){"use strict";n.__esModule=!0;var a=function(t){return t&&t.__esModule?t:{default:t}}(e(175));n.default=a.default||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t}},175:function(t,n,e){t.exports={default:e(176),__esModule:!0}},176:function(t,n,e){e(177),t.exports=e(2).Object.assign},177:function(t,n,e){var a=e(12);a(a.S+a.F,"Object",{assign:e(178)})},178:function(t,n,e){"use strict";var a=e(19),o=e(42),s=e(26),i=e(41),r=e(72),c=Object.assign;t.exports=!c||e(14)(function(){var t={},n={},e=Symbol(),a="abcdefghijklmnopqrst";return t[e]=7,a.split("").forEach(function(t){n[t]=t}),7!=c({},t)[e]||Object.keys(c({},n)).join("")!=a})?function(t,n){for(var e=i(t),c=arguments.length,l=1,u=o.f,f=s.f;c>l;)for(var d,p=r(arguments[l++]),_=u?a(p).concat(u(p)):a(p),b=_.length,g=0;b>g;)f.call(p,d=_[g++])&&(e[d]=p[d]);return e}:c},193:function(t,n,e){(t.exports=e(1)(!1)).push([t.i,"\n.about_body_title[data-v-82c6ae86] {\n  padding: 15px 35px;\n  text-align: center;\n}\n.about_body[data-v-82c6ae86] {\n  padding: 15px 35px;\n  background: #fff;\n}\n.ico[data-v-82c6ae86] {\n  text-align: center;\n  border-bottom: 1px solid rgba(51,51,51,0.11);\n  border-radius: 5px 5px 0 0;\n}\n.ico img[data-v-82c6ae86] {\n  border: 1px solid #e0e0e0;\n  border-radius: 5px;\n  box-shadow: 0 0 15px 0 rgba(0,0,0,0.1);\n}\n.categorys-title[data-v-82c6ae86] {\n  position: relative;\n  margin: 10px auto;\n  padding: 0 30px;\n  color: #5f5f5f;\n  font-size: 14px;\n}\n.categorys-title[data-v-82c6ae86]:before {\n  position: absolute;\n  top: 0;\n  left: -15px;\n  padding: 0 0 0 30px;\n  color: #eb5055;\n  content: '#';\n}\n.about_content[data-v-82c6ae86] {\n  padding-left: 30px;\n  list-style-type: none;\n  font-size: 14px;\n}\n.about_content li[data-v-82c6ae86] {\n  margin: 10px 0;\n  display: flex;\n  flex-direction: row;\n}\n.about_content li span[data-v-82c6ae86] {\n  width: 80px;\n  flex-shrink: 0;\n}\n.about_content li div[data-v-82c6ae86] {\n  padding-left: 15px;\n  flex-grow: 1;\n}\n",""])},217:function(t,n,e){"use strict";var a=e(193);e.n(a).a},261:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=e(174),o=e.n(a),s=e(43),i=e.n(s),r=e(71),c={name:"about",asyncData:function(t){var n=t.store;t.route;return i.a.all([n.dispatch("getUserInfo")])},computed:o()({},Object(r.c)({user_info:"getUserInfo"})),mounted:function(){console.log(this.user_info)}},l=(e(217),e(40)),u=Object(l.a)(c,function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("b-container",{staticClass:"mb-5"},[e("b-row",[e("b-col",{staticClass:"about_body_title",attrs:{lg:"8","offset-lg":"2"}},[e("h5",{staticClass:"mt-3"},[t._v("关 · 于")])])],1),e("b-row",[e("b-col",{staticClass:"about_body ico",attrs:{lg:"8","offset-lg":"2"}},[e("img",{attrs:{src:t.user_info.ico?t.user_info.ico:"/avatar.png",height:"80"}})])],1),e("b-row",[e("b-col",{staticClass:"about_body",attrs:{lg:"8","offset-lg":"2"}},[e("span",{staticClass:"categorys-title"},[t._v("个人简介")]),e("ol",{staticClass:"about_content"},[e("li",[e("span",[t._v("昵  称:")]),e("div",[t._v(t._s(t.user_info.nickname))])]),e("li",[e("span",[t._v("座 右 铭:")]),e("div",[t._v(t._s(t.user_info.motto))])]),e("li",[e("span",[t._v("个人介绍:")]),e("div",[t._v(t._s(t.user_info.brief))])])])])],1),e("b-row",[e("b-col",{staticClass:"about_body",attrs:{lg:"8","offset-lg":"2"}},[e("span",{staticClass:"categorys-title"},[t._v("社交信息")]),e("ol",{staticClass:"about_content"},t._l(t.user_info.social,function(n){return e("li",{key:n.name},[e("span",[e("i",{class:n.style}),t._v(" "+t._s(n.text)+":")]),e("div",["text"===n.type?e("span",[t._v(t._s(n.url))]):t._e(),"url"===n.type?e("a",{attrs:{href:n.url,target:"_blank"}},[t._v(t._s(n.url))]):t._e(),"image"===n.type?e("img",{attrs:{src:n.url,height:"120"}}):t._e()])])}))])],1)],1)},[],!1,null,"82c6ae86",null);u.options.__file="about.vue";n.default=u.exports}});