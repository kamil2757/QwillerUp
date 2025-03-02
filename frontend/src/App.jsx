import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing.jsx";
import Login from "./pages/Login/Login.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import ChooseFormat from "./pages/ChooseFormat/ChooseFormat.jsx";
import CreateFormat1 from "./pages/CreateFormat1/CreateFormat1.jsx";
import CreateFormat2 from "./pages/CreateFormat2/CreateFormat2.jsx";
import HonorBoard from "./pages/HonorBoard/HonorBoard.jsx";
import Main from "./pages/Main/Main.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import SettingsProfile from "./pages/SettingsProfile/SettingsProfile.jsx";
import SettingsDonate from "./pages/SettingsDonate/SettingsDonate.jsx";
import SettingsTasks from "./pages/SettingsTasks/SettingsTasks.jsx";
import SettingsTasksFormat1 from "./pages/SettingsTasksFormat1/SettingsTasksFormat1.jsx";
import SettingsTasksFormat2 from "./pages/SettingsTasksFormat2/SettingsTasksFormat2.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute/PublicRoute.jsx";

import SettingsProgress from "./pages/SettingsProgress/SettingsProgress.jsx";
import UserContext, { UserProvider } from "./contexts/UserContext.jsx";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

import "./styles/global.scss";

function App() {
  const { authorized } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        <Routes>
          <Route element={<PublicRoute />}>
            <Route
              path={!authorized ? "/" : "/landing"}
              element={<Landing />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/choose-format" element={<ChooseFormat />} />
            <Route path="/create-format1" element={<CreateFormat1 />} />
            <Route path="/create-format2" element={<CreateFormat2 />} />
            <Route path="/honor-board" element={<HonorBoard />} />
            <Route path={!authorized ? "/main" : "/"} element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />}>
              <Route path="profile" element={<SettingsProfile />} />
              <Route path="tasks" element={<SettingsTasks />}>
                <Route path="format1" element={<SettingsTasksFormat1 />} />
                <Route path="format2" element={<SettingsTasksFormat2 />} />
              </Route>
              <Route path="progress" element={<SettingsProgress />} />
              <Route path="donate" element={<SettingsDonate />} />
            </Route>
          </Route>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
