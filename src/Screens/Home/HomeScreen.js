import React, { useEffect } from "react";
import {
  Box,
  Container,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { URL,TOKEN_ADMIN } from '../../constant';
import  { useNavigate  } from 'react-router-dom';

import { useDispatch,useSelector } from 'react-redux';
import { setUserInfo,setToken, getToken } from "../../data/userData";
import { FETCH_API,FETCH_API_CLIENT } from "../../ultil/common";


const HomeScreen = () => {
  const [listUser, setListUser] = React.useState([]);
  const [valueChange,setValueChange] = React.useState('')
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  const handleChange = (event) => {
    setValueChange(event.target.value)
    checkUserExists(event.target.value);
  };

  useEffect(() => {
    fetchListUser();
  }, []);

  const fetchListUser = async () => {
    const uri = URL + `users`;
    await FETCH_API(uri,"GET")
    .then((ele)=>setListUser(ele.data.filter((e)=>e.uid !== "admin")));
  };

  const checkUserExists = async (uid) => {
    const uri = `${URL}users/${uid}`;

    // api này sẽ bỏ sau này khi có user gửi token qua
    await FETCH_API(uri,"GET")
    .then((ele)=>{
      if (ele !== null && ele) {
        dispatch(setUserInfo(ele));
        authenticatedUser(uid);
      }
    });
  }

  const authenticatedUser = async (uid) => {
    const uri = `${URL}user`;
    const tokenClient = token ? token : "wyu_1uiLZgHXlq62LpfBfScnElPhVDBZD818ouEt";
    await FETCH_API_CLIENT(uri,"GET",tokenClient)
    .then((ele) => {
      if (typeof ele !== "undefined" && ele) {
        navigate("/chat");
      }else{
        createToken(uid)
      }
    })
  }

  const createToken = async (uid) => {
    const uri = `${URL}users/${uid}/tokens`;
    await FETCH_API_CLIENT(uri,"POST",TOKEN_ADMIN)
    .then((ele) => {
      if (ele !== null && ele) {
        dispatch(setToken(ele.access_token));
        navigate("/chat");
      }
    })
  }

  const create_user_token = async (event) => {
    event.preventDefault();
    const uri = `${URL}users/${event.target[0].value}/tokens`;
    await FETCH_API(uri,"POST")
    .then((ele)=>{
      console.log('create TOKEN: ', ele);
      if (ele !== null && ele) {
        dispatch(setToken(ele.access_token));
      }
    });
  }
  
  return (
    <Container 
      style={{ 
        backgroundColor: "#39a26e",
        height:"100%",
        display:'flex',
        justifyContent:"center",
        alignItems:'center',
      }}
    >
      <Box sx={{ maxWidth: 250,}}>
        {listUser.length !== 0 ? 
          <>
            <Typography component="h4">Sign In</Typography>
            <FormControl sx={{maxWidth: 250,}} fullWidth>
              <InputLabel id="demo-simple-select-label">Uid</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valueChange}
                label="display_name"
                onChange={handleChange}
              >
                {listUser.map((ele)=>{
                  return (
                    <MenuItem key={ele.id} value={ele.uid}>{ele.display_name}</MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </>
          : null
        }
        <Box sx={{marginTop:10}}>
          <Typography component="h6" >Sign Up</Typography>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
            }}
            onSubmit={create_user_token}
          >
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
              }}
              placeholder="Enter your username (uid)"
              // inputProps={{ 'aria-label': 'search' }}
              // value={itemSearch ? "" : uid_Search }
              // onChange={onChange}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default HomeScreen;
