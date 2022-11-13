import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Components/Css/button.css";
import jwt_decode from "jwt-decode"; 

function UpdateCategories() {
  const navigate = useNavigate();
  let token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);

  const handleBackToList = () => {
    navigate(`/category`);
  };

  const { id } = useParams();
  const [data, setData] = useState([]);

  const [category, setCategory] = useState({
    name: "",
  });

  useEffect(() => {
    axios({
      method: "GET",
      url: `https://localhost:7233/api/category/${id}`,
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

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    axios({
      method: "put",
      url: `https://localhost:7233/api/category/${data.categoryId}`,
      data: {
        name: category.name,
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
    setCategory({
      ...category,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <h1>Create category:</h1>
      {decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] === "SuperAdmin" && (
        <form onSubmit={handleOnSubmit}>
          <div>
            <label>
              Category name:
              <input
                type="text"
                onChange={handleChange}
                defaultValue={data.name}
                name="name"
                required
              ></input>
            </label>
          </div>
          <div>
            <button class="submitButton" type="submit">
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

export default UpdateCategories;
