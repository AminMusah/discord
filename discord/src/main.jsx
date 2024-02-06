import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { InitialModal } from "./ui-components/modals/initial-modal";
import Server from "./pages/Server";
import { Provider } from "react-redux";
import store from "./redux/store";
import Channel from "./pages/Channel";
import Register from "./pages/Register";
import InviteCodePage from "./pages/InviteCodePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/server",
    element: <InitialModal />,
  },
  {
    path: "/server/:id",
    element: <Server />,
    children: [
      {
        path: "channel/:channelId",
        element: <Channel />,
      },
    ],
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/invite/:id",
    element: <InviteCodePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
