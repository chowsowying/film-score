import React, { useState, useEffect } from "react";
import { Form, Input, Modal, message, Tabs, Upload, Button } from "antd";
import { antDValidationError } from "../../../helpers/helper";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { AddArtist, UpdateArtist, GetArtistById } from "../../../api/artists";
import moment from "moment";
import { UploadImage } from "../../../api/image";
import { useNavigate, useParams } from "react-router-dom";

const ArtistsForm = () => {
  // States
  const [artists, setArtists] = useState();
  const [file, setFile] = useState(null);

  // Variables
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const getArtistsById = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await GetArtistById(id);
      setArtists(response.data);
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
        response = await UpdateArtist(params.id, values);
      } else {
        response = await AddArtist(values);
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
        const response2 = await UpdateArtist(params.id, {
          ...artists,
          images: [...(artists?.images || []), response.data],
        });
        setArtists(response2.data);
        setFile(null); // Clear the selected file
        window.location.reload(); // Refresh the page
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
      const response = await UpdateArtist(params.id, {
        ...artists,
        images: artists?.images?.filter((item) => item !== image),
      });
      setArtists(response.data);
      dispatch(setLoading(false));
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  // Convert date
  if (artists) {
    artists.dob = moment(artists.dob).format("YYYY-MM-DD");
  }

  useEffect(() => {
    if (params?.id) {
      getArtistsById(params.id);
    }
  }, [params?.id]);

  return (
    (artists || !params.id) && (
      <div>
        <h1 className="text-gray-600 text-xl font-semibold">
          {params?.id ? "Edit Artists" : "Add Artists"}
        </h1>

        <Tabs>
          <Tabs.TabPane tab="Details" key="1">
            <Form
              layout="vertical"
              className="flex flex-col gap-5"
              onFinish={onFinish}
              initialValues={params?.id ? artists : undefined}
            >
              <Form.Item label="Name" name="name" rules={antDValidationError}>
                <Input />
              </Form.Item>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item label="DOB" name="dob" rules={antDValidationError}>
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  label="Debut Year"
                  name="debutYear"
                  rules={antDValidationError}
                >
                  <Input type="number" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  label="Profession"
                  name="profession"
                  rules={antDValidationError}
                >
                  <select>
                    <option value="">Select</option>
                    <option value="Actor">Actor</option>
                    <option value="Actress">Actress</option>
                    <option value="Director">Director</option>
                    <option value="Producer">Producer</option>
                    <option value="Music Director">Music Director</option>
                    <option value="Singer">Singer</option>
                    <option value="Lyricist">Lyricist</option>
                    <option value="Cinematographer">Cinematographer</option>
                    <option value="Editor">Editor</option>
                  </select>
                </Form.Item>
                <Form.Item
                  label="Debut Movie"
                  name="debutMovie"
                  rules={antDValidationError}
                >
                  <Input type="text" />
                </Form.Item>
              </div>
              <Form.Item label="Bio" name="bio" rules={antDValidationError}>
                <Input.TextArea />
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
          <Tabs.TabPane tab="Images" key="2" disabled={!artists}>
            <div className="flex flex-wrap gap-5 mb-10">
              {artists?.images?.map((image) => (
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
                // Retrieve the selected file
                const fileList = [...info.fileList];
                setFile(fileList.length > 0 ? fileList[0].originFileObj : null);
              }}
              beforeUpload={() => false}
              listType="picture"
            >
              <Button>Click here to upload</Button>
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

export default ArtistsForm;
