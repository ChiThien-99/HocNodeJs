let accessToken = localStorage.getItem("accessToken") || null;
let isRefreshing = false;
let refreshSubcribers = [];

const subcribeTokenRefresh = (cb) => {
  refreshSubcribers.push(cb);
};
const onRefresh = (token) => {
  refreshSubcribers.map((cb) => cb(token));
  refreshSubcribers = [];
};
export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};
export const getAccessToken = () => accessToken;
export const authFetch = async (url, options = {}) => {
  let currentToken = getAccessToken();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${currentToken}`,
    "Content-Type": "application/json",
  };
  options.credentials = "include";
  let response = await fetch(url, options);
  if (response.status === 401) {
    const retryOriginalRequest = new Promise((resolve) => {
      subcribeTokenRefresh((currentToken) => {
        options.headers["Authorization"] = `Bearer ${currentToken}`;
        resolve(fetch(url, options));
      });
    });
    if (!isRefreshing) {
      isRefreshing = true;
      console.warn(
        "Access Token expired. Refreshing token for all pending requests...",
      );
      try {
        const refreshRes = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        console.log(refreshRes);
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setAccessToken(data.accessToken);
          console.log(`Access token: ${accessToken}`);
          options.headers["Authorization"] = `Bearer ${accessToken}`;
          return fetch(url, options);
        } else {
          console.error("Refresh token failed. Redirecting to login...");
          // window.location.href = "/loginAdmin";
        }
      } catch (error) {
        isRefreshing = false;
        return Promise.reject(error);
      }
    }

    return retryOriginalRequest;
  }
  return response;
};
