
let accessToken = null;
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
  if (token) {
   accessToken=token;
   document.cookie=`accessToken=${token};path=/;max-age=900;SameSite=none;Secure"`;
  } else {
    accessToken=null;
    document.cookie="accessToken=;path=/;max-age=0";
  }
};
export const authFetch = async (url, options = {}) => {
  let currentToken = accessToken;
  options= {
    ...options,
    credentials: "include",
    headers:{
    "Authorization": `Bearer ${currentToken}`,
    "Content-Type": "application/json",
    }, 
  };
  let response = await fetch(url, options);
  if (response.status === 401) {
    const retryOriginalRequest = new Promise((resolve) => {
      subcribeTokenRefresh((currentToken) => {
        options.headers["authorization"] = `Bearer ${currentToken}`;
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
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setAccessToken(data.accessToken);
          options.headers["authorization"] = `Bearer ${accessToken}`;
          return authFetch(url, options);
        } else {
          console.error("Refresh token failed. Redirecting to login...");
          window.location.href = "/loginAdmin";
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
