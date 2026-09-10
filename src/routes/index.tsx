import { createBrowserRouter } from "react-router-dom";

import MangaPage from '../pages/MangaPage'
import MangaDetailPage from "../pages/MangaDetailPage";
import ReaderPage from "../pages/ReaderPage";

const router = createBrowserRouter([
    {
        path:'/manga',
        element:<MangaPage/>
    },
    {
        path:'/manga/:mangaId',
        element:<MangaDetailPage/>
    },
    {
        path:'/manga/:mangaId/chapter/:chapterId',
        element:<ReaderPage/>
    }
])

export default router