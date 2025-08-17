import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Layout } from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignUp from "../pages/Youth/SignUp/SignUp";
import SignUpNickname from "../pages/Youth/SignUp/SignUpNickname";
import Home from "../pages/Youth/Home/Home";
import NopoHome from "../pages/Nopo/Home/NopoHome";
import RequestCreate from "../pages/Nopo/Request/RequestCreate";
import RequestEdit from "../pages/Nopo/Request/RequestEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "auth/login-youth", element: <SignUp /> },
      { path: "auth/login-youth/nickname", element: <SignUpNickname /> },
      { path: "youth/home", element: <Home /> },
      //{ path: "youth/home/ai-mission", element: <SignUp /> },
      //{ path: "youth/mission/plan", element: <Plan /> },
      //{ path: "youth/mission/plan/perform", element: <Perform /> },
      //{ path: "youth/mypage", element: <MyPage /> },

      { path: "nopo/home", element: <NopoHome /> },
      { path: "nopo/request/create", element: <RequestCreate /> },
      { path: "nopo/request/edit", element: <RequestEdit /> },
    ],
  },
]);

export default router;
