export const getServerURL = () => {
  if (typeof window === "undefined") return "";
  if (window.location.href.includes("localhost")) return "/proxy-api";
  else return "/proxy-api";
};
