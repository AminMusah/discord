const apiRequest = async ({
  endpoint,
  method = "GET",
  body,
  token,
  params,
}) => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.ENDPOINT
        : `http://localhost:${process.env.PORT || 8000}`;

    let url = `${baseUrl}/api/${endpoint}`;

    if (params && typeof params === "object") {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const res = await fetch(url, {
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
