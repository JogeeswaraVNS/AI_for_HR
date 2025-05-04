import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeLayout from "./homelayout/HomeLayout";
import HomePage from "./homepage/HomePage";
import EmployeeCategory from "./employeecategory/EmployeeCategory";
import Upload from "./upload/Upload";
import Customize from "./customize/Customize";
import Customize_Stream from "./customize_stream/Customize_Stream";
import DASS_Assesment from "./DASS/DASS_Assesment";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/upload",
          element: <Upload />,
        },
        {
          path: "/employeecategory",
          element: <EmployeeCategory />,
        },
        {
          path: "/customize",
          element: <Customize />,
        },
        {
          path: "/dass",
          element: <DASS_Assesment />,
        },
      ],
    },
  ]);

  return (
    <div className="App ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
