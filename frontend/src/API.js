import axios from "axios";
import { deleteUserCode } from "../../backend/models/user";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class QreatorApi {
  //token for API will be stored here
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${QreatorApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // INDIVIDUAL ROUTES

  //SIGN UP
  static async register(data) {
    let res = await this.request('auth/register', data, 'post');
    return res.token;
  }

  //LOG IN
  static async login(data) {
    let res = await this.request('auth/token', data, 'post');
    return res.token;
  }

  //GET USER
  static async getUser(userId) {
    let res = await this.request(`users/${userId}`);
    return res.user;
  }

  //GET USER CODES
  static async getUserCodes(userId) {
    let res = await this.request(`users/${userId}/codes`);
    return res.codes;
  }

  //GET USER CODE
  static async getUserCode(userId, codeId) {
    let res = await this.request(`users/${userId}/${codeId}`);
    return res.code;
  }

  //UPDATE(POST/PATCH) USER CODE
  static async updateUserCode(userId, codeId, data) {
    let res = await this.request(`users/${userId}/${codeId}`, data, 'patch');
    return res.code;
  }

  //DELETE USER CODE
  static async deleteUserCode(userId, codeId) {
    let res = await this.request(`users/${userId}/${codeId}`, {}, "delete");
    return res;
  }
}

export default QreatorApi;