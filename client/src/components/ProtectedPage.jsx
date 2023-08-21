import React, { useState, useEffect } from "react";
import { GetCurrentUser } from "../api/user";
import { message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { setLoading } from "../redux/loaderSlice";
import { GetAllMovies } from "../api/movie";
import SearchBar from "./SearchBar";

const ProtectedPage = ({ children }) => {
  //States
  const [filters, setFilters] = useState({
    search: "",
  });

  // Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from redux store
  const { user } = useSelector((state) => state.user);

  // Handlers
  const getCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetCurrentUser();
      dispatch(setLoading(false));
      dispatch(setUser(response.data));
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  // Effects
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getCurrentUser();
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row justify-between items-center p-5 gap-5 shadow-lg max-w-[1640px] mx-auto">
        {/* Title */}
        <div
          className="text-xl font-bold hidden sm:block cursor-pointer text-white bg-primary py-2 px-5 rounded-lg"
          onClick={() => navigate("/")}>
          filmScore
        </div>
        {/* Search bar */}
        <div className="flex items-center w-full lg:w-[700px]">
          <SearchBar filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex flex-row items-center gap-5">
          {/* Logout Button */}
          <i
            className="ri-logout-box-r-line cursor-pointer text-xl"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}></i>
          {/* User */}
          <div
            className=" items-center gap-2 hidden sm:flex cursor-pointer"
            onClick={() => navigate("/profile")}>
            <div className=" bg-primary px-3 py-3 rounded-md text-white">{user?.name}</div>
          </div>
          {user?.isAdmin && (
            <div
              className=" items-center gap-2 hidden sm:flex cursor-pointer"
              onClick={() => navigate("/admin")}>
              <div className="mr-2 bg-primary px-3 py-3 rounded-md text-white">Admin</div>
            </div>
          )}
        </div>
      </div>

      {user && <div className="p-5  max-w-[1640px] mx-auto">{children}</div>}
    </div>
  );
};

export default ProtectedPage;
