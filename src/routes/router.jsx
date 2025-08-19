import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Layout } from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignUp from "../pages/Youth/SignUp/SignUp";
import SignUpNickname from "../pages/Youth/SignUp/SignUpNickname";

import YouthHome from "../pages/Youth/Home/YouthHome";
import YouthHomeAI from "../pages/Youth/Home/YouthHomeAI";
import MissionEditor from "../pages/Youth/Mission/MissionEditor";
import MissionPlan from "../pages/Youth/Mission/MissionPlan";

import YouthMyPage from "../pages/Youth/MyPage/YouthMyPage";
import Portfolio from "../pages/Youth/MyPage/Portfolio/Portfolio";
import Growth from "../pages/Youth/MyPage/Growth/Growth";
import Activity from "../pages/Youth/MyPage/Activity/Activity";

import NopoHome from "../pages/Nopo/Home/NopoHome";
import RequestCreate from "../pages/Nopo/Request/RequestCreate";
import RequestEdit from "../pages/Nopo/Request/RequestEdit";
import Received from "../pages/Nopo/Received/Received";
import ReceivedFeedback from "../pages/Nopo/Received/ReceivedFeedback";

import Community from "../pages/Lofo/Community";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Onboarding /> },

      { path: "auth/login-youth", element: <SignUp /> },
      { path: "auth/login-youth/nickname", element: <SignUpNickname /> },
      { path: "youth/home", element: <YouthHome /> },
      { path: "youth/home/ai", element: <YouthHomeAI /> },

      { path: "youth/mission", element: <MissionEditor /> },
      { path: "youth/mission/plan", element: <MissionPlan /> },

      { path: "youth/mypage", element: <YouthMyPage /> },
      { path: "youth/mypage/portfolio", element: <Portfolio /> },
      { path: "youth/mypage/growth", element: <Growth /> },
      { path: "youth/mypage/activity", element: <Activity /> },

      { path: "nopo/home", element: <NopoHome /> },
      { path: "nopo/request/create", element: <RequestCreate /> },
      { path: "nopo/request/edit", element: <RequestEdit /> },
      { path: "nopo/received", element: <Received /> },
      { path: "nopo/received/feedback", element: <ReceivedFeedback /> },

      { path: "lofo/community", element: <Community /> },
    ],
  },
]);

export default router;
