import {TextEditor} from "./components/TextEditor";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([{
   path: '/',
   element: <TextEditor />,
   children: [
      {
         path: 'documents/:routeID',
         element: <TextEditor />
      }
   ]
}
])
function App() {

   return <RouterProvider router={router}/>

}

export default App
