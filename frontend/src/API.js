import axios from "axios";


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
    try {
      let res = await this.request('auth/register', data, 'post');
      return {success: true,
              token: res.token}
    } catch (err) {
      return {success: false,
              message: "Password does not meet minimum length of 5"}
    }
    
    // FIX ERROR HERE
  }

  //LOG IN
  static async login(data) {
    try {
      let res = await this.request('auth/token', data, 'post');
      return {success: true,
              token: res.token};
    } catch (err) {
      return {success: false,
              message: err[0]}
    }
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

  //POST and SAVE NEW USER CODE
  static async saveUserCode(userId, data) {
    let res = await this.request(`users/${userId}/codes`, data, 'post');
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

  //CREATE (POST) NEW CODE GENERATED FROM API
  static async createCode(data) {
    let res = await this.request("create", data, 'post');
    return res;
  }

  //UPDATE USER PROFILE INFO
  static async saveProfile(userId, data) {
    let res = await this.request(`users/${userId}`, data, "patch");
    return res.user;
  }
}

export default QreatorApi;