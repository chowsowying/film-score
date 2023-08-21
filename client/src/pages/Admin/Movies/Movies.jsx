import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { GetAllMovies, DeleteMovie } from "../../../api/movie";
import { getDateFormat } from "../../../helpers/helper";

const Movies = () => {
  // States
  const [movies, setMovies] = useState([]);
  // Variables
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handlers
  const getMovies = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllMovies();
      setMovies(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const deleteMovie = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteMovie(id);
      message.success(response.message);
      getMovies(); // Fetch the updated list of movies
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  // Effects
  useEffect(() => {
    getMovies();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Movie",
      dataIndex: "name",
      render: (text, record) => {
        const imageUrl = record?.posters?.[0] || "";
        return <img src={imageUrl} alt=" " className="w-40 h-25 rounded " />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text) => {
        return getDateFormat(text);
      },
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="ri-pencil-line"
              onClick={() => {
                navigate(`/admin/movies/edit/${record._id}`);
              }}
            ></i>
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteMovie(record._id);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={() => navigate("/admin/movies/add")}>Add Movie</Button>
      </div>

      <div className="mt-5">
        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={movies}
            rowKey={(record) => record._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Movies;
