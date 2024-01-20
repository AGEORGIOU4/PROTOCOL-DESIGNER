import axios from "axios";
import { Notify } from "../_common/alerts/swal";
import { server_url } from "../_common/urls";

async function RestApi(path, method, token = "", data = {}) {
  let headers = { "Authorization ": `Bearer ${token}` };
  let url = server_url + path;

  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return response.data;
  } catch (e) {
    switch (e.code) {
      case "ERR_NETWORK":
        Notify("Server is down. Please contact a technician", "error");
        break;
      case "ERR_BAD_REQUEST":
        if (e.response.data.msg) {
          Notify(e.response.data.msg, "error");
        } else {
          Notify("Bad request", "error");
        }
        break;
      default:
        Notify("Something went wrong", "error");
        break;
    }
    console.error("Error:", e);
  }
}

const API_Services = { RestApi };

export default API_Services;
