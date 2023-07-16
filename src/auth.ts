// auth.ts

// Function to store the token in localStorage
export const storeToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Function to check if the user is authorized
export const isAuthorized = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  return !!token; // Return true if the token exists, otherwise false
};

// Function to remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};
