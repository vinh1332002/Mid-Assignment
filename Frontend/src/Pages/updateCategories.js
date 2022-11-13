import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../Components/Css/button.css";
import jwt_decode from "jwt-decode"; 
import AxiosClient from "../Components/axiosClient";

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

  const getACategory = async (id) => {
    let response = await AxiosClient.get(`/category/${id}`);
    setData(response.data);
  };

  useEffect(() => {
    getACategory(id)
  }, []);

  const updateACategory = async () => {
    const info = {
      name: category.name
    };
    await AxiosClient.put(`/category/${data.categoryId}`, info);
  };

  const handleOnSubmit = (evt) => {
    updateACategory(); 
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
