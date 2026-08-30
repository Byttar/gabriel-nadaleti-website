import { HashRouter, Outlet, useLocation, Routes, Route } from "react-router";
import Home from "./Pages/Home";
import Header from "./components/header";
import PhotosPage from "./Pages/Photos";
import Footer from "./components/footer";
import PostsPage from "./Pages/Posts";
import PostPage from "./Pages/Post";
import SongsPage from "./Pages/Songs";
import { useEffect } from "react";
import CareerPage from "./Pages/Career";

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
  return (
    <>
      <Header />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <section className="p-6 md:p-0 flex-col bg-black h-lvh w-full max-w-230 m-auto flex items-start">
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<BaseComponent />}>
            <Route index element={<Home />} />
            <Route path="photos" element={<PhotosPage />} />
            <Route path="photos/:photoid" element={<PhotosPage />} />
            <Route path="songs" element={<SongsPage />} />
            <Route path="resume" element={<Home />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/:slug" element={<PostPage />} />
            <Route path="career" element={<CareerPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </section>
  );
}

export default App
