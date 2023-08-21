import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages//Home";
import Register from "./pages//Register";
import Login from "./pages//Login";
import ProtectedPage from "./components/ProtectedPage";
import Profile from "./pages/Profile/Profile";
import Spinner from "./components/Spinner";
import { useSelector } from "react-redux";
import Admin from "./pages/Admin/Admin";
import MovieForm from "./pages/Admin/Movies/MovieForm";
import MovieInfo from "./pages/MovieInfo/MovieInfo";
import ArtistsInfo from "./pages/ArtistsInfo";
import ArtistsForm from "./pages/Admin/Artists/ArtistsForm";

function App() {
  // Get loading from redux store
  const { loading } = useSelector((state) => state.loaders);
  return (
    <>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedPage>
                <MovieInfo />
              </ProtectedPage>
            }
          />
          <Route
            path="/artist/:id"
            element={
              <ProtectedPage>
                <ArtistsInfo />
              </ProtectedPage>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/movies/add"
            element={
              <ProtectedPage>
                <MovieForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/movies/edit/:id"
            element={
              <ProtectedPage>
                <MovieForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/artists/add"
            element={
              <ProtectedPage>
                <ArtistsForm />
              </ProtectedPage>
            }
          />
          <Route
            path="/admin/artists/edit/:id"
            element={
              <ProtectedPage>
                <ArtistsForm />
              </ProtectedPage>
            }
          />
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
