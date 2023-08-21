import { Button, Table } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArtistsForm from "./ArtistsForm";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/loaderSlice";
import { GetAllArtists, DeleteArtist } from "../../../api/artists";
import { getDateFormat } from "../../../helpers/helper";

const Artists = () => {
  // States
  const [artists, setArtists] = useState([]);
  // Variables
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handlers
  const getArtists = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetAllArtists();
      setArtists(response.data);
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  const deleteArtists = async (id) => {
    try {
      dispatch(setLoading(true));
      const response = await DeleteArtist(id);
      message.success(response.message);
      getArtists();
      dispatch(setLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  // Effects
  useEffect(() => {
    getArtists();
  }, []);

  // Table Columns
  const columns = [
    {
      title: "Artist",
      dataIndex: "profile",
      render: (text, record) => {
        const imageUrl = record?.images?.[0] || "";
        return <img src={imageUrl} alt="" className="w-20 h-25 rounded " />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      render: (text, record) => {
        return getDateFormat(text);
      },
    },
    {
      title: "Debut Year",
      dataIndex: "debutYear",
    },
    {
      title: "Profession",
      dataIndex: "profession",
    },
    {
      title: "Debut Movie",
      dataIndex: "debutMovie",
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
                navigate(`/admin/artists/edit/${record._id}`);
              }}
            ></i>
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteArtists(record._id);
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
        <Button onClick={() => navigate("/admin/artists/add")}>
          Add Artists
        </Button>
      </div>

      <div className="mt-5">
        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={artists}
            rowKey={(record) => record._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Artists;
