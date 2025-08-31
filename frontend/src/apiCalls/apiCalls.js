import axiosInstance from '../axios';

// Helper for API requests using axiosInstance
function apiRequest(endpoint, method = 'GET', data = null, params = null) {
    const config = {
        url: endpoint,
        method,
    };
    if (data) config.data = data;
    if (params) config.params = params;
    return axiosInstance(config).then(res => res.data);
}

// Research Areas
export function getResearchAreas(page = 1, pageSize = 10, editable=false) {
    return apiRequest('/api/research-areas/', 'GET', null, { page, page_size: pageSize, editable });
}
export function getResearchArea(id) {
    return apiRequest(`/api/research-areas/${id}/`, 'GET');
}
export function createResearchArea(data) {
    return apiRequest('/api/research-areas/', 'POST', data);
}
export function updateResearchArea(id, data) {
    return apiRequest(`/api/research-areas/${id}/`, 'PUT', data);
}
export function deleteResearchArea(id) {
    return apiRequest(`/api/research-areas/${id}/`, 'DELETE');
}

// Research Group Components
export function getGroupComponents(page = 1, pageSize = 10, editable=false) {
    return apiRequest('/api/group-components/', 'GET', null, { page, page_size: pageSize, editable });
}
export function getGroupComponent(id) {
    return apiRequest(`/api/group-components/${id}/`, 'GET');
}
export function createGroupComponent(data) {
    return apiRequest('/api/group-components/', 'POST', data);
}
export function updateGroupComponent(id, data) {
    return apiRequest(`/api/group-components/${id}/`, 'PATCH', data);
}
export function deleteGroupComponent(id) {
    return apiRequest(`/api/group-components/${id}/`, 'DELETE');
}

// Research Projects
export function getProjects(page = 1, pageSize = 10, editable=false) {
    return apiRequest('/api/projects/', 'GET', null, { page, page_size: pageSize, editable });
}
export function getProject(id) {
    return apiRequest(`/api/projects/${id}/`, 'GET');
}
export function createProject(data) {
    return apiRequest('/api/projects/', 'POST', data);
}
export function updateProject(id, data) {
    return apiRequest(`/api/projects/${id}/`, 'PATCH', data);
}
export function deleteProject(id) {
    return apiRequest(`/api/projects/${id}/`, 'DELETE');
}

// Publications
export function getPublications(page = 1, pageSize = 10, editable=false) {
    return apiRequest('/api/publications/', 'GET', null, { page, page_size: pageSize, editable });
}
export function getPublication(id) {
    return apiRequest(`/api/publications/${id}/`, 'GET');
}
export function createPublication(data) {
    return apiRequest('/api/publications/', 'POST', data);
}
export function updatePublication(id, data) {
    return apiRequest(`/api/publications/${id}/`, 'PATCH', data);
}
export function deletePublication(id) {
    return apiRequest(`/api/publications/${id}/`, 'DELETE');
}

// Courses
export function getCourses(page = 1, pageSize = 10, editable=false) {
    return apiRequest('/api/courses/', 'GET', null, { page, page_size: pageSize, editable });
}
export function getCourse(id) {
    return apiRequest(`/api/courses/${id}/`, 'GET');
}
export function createCourse(data) {
    return apiRequest('/api/courses/', 'POST', data);
}
export function updateCourse(id, data) {
    return apiRequest(`/api/courses/${id}/`, 'PATCH', data);
}
export function deleteCourse(id) {
    return apiRequest(`/api/courses/${id}/`, 'DELETE');
}

// Users
export function getUsers() {
    return apiRequest('/api/users/', 'GET');
}
export function getUser(id) {
    return apiRequest(`/api/users/${id}/`, 'GET');
}
export function createUser(data) {
    return apiRequest('/api/users/', 'POST', data);
}
export function updateUser(data) {
    return apiRequest('/api/auth/users/me/', 'PATCH', data);
}
export function deleteUser(id) {
    return apiRequest(`/api/users/${id}/`, 'DELETE');
}
export function isComponent(id) {
    return apiRequest(`/api/is-component/${id}/`, 'GET');
}


// Permissions endpoint
export function getPermissions() {
    return apiRequest('/api/auth/permissions/', 'GET');
}