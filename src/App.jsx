import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ContributorLayout from "./layouts/ContributorLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Resources from "./pages/Resources.jsx";
import Books from "./pages/Books.jsx";
import Blog from "./pages/Blog.jsx";
import Login from "./pages/Login.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ResourceValidation from "./pages/admin/ResourceValidation.jsx";
import Orders from "./pages/admin/Orders.jsx";
import BooksManagement from "./pages/admin/BooksManagement.jsx";
import Contributors from "./pages/admin/Contributors.jsx";
import BlogManagement from "./pages/admin/BlogManagement.jsx";
import BookValidation from "./pages/admin/BookValidation.jsx";
import ArticleValidation from "./pages/admin/ArticleValidation.jsx";

import ContributorDashboard from "./pages/contributor/Dashboard.jsx";
import MyResources from "./pages/contributor/MyResources.jsx";
import SubmitResource from "./pages/contributor/SubmitResource.jsx";
import MyBooks from "./pages/contributor/MyBooks.jsx";
import SubmitBook from "./pages/contributor/SubmitBook.jsx";
import MyArticles from "./pages/contributor/MyArticles.jsx";
import SubmitArticle from "./pages/contributor/SubmitArticle.jsx";

import ResourcesManagement from "./pages/admin/ResourcesManagement.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ressources" element={<Resources />} />
          <Route path="/livres" element={<Books />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Espace Admin — réservé au rôle admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="ressources" element={<ResourcesManagement />} />
<Route path="validation-ressources" element={<ResourceValidation />} />
          <Route path="validation-livres" element={<BookValidation />} />
          <Route path="validation-blog" element={<ArticleValidation />} />
          <Route path="commandes" element={<Orders />} />
          <Route path="livres" element={<BooksManagement />} />
          <Route path="contributeurs" element={<Contributors />} />
          <Route path="blog" element={<BlogManagement />} />
        </Route>

        {/* Espace Contributeur — réservé au rôle contributeur */}
        <Route
          path="/contributeur"
          element={
            <ProtectedRoute role="contributeur">
              <ContributorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ContributorDashboard />} />
          <Route path="mes-ressources" element={<MyResources />} />
          <Route path="soumettre" element={<SubmitResource />} />
          <Route path="mes-livres" element={<MyBooks />} />
          <Route path="soumettre-livre" element={<SubmitBook />} />
          <Route path="mes-articles" element={<MyArticles />} />
          <Route path="soumettre-article" element={<SubmitArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;