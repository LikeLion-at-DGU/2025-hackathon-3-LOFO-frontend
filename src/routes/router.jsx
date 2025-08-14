import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignIn from "../pages/SignIn/SignIn";


const router = createBrowserRouter([
  {
    path: "/", // 루트 경로
    element: <App />,
    children: [{ path: "/", element: <Onboarding /> },
               { path: "/detail/", element: <SignIn /> }
            ],
  },
]);

export default router;