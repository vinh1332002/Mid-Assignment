import { useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputModel from "../Components/Forms/input";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Hooks/authContext";
import axios from "axios";

const initialValues = {
    email: "",
    password: "",
    read: false,
  };
  
  const required = (value) => {
    if (value === null || value === undefined || value === "") {
      return "this field is required";
    }
    return "";
  };
  
  const minLength = (value, length) => {
    if (value.length < length) return `At least ${length} characters`;
    return "";
  };
  
  const getEmailError = (value) => {
    return (
      required(value)
    );
  };
  
  const getPasswordError = (value) => {
    return required(value) || minLength(value, 2);
  };

const Login = () => {
  let navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();

  const [status, setStatus] = useState();

  const login = () => {
    axios({
      method: "post",
      url: "https://localhost:7233/api/user/login",
      data: {
        userName: values.email,
        password: values.password
      }
      
    })
    .then((response) => {
      localStorage.setItem("access-token", response.data)
      console.log(response.data)
    })
    .then(() => {
      if(localStorage.getItem("access-token") !== null){
        setIsAuthenticated(true);
        navigate("/");
      }
    })
    .catch((error) => {
      if(error.response) {
        setStatus("Wrong username or password")
      }
    })
  };

  const [values, setValues] = useState(initialValues);

  const emailError = useMemo(() => {
    return getEmailError(values.email);
  }, [values.email]);

  const passwordError = useMemo(() => {
    return getPasswordError(values.password);
  }, [values.password]);

  const isFormValid = !emailError && !passwordError;

  const handleOnChange = (event) => {
    const newValues = {
      ...values,
      [event.target.name]:
        event.target.name === "read"
          ? event.target.checked
          : event.target.value,
    };
    setValues(newValues);
  };

  const avatarStyle = { backGroundColor: "#1bbd7e" };
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 400,
    margin: "20px auto",
  };
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <TextField
          value={values.email}
          onChange={handleOnChange}
          name="email"
          label="Username:"
          placeholder="Enter Username"
          error={emailError}
        />
        <TextField
          value={values.password}
          onChange={handleOnChange}
          name="password"
          label="Password:"
          placeholder="Enter Password"
          error={passwordError}
        />
        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" />}
          label="Remember me"
        />
        <Button
          //class="submitButton"
          type="button"
          disabled={!isFormValid}
          onClick={login}
          //color="primary"
          variant="contained"
          fullWidth
        >
          Sign in
        </Button>
        <h2 style={{color: '#d50000'}}>{status}</h2>
        <Typography>
          <Link href="#">Forgot password ?</Link>
        </Typography>
        <Typography>
          {" "}
          Do you have an account ?<Link href="#">Sign Up</Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
