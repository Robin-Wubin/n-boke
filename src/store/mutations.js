export default{
    SET_ADMIN_INFO: (state, admin_info) => {
        state.admin_info = admin_info
    },
    SET_TYPE_LIST: (state, list) => {
        state.type_list = list
    },
    SET_BLOG_LIST: (state, list) => {
        state.blog_list = list
    },
    SET_BLOG_CONTENT: (state, content) => {
        state.blog_content = content
    },
    SET_USER_INFO: (state, info) => {
        state.user_info = info
    },
    SET_CLIENT_INFO: (state, info) => {
        state.client_info = info
    }
}