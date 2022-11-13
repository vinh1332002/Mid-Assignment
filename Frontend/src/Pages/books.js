import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Space, Table } from "antd";
import "../Components/Css/button.css";
import jwt_decode from "jwt-decode";

const { Column, ColumnGroup } = Table;

function Books() {
  let token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);

  const [book, setBook] = useState([]);

  const navigate = useNavigate();

  const handleUpdate = (id) => {
    navigate(`/book/update/${id}`);
  };

  const handleAdd = () => {
    navigate(`/book/create`);
  };

  const handleDelete = (id) => {
    var checkingDelete = window.confirm(
      `Do you want to delete book with id: ${id}`
    );
    if (checkingDelete) {
      axios({
        method: "delete",
        url: `https://localhost:7233/api/book/${id}`,
      })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      window.location.reload();
    }
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "https://localhost:7233/api/book",
      data: null,
    })
      .then((data) => {
        setBook(data.data);
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Post book page:</h1>

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
          <Table dataSource={book} pagination={{ pageSize: 10 }} key="1">
            <Column
              title="Book Id"
              dataIndex="bookId"
              sorter={(a, b) => a.bookId - b.bookId}
              key={book.bookId}
            />
            <Column title="Title" dataIndex="title" key={book.title} />
            <ColumnGroup title="Category">
              <Column
                //filteredValue={book.category.categoryId}
                title="Category Id"
                //dataIndex="category"
                key={book.categoryId}
                render={(_, record) => <p>{record.category.categoryId}</p>}
              />
              <Column
                //dataSource={book.category}
                title="Category Name"
                //dataIndex="name"
                key={book.name}
                render={(_, record) => <p>{record.category.name}</p>}
              />
            </ColumnGroup>
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
                      onClick={() => handleUpdate(record.bookId)}
                    >
                      Edit {record.firstName}
                    </button>
                    <button
                      class="deleteButton"
                      value={record.bookId}
                      onClick={() => handleDelete(record.bookId)}
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

export default Books;
