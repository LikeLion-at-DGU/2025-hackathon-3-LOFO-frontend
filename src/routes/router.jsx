import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Layout } from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignUp from "../pages/Youth/SignUp/SignUp";
import Home from "../pages/Youth/Home/Home";
import NopoHome from "../pages/Nopo/NopoHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "auth/login-youth", element: <SignUp /> },
      //{ path: "auth/login-youth/nickname", element: <SignUpNickname /> },
      { path: "youth/home", element: <Home /> },
      //{ path: "youth/home/ai-mission", element: <SignUp /> },
      //{ path: "youth/mission/plan", element: <Plan /> },
      //{ path: "youth/mission/plan/perform", element: <Perform /> },
      //{ path: "youth/mypage", element: <MyPage /> },
      
      { path: "nopo", element: <NopoHome /> },
    ],
  },
]);

export default router;
