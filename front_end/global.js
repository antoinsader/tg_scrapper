const main_url = "http://localhost:8000";
const routes = {
  start_login: main_url + "/startLogin",
  confirmCode: main_url + "/confirmCode",
  groups: main_url + "/groups"
};

const urls = {
  login: "/login/login.html",
  listGroupsChannels: "/lists/channels_groups/channels_groups.html",
};

const local_storage_keys = {
  session_name: "session_name",
  phone: "phone",
  logged_in: "logged_in",
  api_hash: "api_hash",
  api_id:"api_id",
  password:"password",
};

const redirect = (url) => {
    window.location.href = url;
};

const postApiReq = (route, body) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(route, body);
      resolve(response.data);
    } catch (ex) {
      const status = ex?.response?.status;
      if (status === 401) {
        console.warn("Unauthorized. Redirecting to login...");
        redirect(urls.login);
      }
      console.log(
        "Error with requesting: ",
        route,
        " with body: ",
        body,
        " error is: ",
        ex
      );
      reject(ex);
    }
  });

const inpsValid = (inps) => {
  inps.forEach((inp) => {
    if (!inp() || inp() == "") return false;
  });
  return true;
};
