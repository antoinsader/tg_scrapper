
(() => {
  const dom = {
    names_list: document.getElementById("nameList"),
  };
  const renderChnlsNames = async () => {
    const body = {
      session_name: localStorage.getItem(local_storage_keys.session_name),
    };
    const response = await postApiReq(routes.groups, body);
    const groups = response.groups;
    if (!groups) {
      return alert("Something went wrong");
    }
    groups.forEach((grp) => {
      const dv = document.createElement("div");
      dv.className = "name_card";
      dv.textContent = grp;
      dom.names_list.appendChild(dv);
    });
  };
  const checkLoggedin = () => {
    console.log("local_storage_keys.logged_in: " , local_storage_keys.logged_in);
    console.log("ss: ", localStorage.getItem(local_storage_keys.logged_in))
    if (localStorage.getItem(local_storage_keys.logged_in) == "yes")
      return true;
    console.log("login page")
    // alert("You need to login");
    // redirect( urls.login);
  };

  const main = () => {
    console.log("i am here")
    checkLoggedin();
    renderChnlsNames();
  };
  console.log("o MA HERE")
  document.addEventListener("DOMContentLoaded", main);
})();
