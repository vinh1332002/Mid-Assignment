import React from "react";
import { Routes, Route, Link } from "react-router-dom";
//import Profile from "./pages/profile";
import Login from "./Pages/login";
//import Posts from "./Pages/Books";
import LayoutPage from "./Pages/layout";
import RequiredAuth from "./Components/requireAuth";
import AuthProvider from "./Hooks/authContext";
import Home from "./Pages/home";
import Logout from "./Pages/logout";
import Books from "./Pages/books";
import CreateBooks from "./Pages/createBooks";
import UpdateBooks from "./Pages/updateBooks";
import Categories from "./Pages/categories";
import CreateCategories from "./Pages/createCategories";
import UpdateCategories from "./Pages/updateCategories";
//import DetailPost from "./pages/detailPost";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<LayoutPage />}>
          <Route path="/book" element={<Books />} />
          <Route path="/category" element={<Categories />}/>
          <Route path="/category/create" element={<CreateCategories/>} />
          <Route path="/login" element={<Login />} />
          {/* <Route
            path="/profile"
            element={
              <RequiredAuth>
                <Profile />
              </RequiredAuth>
            }
          /> */}
          <Route path="/" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/book/create" element={<CreateBooks />} />
          <Route path="/book/update/:id" element={<UpdateBooks />} />
          <Route path="/category/update/:id" element={<UpdateCategories />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
