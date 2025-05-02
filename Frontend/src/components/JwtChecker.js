import {jwtDecode} from "jwt-decode";

const isTokenValid = (token) => {
  if (!token) {
    return false; // No token, not valid
  }

  try {
    // Decode the JWT token
    const decoded = jwtDecode(token);
    return true; // Token is valid and not expired
  } catch (error) {
    return false; // If token is malformed or any error occurs, it's invalid
  }
};

export {isTokenValid}