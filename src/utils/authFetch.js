export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch('http://localhost:3000' + url, { ...options, headers });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return response;
};
