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
export const getCourse = (id) => request(`courses/${encodeURIComponent(id)}`);
export const createCheckout = (courseId) =>
  request("payments/checkout", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
export const getPaymentSuccess = (sessionId) =>
  request(`payments/success?session_id=${encodeURIComponent(sessionId)}`);
export const getEnrollments = () => request("enrollments/me");
export const enroll = async (courseId) => {
  const result = await request("enrollments", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
  return result.enrollment || result;
};
export const updateProgress = (courseId, completedLessons) =>
  request(`enrollments/${encodeURIComponent(courseId)}/progress`, {
    method: "PATCH",
    body: JSON.stringify({ completedLessons }),
  });
export const getNotes = () => request("notes");
export const saveNote = (note) =>
  request("notes", { method: "POST", body: JSON.stringify(note) });
export const deleteNote = (id) =>
  request(`notes/${encodeURIComponent(id)}`, { method: "DELETE" });
export const getCertificates = () => request("certificates/me");
export const submitQuizAttempt = (attempt) =>
  request("quiz-attempts", { method: "POST", body: JSON.stringify(attempt) });
export const getQuizAttempts = () => request("quiz-attempts/me");
export const updateProfile = (profile) =>
  request("users/me", { method: "PATCH", body: JSON.stringify(profile) });
