import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Layout from "./components/layout/Layout.jsx";
import { Provider } from "react-redux";
import store from "../src/redux/store.js";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import Static from "./page/static/Static.jsx";
import User from "./page/users/User.jsx";
import Event from "./page/events/Event.jsx";
import New from "./page/news/New.jsx";
import History from "./page/history/History.jsx";
import Athlete from "./page/athlete/Athlete.jsx";
import { SportClub } from "./page/sport-club/SportClub.jsx";
import SignOut from "./page/sign-out/SignOut.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/home",
        element: <App />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/static",
        element: <Static />,
      },
      {
        path: "/users",
        element: <User />,
      },
      {
        path: "/events",
        element: <Event />,
      },
      {
        path: "/news",
        element: <New/>,
      },
      {
        path: "/history",
        element: <History/>,
      },
      {
        path: "/athlete",
        element: <Athlete/>,
      },
      
      {
        path: "/sport-club",
        element: <SportClub />,
      },
    ],
  },
  {
    path: "/sign-out",
    element: <SignOut/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
