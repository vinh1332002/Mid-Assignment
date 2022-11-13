import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Components/Css/button.css";
import { Category } from "@mui/icons-material";
import jwt_decode from "jwt-decode";

function UpdateBooks() {
  const navigate = useNavigate();

  let token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);

  const handleBackToList = () => {
    navigate(`/book`);
  };

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState([]);

  const [book, setBook] = useState({
    title: "",
    categoryId: "",
  });

  useEffect(() => {
    axios({
      method: "GET",
      url: `https://localhost:7233/api/book/detail/${id}`,
      data: null,
    })
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `https://localhost:7233/api/category`,
      data: null,
    })
      .then((data) => {
        console.log(data.data);
        setCategory(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    axios({
      method: "put",
      url: `https://localhost:7233/api/book/${data.bookId}`,
      data: {
        title: book.title,
        categoryId: book.categoryId,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    handleBackToList();
  };

  const handleChange = (event) => {
    setBook({
      ...book,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <h1>Update book {book.title}:</h1>
      {decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] === "SuperAdmin" && (
        <form onSubmit={handleOnSubmit}>
          <div>
            <label>
              Title name:
              <input
                type="text"
                onChange={handleChange}
                defaultValue={data.title}
                name="title"
                required
              ></input>
            </label>
          </div>

          <div>
            <label>
              Category Id:
              <select onChange={handleChange} name="categoryId">
                {category.map((option) => (
                  <option value={option.categoryId}>{option.categoryId}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <button class="submitButton" value={data.bookId} type="submit">
              Submit
            </button>
            <button
              class="backButton"
              onClick={handleBackToList}
              variant="secondary"
              type="reset"
            >
              Back to Post Page
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpdateBooks;
