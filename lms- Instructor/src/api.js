async function request(path, options = {}) {
  const token = localStorage.getItem("lms_token");
  const headers = {
    ...(options.body ? { "content-type": "application/json" } : {}),
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  let response;
  try {
    response = await fetch(`/api/${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the LMS API. Start the backend with `npm --prefix server run dev` and make sure MongoDB is running.");
  }
  const responseText = await response.text();
  let payload;
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    if (!response.ok) {
      throw new Error(`The LMS API is unavailable (HTTP ${response.status}). Start the backend and make sure MongoDB is running.`);
    }
    throw new Error(`The LMS API returned an invalid response (HTTP ${response.status}).`);
  }
  if (!responseText) {
    throw new Error(`The LMS API is unavailable (HTTP ${response.status}). Start the backend and make sure MongoDB is running.`);
  }
  if (!response.ok) {
    throw new Error(payload.error || `The LMS API request failed (HTTP ${response.status}).`);
  }
  return payload;
}

export const login = (credentials) =>
  request("auth/login", { method: "POST", body: JSON.stringify(credentials) });
export const getMe = () => request("auth/me");
export const setToken = (token) => localStorage.setItem("lms_token", token);
export const clearToken = () => localStorage.removeItem("lms_token");
export const getCourses = () => request("courses");
export const createCourse = (course) =>
  request("courses", { method: "POST", body: JSON.stringify(course) });
export const updateCourse = (course) =>
  request(`courses/${encodeURIComponent(course.id)}`, {
    method: "PUT",
    body: JSON.stringify(course),
  });
export const submitCourseForReview = (id) =>
  request(`courses/${encodeURIComponent(id)}/submit`, { method: "POST" });
export const deleteCourse = (id) =>
  request(`courses/${encodeURIComponent(id)}`, { method: "DELETE" });
