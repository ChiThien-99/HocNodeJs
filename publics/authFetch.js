const getCookie=(name)=>{
  const value=`; ${document.cookie}`;
  const parts=value.split(`; ${name}=`);
  if (parts.length===2) {
    return parts.pop().split(";").shift();
  }
  return null;
}
let accessToken=getCookie("accessToken") || null;
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
   document.cookie=`accessToken=${token};path=/;max-age=28800;SameSite=none;Secure`;
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
          isRefreshing=false;
          options.headers["authorization"] = `Bearer ${data.accessToken}`;
          return fetch(url, options);
        } else {
          throw new Error("Refresh token expired");
        }
      } catch (error) {
        isRefreshing = false;
        refreshSubcribers=[];
        window.location.href="/loginAdmin"
        return Promise.reject(error);
      }
    }

    return new Promise((resolve)=>{
      subcribeTokenRefresh((token)=>{
        options.headers["Authorization"]=`Bearer ${token}`;
        resolve(fetch(url,options));
      })
    })
  }
  return response;
};
