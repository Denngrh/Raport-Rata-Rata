export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access_token").value;
  if (!token) {
    if (to.path !== "/") {
      return navigateTo("/");
    }
  } else {
    if (to.path !== "/mapel" && to.path !== "/mapel/raport") {
      return navigateTo(to.path);
    }
  }
});
