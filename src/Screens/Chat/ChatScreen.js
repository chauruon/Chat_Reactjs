import React,{ useEffect,useState }  from 'react';
import { URL } from '../../constant';
import {
  Box,
  Paper,
  IconButton,
  InputBase,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  MenuItem,
  Divider
} from '@mui/material';

import { ChatList,MessageList,Input,Button } from "react-chat-elements";

import { useSelector } from 'react-redux';
import { getUserInfo,getToken } from "../../data/userData";
import { Search } from '@mui/icons-material';
import { Container } from '@mui/system';
import {  FETCH_API_CLIENT } from '../../ultil/common';
import { TOKEN_ADMIN } from '../../constant';

const ChatScreen = () => {
  const userInfo = useSelector(getUserInfo);
  // console.log("🚀 ~ file: ChatScreen.js ~ line 30 ~ ChatScreen ~ userInfo", userInfo)
  const token = useSelector(getToken);
  // console.log("🚀 ~ file: ChatScreen.js ~ line 31 ~ ChatScreen ~ token", token)

  const [listChat,setListChat] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [uid_Search,set_uidSearch] = useState("");
  const [data_Search,set_dataSearch] = useState(null);
  const [itemSearch,setItemSearch] = useState(false);

  const [spaceType,setSpaceType] = useState("Chat");
  
  const [inputChat,setInputChat] = useState("");
  useEffect(()=>{
      getAppID();
  },[]);

  const getAppID = async() => {
    if (userInfo.uid) {
      const uri_uid = `${URL}apps/${userInfo.uid}`;
      await FETCH_API_CLIENT(uri_uid,"GET",TOKEN_ADMIN)
      .then((ele) => {
        	// console.log("🚀 ~ file: ChatScreen.js ~ line 51 ~ .then ~ ele", ele)
        	if (ele !== null) {
            const resData = ele?.members;
          // [
          //   {
          //     avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
          //     alt: 'kursat_avatar',
          //     title: 'Kursat',
          //     subtitle: "Why don't we go to the No Way Home movie this weekend ?",
          //     date: new Date(),
          //     unread: 3,
          //   }
          // ]

          // listChat
          let newResult = [...listChat];
          if(newResult.length === 0){
            newResult = resData.map(item => {
              return {
                avatar: item.avatar_url,
                alt: item.uid,
                title: item.display_name,
                // subtitle:item.text,
                // date: item.created_at,
              };
            })
          }
          setListChat([ ...newResult ]);
          	GetMessages(ele);
        	}
        	return;
      })
    }
  }
  const GetMessages = async (dataEle) => {
    // console.log("🚀 ~ file: ChatScreen.js ~ line 116 ~ GetMessages ~ dataEle", dataEle)
    const uri = `${URL}apps/${dataEle.id}/messages`;

    await FETCH_API_CLIENT(uri,"GET",TOKEN_ADMIN)
      .then((ele) => {
        // console.log("Tin đã nhắn: ", ele)

        if (ele !== null && ele.count !== 0) {
          const resData = ele?.data;
          // [
          //   {
          //     avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
          //     alt: 'kursat_avatar',
          //     title: 'Kursat',
          //     subtitle: "Why don't we go to the No Way Home movie this weekend ?",
          //     date: new Date(),
          //     unread: 3,
          //   }
          // ]

          // listChat
          let newResult = [...listChat];
          if(newResult.length === 0){
            newResult = resData.map(item => {
              return {
                // avatar: item.avatar_url,
                // alt: item.uid,
                // title: item.uid,
                subtitle:item.text,
                date: item.created_at,
              };
            })
          }
          setListChat([ ...newResult ]);

          // messageList
          let newMessageList = [...messageList];
          if(newMessageList.length === 0){
            newMessageList = resData.map(item => {
              return {
                avatar: item.avatar_url,
                alt: item.uid,
                title: item.uid,
                text:item.text,
                date: item.created_at,
                position: userInfo.uid === item.uid? "right" : "left",
              };
            })
          }
          setMessageList([ ...newMessageList ]);
        }
      })
  }


  const sendMessgeButton = async()=>{
    createChatSpace();
  }
  const createChatSpace = async() => {
    if (userInfo.uid) {
      // console.log("🚀 ~ file: ChatScreen.js ~ line 65 ~ createChatSpace ~ userInfo", userInfo)
      
      const uri = `${URL}apps/init`;
      // const uri = `${URL}apps`;
      const data = {
        app:{
          type:spaceType,
          uid:userInfo.uid
        },
        user:{
          uid:data_Search.uid,
        }
      }
      // const data = {
      //   uid:"u2",
      //   type:spaceType,
      //   name:"ssss"
      // }
      // console.log(`createChatSpace data send: `,data);
      // console.log("🚀 ~ file: ChatScreen.js ~ line 85 ~ createChatSpace ~ token", token)
      await FETCH_API_CLIENT(uri,"POST",TOKEN_ADMIN,data)
      .then((ele)=>{
        console.log('get id message: ', ele);
        if (ele !== null) {
          createMesage(ele.id);
        }
        return;
      });
    }
  }

  const createMesage = async(id)=>{
    console.log('dataEle: ', id);
    // id is id message
    // const uri = `${URL}apps/${id}/messages`;
    const uri = `${URL}apps/${id}/messages`;

    const data = {
      text:inputChat
    }
    // console.log("🚀 ~ file: ChatScreen.js ~ line 106 ~ createMesage ~ TOKEN_ADMIN", token)
    await FETCH_API_CLIENT(uri,"POST",TOKEN_ADMIN,data)
      .then((ele)=>{
        if (ele !== null) {
          console.log('createMesage: ', ele);
        }
        return;
      });
  }

 
  

 

 

  const onSearchButton = async () => {
    if (uid_Search !== "") {
      const uri = `${URL}users/${uid_Search}`;
      await FETCH_API_CLIENT(uri,"GET",TOKEN_ADMIN)
      .then((ele)=>{
        // console.log('when click Search Button: ', ele);
        set_dataSearch(ele)
      })
    }
  };

  const onClickItemSearch = async () => {
    setItemSearch(true);
  };

  const onChange = (event) => {
    set_uidSearch(event.target.value);
  };


  return (
    <Box 
      sx={{
        display:"flex",
        flexDirection:'row',
        height:"100vh",
      }}>
      {/* list message */}
      <Paper 
      style={{
        flex: 2,
        display:"flex",
        flexDirection:'column',
        height:"100vh",
        overflow: 'auto',
        // backgroundColor:'#194d33'
      }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            // backgroundColor:"red",
            
          }}
        >
          <IconButton 
            onClick={onSearchButton}
            sx={{ p: '10px' }} aria-label="menu">
            <Search />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
            }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            value={itemSearch ? "" : uid_Search }
            onChange={onChange}
          />
        </Paper>
        {console.log(`listChat`,listChat)}
        <Box sx={{marginTop:0.5,}}>
          {data_Search !== null && !itemSearch ? 
            <MenuItem  sx={{width:"100%"}} onClick={onClickItemSearch}>
              {/* <Card sx={{display:"flex",width:"100%",flexDirection:'row',}}> */}
                <Box sx={{width:50,}}>
                  <Avatar src={data_Search.avatar_url}/>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 300,
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    {data_Search.uid}
                  </Typography>
                </Box>
              {/* </Card> */}
              <Divider />
            </MenuItem>
            :  <ChatList
            className='chat-list'
            dataSource={listChat} />
          }
        </Box>
      </Paper>
      {/* =============================================================================== */}



      {/* item message */}
      <Paper 
      style={{
        // backgroundColor:'#fef3bd',
        flex: 7,
        height:"100vh",
        overflow: 'auto',
      }}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar style={{marginRight:15}} src={itemSearch ? data_Search.avatar_url : userInfo.avatar_url}/>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {itemSearch ? data_Search.uid : userInfo.uid}
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Box 
        style={{
          backgroundColor:'#cfd3d1',
          height:"70vh",
        }}>
          <MessageList
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={messageList}
          />
        </Box>
        <Box 
        style={{
          height:"5vh",
          // backgroundColor:'#333200',
          display:"flex",
          flexDirection:'row',
          flex: 7,
        }}>
          <Box style={{width:"96%",}}>
            <Input
              minHeight="5vh"
              placeholder="Type here..."
              multiline={true}
              onChange={(e)=>{
                setInputChat(e.target.value);
              }}
              rightButtons={<Button  onClick={sendMessgeButton} color='white' backgroundColor='black' text='Send' />}
            />
          </Box>
        </Box>
      </Paper>
      {/* ====================================================================== */}
    </Box>
  )
}

export default ChatScreen