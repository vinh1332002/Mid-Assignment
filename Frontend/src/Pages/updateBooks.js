import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Components/Css/button.css";
import jwt_decode from "jwt-decode";
import AxiosClient from "../Components/axiosClient";

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

  const getOneBook = async () => {
    let response = await AxiosClient.get(`/book/detail/${id}`);
    setData(response.data);
  };


  useEffect(() => {
    getOneBook();
  }, []);

  const getCategory = async () => {
    let response = await AxiosClient.get("/category");
    setCategory(response.data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const updateABooks = async () => {
    const info = {
      title: book.title,
      categoryId: book.categoryId
    };
    await AxiosClient.put(`/book/${data.bookId}`, info);
  };

  const getAllBooks = async () => {
    let response = await AxiosClient.get("/book");
    setBook(response.data);
  };

  const handleOnSubmit = (evt) => {
    updateABooks();
    getAllBooks();
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
