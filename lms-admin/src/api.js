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
    throw new Error(
      `The LMS API returned an invalid response (HTTP ${response.status}).`
    );
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
export const getUsers = () => request("users");
export const getCourses = () => request("courses");
export const getCategories = () => request("categories");
export const getReviewQueue = () => request("admin/courses/review-queue");
export const reviewCourse = (id, action, note = "") =>
  request(`admin/courses/${encodeURIComponent(id)}/review`, {
    method: "POST",
    body: JSON.stringify({ action, note }),
  });
export const setCoursePublished = (id, published) =>
  request(`admin/courses/${encodeURIComponent(id)}/${published ? "publish" : "unpublish"}`, {
    method: "POST",
  });
export const getPurchases = () => request("admin/purchases");
export const getAdminEnrollments = () => request("admin/enrollments");
export const grantCourseAccess = (studentId, courseId) =>
  request("admin/enrollments", {
    method: "POST",
    body: JSON.stringify({ studentId, courseId }),
  });
export const revokeCourseAccess = (id) =>
  request(`admin/enrollments/${encodeURIComponent(id)}`, { method: "DELETE" });
export const createUser = (user) =>
  request("users", { method: "POST", body: JSON.stringify(user) });
export const updateUser = (id, values) =>
  request(`users/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(values),
  });
export const updateMe = (values) =>
  request("users/me", { method: "PATCH", body: JSON.stringify(values) });
export const updateUserStatus = (id, status) => updateUser(id, { status });
export const deleteUser = (id) =>
  request(`users/${encodeURIComponent(id)}`, { method: "DELETE" });
export const createCategory = (name) =>
  request("categories", { method: "POST", body: JSON.stringify({ name }) });
export const deleteCategory = (id) =>
  request(`categories/${encodeURIComponent(id)}`, { method: "DELETE" });
export const createCourse = (course) =>
  request("courses", { method: "POST", body: JSON.stringify(course) });
export const updateCourse = (course) =>
  request(`courses/${encodeURIComponent(course.id)}`, {
    method: "PUT",
    body: JSON.stringify(course),
  });
export const deleteCourse = (id) =>
  request(`courses/${encodeURIComponent(id)}`, { method: "DELETE" });
