import {
  Form,
  Input,
  Modal,
  message,
  Tabs,
  Upload,
  Button,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import { antDValidationError } from "../../../helpers/helper";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { GetAllArtists } from "../../../api/artists";
import { AddMovie, GetMovieById, UpdateMovie } from "../../../api/movie";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { UploadImage } from "../../../api/image";

const MovieForm = () => {
  // States
  const [artists = [], setArtists] = useState([]);
  const [movie, setMovie] = useState();
  const [file, setFile] = useState(null);

  // Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // Handlers
  const getArtists = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllArtists();
      setArtists(
        response.data.map((artist) => ({
          label: artist.name,
          value: artist._id,
        }))
      );
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const getMovieById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await GetMovieById(id);
      response.data.releaseDate = moment(response.data.releaseDate).format(
        "YYYY-MM-DD"
      );
      response.data.cast = response.data?.cast?.map((artist) => artist._id);
      response.data.hero = response.data?.hero._id;
      response.data.heroine = response.data?.heroine._id;
      response.data.director = response.data?.director._id;
      setMovie(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(setLoading(true));
      let response;
      if (params?.id) {
        response = await UpdateMovie(params.id, values);
      } else {
        response = await AddMovie(values);
      }
      message.success(response.message);
      dispatch(setLoading(false));
      navigate("/admin");
    } catch (error) {
      dispatch(setLoading(false));
      message.error(error.message);
    }
  };

  const imageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(setLoading(true));
      const response = await UploadImage(formData);
      if (response.success) {
        const response2 = await UpdateMovie(movie._id, {
          ...movie,
          posters: [...(movie?.posters || []), response.data],
        });
        setMovie(response2.data);
        setFile(null);
      }
      dispatch(setLoading(false));
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(setLoading(true));
      const response = await UpdateMovie(movie._id, {
        ...movie,
        posters: movie?.posters?.filter((item) => item !== image),
      });

      dispatch(setLoading(false));
      message.success(response.message);
      setMovie(response.data);
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  // Effects
  useEffect(() => {
    getArtists();
  }, []);

  useEffect(() => {
    if (params?.id) {
      getMovieById(params.id);
    }
  }, [params?.id]);

  return (
    (movie || !params.id) && (
      <div>
        <h1 className="text-gray-600 text-xl font-semibold">
          {params?.id ? "Edit Movie" : "Add Movie"}
        </h1>
        <Tabs>
          <Tabs.TabPane tab="Details" key="1">
            <Form
              layout="vertical"
              className="flex flex-col gap-5"
              onFinish={onFinish}
              initialValues={params?.id ? movie : undefined}
            >
              {/* First Row */}
              <div className="grid grid-cols-3 gap-5">
                <Form.Item label="Name" name="name" rules={antDValidationError}>
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Release Date"
                  name="releaseDate"
                  rules={antDValidationError}
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  label="Age Restriction"
                  name="ageRestriction"
                  rules={antDValidationError}
                >
                  <Input type="number" />
                </Form.Item>
              </div>
              {/* Second Row */}
              <Form.Item label="Plot" name="plot" rules={antDValidationError}>
                <Input.TextArea />
              </Form.Item>
              {/* Third Row */}
              <div className="grid grid-cols-3 gap-5">
                <Form.Item label="Hero" name="hero" rules={antDValidationError}>
                  <Select options={artists} showSearch />
                </Form.Item>
                <Form.Item
                  label="Heroine"
                  name="heroine"
                  rules={antDValidationError}
                >
                  <Select options={artists} showSearch />
                </Form.Item>
                <Form.Item
                  label="Director"
                  name="director"
                  rules={antDValidationError}
                >
                  <Select options={artists} showSearch />
                </Form.Item>
              </div>
              {/* Fourth Row */}
              <div className="grid grid-cols-3 gap-5">
                <Form.Item
                  label="Genre"
                  name="genre"
                  rules={antDValidationError}
                >
                  <Select
                    options={[
                      { label: "Action", value: "Action" },
                      { label: "Comedy", value: "Comedy" },
                      { label: "Drama", value: "Drama" },
                      { label: "Fantasy", value: "Fantasy" },
                      { label: "Horror", value: "Horror" },
                      { label: "Mystery", value: "Mystery" },
                      { label: "Romance", value: "Romance" },
                      { label: "Thriller", value: "Thriller" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Language"
                  name="language"
                  rules={antDValidationError}
                >
                  <Select
                    options={[
                      { label: "English", value: "English" },
                      { label: "Chinese", value: "Chinese" },
                      { label: "Hindi", value: "Hindi" },
                      { label: "Spanish", value: "Spanish" },
                      { label: "Arabic", value: "Arabic" },
                      { label: "Russian", value: "Russian" },
                      { label: "Portuguese", value: "Portuguese" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Trailer"
                  name="trailer"
                  rules={antDValidationError}
                >
                  <Input />
                </Form.Item>
              </div>
              {/* Fifth Row */}
              <Form.Item label="Cast" name="cast" rules={antDValidationError}>
                <Select mode="tags" options={artists} />
              </Form.Item>
              {/* Sixth Row */}
              <div className="flex justify-end gap-5">
                <Button
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary">
                  Save
                </Button>
              </div>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!movie}>
            <div className="flex flex-wrap gap-5 mb-10">
              {movie?.posters?.map((image) => (
                <div
                  key={image}
                  className="flex gap-5 border border-dashed p-3"
                >
                  <img src={image} alt="" className="w-20 h-20 object-cover" />
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => {
                      deleteImage(image);
                    }}
                  ></i>
                </div>
              ))}
            </div>
            <Upload
              onChange={(info) => {
                setFile(info.file);
              }}
              beforeUpload={() => false}
              listType="picture"
            >
              <Button> Click here to upload</Button>
            </Upload>
            <div className="flex justify-end gap-5 mt-5">
              <Button
                onClick={() => {
                  navigate("/admin");
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  imageUpload();
                }}
              >
                Upload Now
              </Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
};

export default MovieForm;
