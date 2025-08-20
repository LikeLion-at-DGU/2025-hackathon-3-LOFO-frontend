import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Layout } from "../App";

//Onboarding
import Onboarding from "../pages/Onboarding/Onboarding";

//Youth
import YouthSignUp from "../pages/Youth/YouthSignUp/YouthSignUp";
import YouthSignUpNickname from "../pages/Youth/YouthSignUp/YouthSignUpNickname";

import YouthHome from "../pages/Youth/Home/YouthHome";
import YouthHomeAI from "../pages/Youth/Home/YouthHomeAI";
import MissionEditor from "../pages/Youth/Mission/MissionEditor";
import MissionPlan from "../pages/Youth/Mission/MissionPlan";
import YouthMyPage from "../pages/Youth/MyPage/YouthMyPage";

//Nopo
import NopoSignUp from "../pages/Nopo/NopoSignUp/NopoSignUp";
import NopoSignUpNickname from "../pages/Nopo/NopoSignUp/NopoSignUpNickname";

import NopoHome from "../pages/Nopo/Home/NopoHome";
import Request from "../pages/Nopo/Request/Request";
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

      //Onboarding
      { index: true, element: <Onboarding /> },

      //Youth
      { path: "auth/login-youth", element: <YouthSignUp /> },
      { path: "auth/login-youth/nickname", element: <YouthSignUpNickname /> },

      { path: "youth/home", element: <YouthHome /> },
      { path: "youth/home/ai", element: <YouthHomeAI /> },

      { path: "youth/mission", element: <MissionEditor /> },
      { path: "youth/mission/plan", element: <MissionPlan /> },

      { path: "youth/mypage", element: <YouthMyPage /> },

      //Nopo
      { path: "auth/login-nopo", element: <NopoSignUp /> },
      { path: "auth/login-nopo/nickname", element: <NopoSignUpNickname /> },

      { path: "nopo/home", element: <NopoHome /> },
      { path: "nopo/request", element: <Request /> },
      { path: "nopo/request/create", element: <RequestCreate /> },
      { path: "nopo/request/edit", element: <RequestEdit /> },
      { path: "nopo/received", element: <Received /> },
      { path: "nopo/received/feedback", element: <ReceivedFeedback /> },

      { path: "lofo/community", element: <Community /> },
    ],
  },
]);

export default router;
