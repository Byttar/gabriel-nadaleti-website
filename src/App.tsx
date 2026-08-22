import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "./Pages/Home";
import Header from "./components/header";
import PhotosPage from "./Pages/Photos";
import Footer from "./components/footer";
import PostsPage from "./Pages/Posts";
import PostPage from "./Pages/Post";
import SongsPage from "./Pages/Songs";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // "instant" prevents a jarring smooth transition animation
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

const BaseComponent = () => {
  return <>
    <Header/>
    <ScrollToTop/>
    <Outlet/>
    <Footer/>
  </>
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseComponent />,
    children: [
      { index: true, Component: Home },
      { path: "photos", element: <PhotosPage /> },
      { path: "photos/:photoid", element: <PhotosPage /> },
      { path: "songs", element: <SongsPage /> },
      { path: "resume", element: <Home /> },
      { path: "posts", element: <PostsPage /> },
      { path: "posts/:slug", element: <PostPage /> },
    ],
  },
]);

function App() {
  return (
    <section className='p-6 md:p-0 flex-col bg-black h-lvh w-full max-w-230 m-auto flex items-start'>
      <RouterProvider router={router} />
    </section>
  )
}

export default App
