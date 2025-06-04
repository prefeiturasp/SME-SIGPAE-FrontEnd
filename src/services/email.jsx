import { API_URL } from "src/constants/config";
import authService from "./auth";

const authHeader = {
  "Content-Type": "application/json",
  Authorization: `JWT ${authService.getToken()}`,
};

export const getEmailConfiguration = async () => {
  try {
    const response = await fetch(`${API_URL}/email/1/`, {
      method: "GET",
      headers: authHeader,
    });
    const json = await response.json();
    return json;
  } catch (err) {
    return console.log(`getEmailConfigurationError: ${err}`);
  }
};

export const setEmailConfiguration = async (values) => {
  try {
    const response = await fetch(`${API_URL}/email/1/`, {
      method: "PUT",
      headers: authHeader,
      body: JSON.stringify(values),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`setEmailConfigurationError ${error}`);
  }
};

export const testEmailConfiguration = async (to_email) => {
  try {
    const response = await fetch(`${API_URL}/email-test/`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ to_email: to_email }),
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`testEmailConfigurationError ${error}`);
  }
};
