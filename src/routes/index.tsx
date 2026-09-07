import { createBrowserRouter } from "react-router-dom";

import MangaPage from '../pages/MangaPage'
import MangaDetailPage from "../pages/MangaDetailPage";

const router = createBrowserRouter([
    {
        path:'/manga',
        element:<MangaPage/>
    },
    {
        path:'/manga/:id',
        element:<MangaDetailPage/>
    }
])

export default router