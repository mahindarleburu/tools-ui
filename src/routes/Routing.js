import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Utm from "../components/utm/Utm";
import Layout from "../components/layouts/Layout";
import Login from "../components/login/Login";
import { auth, createUserDocumentFromAuth } from "../utils/firebase";
import QrCode from "../components/qrcode/QrCode";
import Loading from "../components/loading/Loading";
import SourceMediumMapping from "../components/SourceMediumMapping/SourceMediumMapping";
import ManageOnelink from "../components/ManageOnelink/ManageOnelink";
import { compareAsc, format } from "date-fns";
import ManageSources from "../components/ManageSource/ManageSource";
import ManageMediums from "../components/ManageMedium/ManageMedium";
import ManageUtm from "../components/Admin/ManageUtm/ManageUtm";
import { listUserSelector } from "../components/Admin/Users/UsersSlice";
import { useSelector } from "react-redux";
import AccessDenied from "../components/Admin/AccessDenied/AccessDenied";
import NotFound from "../components/Admin/NotFound/NotFound";
import Users from "../components/Admin/Users/Users";
import RedirectComponent from "../components/RedirectComponent/RedirectComponent";
import ShortUrl from "../components/shorturl/ShortUrl";

const Routing = () => {
  const [currentUser, setCurrentUser] = useState("loading");
  const { user } = useSelector(listUserSelector);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const lastLoginAt = sessionStorage.getItem("lastLoginAt");
        if (lastLoginAt) {
          const currentDate = format(new Date(), "yyyy-MM-dd");
          if (currentDate !== lastLoginAt) {
            sessionStorage.removeItem("lastLoginAt");
            sessionStorage.setItem("lastLoginAt", format(new Date(), "yyyy-MM-dd"));
            await createUserDocumentFromAuth(user);
          }
        } else {
          sessionStorage.setItem("lastLoginAt", format(new Date(), "yyyy-MM-dd"));
          await createUserDocumentFromAuth(user);
        }
        // ...
      } else {
        setCurrentUser(null);
        // navigate("/login");
        return;
      }
    });
  }, []);

  if (currentUser === "loading")
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={<Loading />}
          />
        </Routes>
      </BrowserRouter>
    );
  else if (currentUser) {
    return (
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/utm"
              element={<Utm />}
            />
            <Route
              path="/utm/:id"
              element={<Utm />}
            />
            <Route
              path="/qrcode"
              element={<QrCode />}
            />
            <Route
              path="/qrcode/:id"
              element={<QrCode />}
            />
            <Route
              path="/shorten-url"
              element={<ShortUrl />}
            />
            <Route
              path="/shorten-url/:id"
              element={<ShortUrl />}
            />
            <Route
              path="/manage-links"
              element={<ManageOnelink />}
            />
            {user.role === "super_admin" ? (
              <Route
                path="/manage-utm"
                element={<ManageUtm />}
              />
            ) : (
              <Route
                path="/manage-utm"
                element={<Loading />}
              />
            )}
            {user.role === "super_admin" ? (
              <Route
                path="/manage-users"
                element={<Users />}
              />
            ) : (
              <Route
                path="/manage-users"
                element={<Loading />}
              />
            )}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="*"
            element={<RedirectComponent />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
};

export default Routing;
