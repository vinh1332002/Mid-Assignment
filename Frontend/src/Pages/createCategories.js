import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Css/button.css";
import AxiosClient from "../Components/axiosClient";
import jwt_decode from "jwt-decode";

function CreateCategories() {
  let token = localStorage.getItem("access-token");
  const decoded = jwt_decode(token);

  // console.log(decoded);
  // console.log(
  //   decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
  // );

  const [category, setCategory] = useState({
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (evt) => {
    setCategory({
      ...category,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleBackToList = () => {
    navigate(`/category`);
  };

  const createNewCategory = async () => {
    const data = {
      name: category.name,
    };
    await AxiosClient.post("/category", data);
  };

  const handleOnSubmit = (evt) => {
    createNewCategory();

    setCategory({
      name: "",
    });
    handleBackToList();
  };

  return (
    <div>
      <h1>Create category:</h1>
      {decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "SuperAdmin" && (
        <form onSubmit={handleOnSubmit}>
          <div>
            <label>
              Category name:
              <input
                type="text"
                onChange={handleChange}
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

export default CreateCategories;
