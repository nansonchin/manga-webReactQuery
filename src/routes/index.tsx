import { createBrowserRouter } from "react-router-dom";

import MangaPage from "../pages/MangaPage";
import MangaDetailPage from "../pages/MangaDetailPage";
import ReaderPage from "../pages/ReaderPage";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MangaPage />,
      },
      {
        path: "/manga",
        element: <MangaPage />,
      },
      {
        path: "/manga/:mangaId",
        element: <MangaDetailPage />,
      },
      {
        path: "/manga/:mangaId/chapter/:chapterId",
        element: <ReaderPage />,
      },
    ],
  },
]);

export default router;
