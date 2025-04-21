const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.ENDPOINT
    : `http://localhost:${process.env.ENDPOINT || 8000}`;

const apiRequest = async ({ endpoint, method = "GET", body, token }) => {
  try {
    const res = await fetch(`${baseUrl}/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { "auth-token": `${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "API Error");
      error.response = { status: res.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "API Request Error:",
      error.response?.data?.message || error.message
    );

    throw {
      message: `API Request Error: ${
        error.response?.data?.message || error.message
      }`,
      data: error.response?.data || null,
      status: error.response?.status || 500,
    };
  }
};

module.exports = { apiRequest };
