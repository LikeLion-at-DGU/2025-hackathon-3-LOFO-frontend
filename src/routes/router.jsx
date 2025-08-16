import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import { Layout } from "../App";
import Onboarding from "../pages/Onboarding/Onboarding";
import SignUp from "../pages/SignUp/SignUp";
import NopoHome from "../pages/Nopo/NopoHome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "signup", element: <SignUp /> },
      { path: "nopo", element: <NopoHome /> },
    ],
  },
]);

export default router;
