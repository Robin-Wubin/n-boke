export const getCategory = state => state.category;
export const getAdminInfo = state => state.admin_info;
export const getTypeList = state => state.type_list;
export const getBlogList = state => state.blog_list;
export const getBlogContent = state => state.blog_content;
export const getClientInfo = (state) => {
    let client_info = state.client_info;
    if(!client_info && typeof window !== "undefined"){
        client_info = JSON.parse(window.localStorage.getItem('client_info') || null);
    }
    return client_info;
};



