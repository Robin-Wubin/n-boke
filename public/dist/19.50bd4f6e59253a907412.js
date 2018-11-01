webpackJsonp([19],{214:function(a,t,n){var i=n(254);"string"==typeof i&&(i=[[a.i,i,""]]),i.locals&&(a.exports=i.locals);(0,n(5).default)("a25df852",i,!0,{})},253:function(a,t,n){"use strict";var i=n(214);n.n(i).a},254:function(a,t,n){(a.exports=n(1)(!1)).push([a.i,"\n.daily_block[data-v-6b87fdde] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.daily_block .head[data-v-6b87fdde] {\n  width: 100%;\n  color: #fff;\n  font-size: 20px;\n  font-weight: lighter;\n  padding: 10px 0;\n  background: rgba(45,45,45,0.5);\n  text-align: center;\n}\n.daily_block .val[data-v-6b87fdde] {\n  font-size: 32px;\n  font-weight: 100;\n  padding: 15px 0;\n  color: #fff;\n}\n@media (min-width: 992px) {\n.daily_data[data-v-6b87fdde],\n  .overview_data[data-v-6b87fdde] {\n    padding-left: 0;\n    padding-right: 0;\n}\n.daily_data[data-v-6b87fdde]:first-child,\n  .overview_data[data-v-6b87fdde]:first-child {\n    padding-left: 15px;\n}\n.daily_data[data-v-6b87fdde]:last-child,\n  .overview_data[data-v-6b87fdde]:last-child {\n    padding-right: 15px;\n}\n.intro[data-v-6b87fdde] {\n    border-right: 1px solid #888;\n    padding-left: 0;\n    padding-right: 0;\n}\n.intro[data-v-6b87fdde]:first-child {\n    padding-left: 15px;\n}\n.intro[data-v-6b87fdde]:last-child {\n    border-right: none;\n    padding-right: 15px;\n}\n}\n.tips[data-v-6b87fdde] {\n  color: #888;\n  padding: 15px;\n  font-size: 14px;\n}\n.advice[data-v-6b87fdde] {\n  padding: 0 15px;\n  position: relative;\n  height: 32px;\n}\n.advice_content[data-v-6b87fdde] {\n  padding: 0 15px;\n  position: relative;\n  font-size: 14px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  height: 150px;\n  margin-bottom: 15px;\n}\n.advice_content a[data-v-6b87fdde] {\n  text-align: center;\n}\n.self-btn[data-v-6b87fdde] {\n  margin: 0.5rem 0;\n}\n.advice h5[data-v-6b87fdde] {\n  display: block;\n  float: left;\n  background: #fff;\n  z-index: 8;\n  position: relative;\n  padding: 0 1.5rem;\n}\n.advice[data-v-6b87fdde]:before {\n  position: absolute;\n  width: 100%;\n  height: 1px;\n  background: #888;\n  top: 50%;\n  left: 0;\n  content: '';\n  margin-top: -0.4rem;\n}\n.self-or[data-v-6b87fdde] {\n  position: relative;\n  text-align: center;\n}\n.self-or[data-v-6b87fdde]:before {\n  position: absolute;\n  width: 100%;\n  height: 1px;\n  background: #ddd;\n  top: 50%;\n  left: 0;\n  content: '';\n}\n.mine-or[data-v-6b87fdde] {\n  background: #fff;\n  position: relative;\n  z-index: 8;\n  padding: 0 20px;\n}\n.self-title[data-v-6b87fdde] {\n  position: relative;\n  text-align: center;\n  background: #5a5a5a;\n}\n.self-title[data-v-6b87fdde]:before {\n  position: absolute;\n  width: 100%;\n  height: 1px;\n  background: #bbb;\n  top: 50%;\n  left: 0;\n  content: '';\n}\n.my-title[data-v-6b87fdde] {\n  color: #fff;\n  position: relative;\n  z-index: 8;\n  background: #5a5a5a;\n  padding: 0 25px;\n}\n",""])},305:function(a,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i={name:"dashboard",data:function(){return{breadcrumb:[{text:"Dashboard",href:"/admin/app/dashboard"}],dailyData:{pv:0,uv:0,comment:0},overView:{article:0,comment:0}}},methods:{go:function(a){this.$router.push(a)},getData:function(){var a=this;this.axios.get("/api/admin/overview").then(function(t){console.log(t.data.data),"0000"===t.data.code?(a.$set(a.dailyData,"pv",t.data.data.daily.pv),a.$set(a.dailyData,"uv",t.data.data.daily.uv),a.$set(a.dailyData,"comment",t.data.data.daily.comment),a.$set(a.overView,"article",t.data.data.overview.article),a.$set(a.overView,"comment",t.data.data.overview.comment),console.log(t.data.data)):console.error(t)}).catch(function(a){console.error(a)})}},mounted:function(){this.getData()}},e=(n(253),n(41)),d=Object(e.a)(i,function(){var a=this,t=a.$createElement,n=a._self._c||t;return n("div",[n("div",{staticClass:"main_container"},[n("b-breadcrumb",{staticClass:"bread_head",attrs:{items:a.breadcrumb}}),n("b-container",[n("b-row",[n("b-col",[n("p",{staticClass:"tips"},[a._v("欢迎使用N-Boke，你可以开始使用并自定义你的站点：")])])],1),n("b-row",[n("b-col",{staticClass:"intro",attrs:{lg:"4"}},[n("div",{staticClass:"advice"},[n("h5",[a._v("开始使用")])]),n("div",{staticClass:"advice_content"},[n("b-button",{staticClass:"self-btn",attrs:{size:"",variant:"primary"},on:{click:function(t){a.go("/admin/app/setting")}}},[a._v("\n                            设置您的站点\n                        ")]),n("div",{staticClass:"self-or"},[n("span",{staticClass:"mine-or"},[a._v("或")])]),n("div",{staticStyle:{"text-align":"center"}},[n("b-button",{attrs:{size:"sm",variant:"success"},on:{click:function(t){a.go("/admin/app/person")}}},[a._v("\n                                完善您的个人信息\n                            ")])],1)],1)]),n("b-col",{staticClass:"intro",attrs:{lg:"4"}},[n("div",{staticClass:"advice"},[n("h5",[a._v("接下来")])]),n("div",{staticClass:"advice_content"},[n("a",{attrs:{href:"/admin/app/article/new"}},[n("i",{staticClass:"fa fa-edit"}),a._v(" 撰写文章")]),n("a",{attrs:{href:"/",target:"_blank"}},[n("i",{staticClass:"fa fa-desktop"}),a._v(" 查看站点")])])]),n("b-col",{staticClass:"intro",attrs:{lg:"4"}},[n("div",{staticClass:"advice"},[n("h5",[a._v("更多操作")])]),n("div",{staticClass:"advice_content"},[n("a",{attrs:{href:"/admin/app/source/index"}},[n("i",{staticClass:"fa fa-file-image-o"}),a._v(" 管理素材")]),n("a",{attrs:{href:"/admin/app/comment/list/0/1"}},[n("i",{staticClass:"fa fa-comments"}),a._v(" 管理评论")])])])],1),n("b-row",[n("b-col",[n("div",{staticClass:"self-title"},[n("span",{staticClass:"my-title"},[a._v("站点概览")])])])],1),n("b-row",[n("b-col",{staticClass:"overview_data",attrs:{lg:"6"}},[n("div",{staticClass:"bg-purple daily_block"},[n("span",{staticClass:"head font"},[a._v("文章总数")]),n("span",{staticClass:"val"},[a._v(a._s(a.overView.article))])])]),n("b-col",{staticClass:"overview_data",attrs:{lg:"6"}},[n("div",{staticClass:"bg-blue daily_block"},[n("span",{staticClass:"head font"},[a._v("评论总数")]),n("span",{staticClass:"val"},[a._v(a._s(a.overView.comment))])])])],1),n("b-row",[n("b-col",[n("div",{staticClass:"self-title"},[n("span",{staticClass:"my-title"},[a._v("今日数据")])])])],1),n("b-row",[n("b-col",{staticClass:"daily_data",attrs:{lg:"4"}},[n("div",{staticClass:"bg-orange daily_block"},[n("span",{staticClass:"head font"},[a._v("UV")]),n("span",{staticClass:"val"},[a._v(a._s(a.dailyData.uv))])])]),n("b-col",{staticClass:"daily_data",attrs:{lg:"4"}},[n("div",{staticClass:"bg-yellow daily_block"},[n("span",{staticClass:"head font"},[a._v("PV")]),n("span",{staticClass:"val"},[a._v(a._s(a.dailyData.pv))])])]),n("b-col",{staticClass:"daily_data",attrs:{lg:"4"}},[n("div",{staticClass:"bg-green daily_block"},[n("span",{staticClass:"head font"},[a._v("评论")]),n("span",{staticClass:"val"},[a._v(a._s(a.dailyData.comment))])])])],1)],1)],1)])},[],!1,null,"6b87fdde",null);d.options.__file="dashboard.vue";t.default=d.exports}});