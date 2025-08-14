import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignUp from "../pages/SignUp/SignUp";


const router = createBrowserRouter([
  {
    path: "/", // 루트 경로
    element: <App />,
    children: [{ path: "/", element: <Onboarding /> },
               { path: "/signup/", element: <SignUp /> }
            ],
  },
]);

export default router;