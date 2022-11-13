import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table } from "antd";
import "../Components/Css/button.css";
import jwt_decode from "jwt-decode";
import AxiosClient from "../Components/axiosClient";

const { Column } = Table;

function Categories() {
  let token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);

  const [category, setCategory] = useState([]);

  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/category/update/${id}`);
  };

  const handleAdd = () => {
    navigate(`/category/create`);
  };

  const deleteABook = async (id) => {
    await AxiosClient.delete(`/category/${id}`);
  };

  const handleDelete = (id) => {
    var checkingDelete = window.confirm(
      `Do you want to delete category with id: ${id}`
    );
    if (checkingDelete) {
      deleteABook(id)
      window.location.reload();
    }
  };

  const getAllCategories = async () => {
    let response = await AxiosClient.get("/category");
    setCategory(response.data);
  };

  useEffect(() => {
    getAllCategories()
  }, []);

  return (
    <div>
      <h1>Post category page:</h1>
      <div>
        {decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] === "SuperAdmin" && (
          <div>
            <button class="createButton" onClick={handleAdd}>
              go to create post
            </button>
          </div>
        )}
        <div>
          <Table dataSource={category} pagination={{ pageSize: 10 }} key="1">
            <Column
              title="Category Id"
              dataIndex="categoryId"
              sorter={(a, b) => a.categoryId - b.categoryId}
              key="1"
            />
            <Column title="Category Name" dataIndex="name" key="2" />
            {decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] === "SuperAdmin" && (
              <Column
                title="Action"
                key="action"
                render={(_, record) => (
                  <Space size="middle">
                    <button
                      class="updateButton"
                      onClick={() => handleUpdate(record.categoryId)}
                    >
                      Edit {record.firstName}
                    </button>
                    <button
                      class="deleteButton"
                      value={record.categoryId}
                      onClick={() => handleDelete(record.categoryId)}
                    >
                      Delete
                    </button>
                  </Space>
                )}
              />
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
