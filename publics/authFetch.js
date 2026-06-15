const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
};
let accessToken = getCookie("accessToken") || null;
let accessToken2 = getCookie("accessToken2") || null;
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
    accessToken = token;
    document.cookie = `accessToken=${token};path=/;SameSite=none;Secure`;
  } else {
    accessToken = null;
    document.cookie = "accessToken=;path=/;max-age=0;SameSite=none;Secure";
  }
};
export const setAccessToken2 = (token,cookieMaxAge) => {
  if (token) {
    accessToken2 = token;
    const maxAgeString=cookieMaxAge?`;max-age=${cookieMaxAge}`:"";
    document.cookie = `accessToken2=${token};path=/${maxAgeString};SameSite=none;Secure`;
  } else {
    accessToken2 = null;
    document.cookie = "accessToken2=;path=/;max-age=0;SameSite=none;Secure";
  }
};
export const authFetch = async (url, options = {}) => {
  let currentToken = accessToken;
  options = {
    ...options,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
  };
  let response = await fetch(url, options);
  if (response.status === 401) {
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
          onRefresh(data.accessToken);
          isRefreshing = false;
          options.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return fetch(url, options);
        } else {
          throw new Error("Refresh token expired");
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubcribers = [];
        window.location.href = "/loginAdmin";
        return Promise.reject(error);
      }
    }

    return new Promise((resolve) => {
      subcribeTokenRefresh((newToken) => {
        options.headers["Authorization"] = `Bearer ${newToken}`;
        resolve(fetch(url, options));
      });
    });
  }
  return response;
};
export const authFetch2 = async (url, options = {}) => {
  let currentToken = accessToken2;
  options = {
    ...options,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${currentToken}`,
      "Content-Type": "application/json",
    },
  };
  let response = await fetch(url, options);
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.warn(
        "Access Token expired. Refreshing token for all pending requests...",
      );
      try {
        const refreshRes = await fetch("/api/auth/refresh2", {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setAccessToken2(data.accessToken);
          onRefresh(data.accessToken);
          isRefreshing = false;
          options.headers["Authorization"] = `Bearer ${data.accessToken}`;
          return fetch(url, options);
        } else {
          throw new Error("Refresh token expired");
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubcribers = [];
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/index/loginClient?headerActive=loginClient&redirect=${encodeURIComponent(currentPath)}`;
        return Promise.reject(error);
      }
    }

    return new Promise((resolve) => {
      subcribeTokenRefresh((newToken) => {
        options.headers["Authorization"] = `Bearer ${newToken}`;
        resolve(fetch(url, options));
      });
    });
  }
  return response;
};
