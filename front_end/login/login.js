(() => {
  const dom = {
    divs: {
      start_login: document.getElementById("start_login"),
      confirm_code: document.getElementById("confirm_code"),
    },
    btns: {
      send_code: document.getElementById("send_code"),
      login: document.getElementById("login"),
      start_login_again: document.getElementById("start_login_again"),
    },
    inps:{
      api_hash: document.getElementById("api_hash"),
      api_id: document.getElementById("api_id"),
      phone: document.getElementById("phone"),
      password: document.getElementById("password"),
      
    }
  };

  const inputs = {
    api_hash: () => dom.inps.api_hash.value,
    api_id: () => dom.inps.api_id.value,
    phone: () => dom.inps.phone.value,
    otp_code: () => document.getElementById("code").value,
    password: () => document.getElementById("password").value,
    remember: () => document.getElementById("remember").checked,
  };

  const start_login_func = async () => {
    if (!inpsValid([inputs.api_hash, inputs.api_id, inputs.phone]))
      return alert("Fill the required");

    const body = {
      api_hash: inputs.api_hash(),
      api_id: inputs.api_id(),
      phone: inputs.phone(),
    };
    if(inputs.remember){
      localStorage.setItem(local_storage_keys.api_hash, body.api_hash) 
      localStorage.setItem(local_storage_keys.api_id, body.api_id) 
    }
    const response = await postApiReq(routes.start_login, body);
    console.log("response: ", response);
    if (response && response.session_name) {
      localStorage.setItem(
        local_storage_keys.session_name,
        response.session_name
      );
      localStorage.setItem(local_storage_keys.phone, body.phone);
      if (response.message) alert(response.message);
      dom.divs.start_login.style.display = "none";
      dom.divs.confirm_code.style.display = "block";
    } else {
      alert("Something went wrong!");
    }
  };

  const confirm_code_func = async () => {
    if (!inpsValid([inputs.otp_code, inputs.password]))
      return alert("Fill the required");
    const body = {
      session_name: localStorage.getItem(local_storage_keys.session_name),
      phone: localStorage.getItem(local_storage_keys.phone),
      code: inputs.otp_code(),
      password: inputs.password(),
    };
    const response = await postApiReq(routes.confirmCode, body);
    if (response && response.logged_in) {
      alert("Logged in");
      localStorage.setItem(local_storage_keys.logged_in, "yes")
      redirect(urls.listGroupsChannels);
    }
  };
  const start_login_again = () => {
    dom.divs.start_login.style.display = "block";
    dom.divs.confirm_code.style.display = "none";
 
  }
  const restoreHistory = () => {
    const api_hash = localStorage.getItem(local_storage_keys.api_hash) 
    if(api_hash) dom.inps.api_hash.value = api_hash;
    const api_id = localStorage.getItem(local_storage_keys.api_id) 
    if(api_id) dom.inps.api_id.value = api_id;
    const phone = localStorage.getItem(local_storage_keys.phone) 
    if(phone) dom.inps.phone.value = phone;
    const password = localStorage.getItem(local_storage_keys.password) 
    if(password) dom.inps.password.value = password;

  }
  const main = () => {

    dom.btns.send_code.addEventListener("click", start_login_func);
    dom.btns.login.addEventListener("click", confirm_code_func);
    dom.btns.start_login_again.addEventListener("click", start_login_again);
    session_name_exists = localStorage.getItem(local_storage_keys.session_name)
      ? true
      : false;

    dom.divs.start_login.style.display = session_name_exists ? "none" : "block";
    dom.divs.confirm_code.style.display = session_name_exists ? "block" : "none";
    restoreHistory();
  }
  document.addEventListener("DOMContentLoaded", main);

})();
