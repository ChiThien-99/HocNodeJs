let accessToken = null;
export const authFetch = async (url, options = {}) => {
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  options.credentials = "include";
  let response = await fetch(url, options);
  if (response.status === 401) {
    console.warn("Access Token expired, attempting to refresh...");
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      accessToken = data.accessToken;
      options.headers["Authorization"] = `Bearer ${accessToken}`;
      return fetch(url, options);
    } else {
      console.error("Refresh token failed. Redirecting to login...");
      window.location.href = "/loginAdmin";
    }
  }
  return response;
};
