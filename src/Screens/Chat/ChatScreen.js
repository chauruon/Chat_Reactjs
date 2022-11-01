import React, { useEffect, useState } from "react";
import { URL } from "../../constant";
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
  Divider,
} from "@mui/material";

import { ChatList, MessageList, Input, Button } from "react-chat-elements";

import { useSelector } from "react-redux";
import { getUserInfo, getToken } from "../../data/userData";
import { Search, SettingsEthernetRounded } from "@mui/icons-material";
import { Container } from "@mui/system";
import { FETCH_API_CLIENT } from "../../ultil/common";
import { TOKEN_ADMIN } from "../../constant";
import UseWindowDimensions from "../../ultil/UseWindowDimensions";

const ChatScreen = () => {
  const userInfo = useSelector(getUserInfo);
  const token = useSelector(getToken);
  // console.log("🚀 ~ file: ChatScreen.js ~ line 30 ~ ChatScreen ~ userInfo", userInfo)
  // console.log("🚀 ~ file: ChatScreen.js ~ line 31 ~ ChatScreen ~ token", token)

  const [listChat, setListChat] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [uid_Search, set_uidSearch] = useState("");
  const [data_Search, set_dataSearch] = useState(null);
  const [itemSearch, setItemSearch] = useState(false);
  const [appId, setAppId] = useState(undefined);
  const [sendMessge, setSendMessge] = useState(false);

  const [spaceType, setSpaceType] = useState("Chat");
  const [inputChat, setInputChat] = useState("");

  const [members,setMembers] = useState([]);

  const { height, width } = UseWindowDimensions();

  useEffect(() => {
    getAppID();
  }, []);
  useEffect(() => {
    GetMessages(appId);
  }, [sendMessge]);

  const getAppID = async () => {
    if (userInfo.uid) {
      const uri_uid = `${URL}conversations`;

      await FETCH_API_CLIENT(uri_uid, "GET", token).then((ele) => {
        // console.log("🚀 ~ file: ChatScreen.js ~ line 51 ~ .then ~ ele", ele)
        if (ele !== null && ele.count !== 0) {
          const resData = ele?.data;
          // listChat
          let newResult = [...listChat];
          if (newResult.length === 0) {
            newResult = resData.map((item) => {
              return {
                avatar: item.avatar_url,
                alt: item.uid,
                title: item.display_name,
                subtitle: item?.last_message?.text,
                date: item?.last_message?.created_at,
                appId: item.id,
                is_pinned: item.is_pinned,
                is_unread: item.is_unread,
                type: item.type,
                member_ids: item.member_ids,
                last_message: item.last_message,
              };
            });
          }
          setListChat([...newResult]);
        }
        return;
      });
    }
  };

  const createdChatRoom = async () => {
    if (userInfo.uid) {
      const uri_uid = `${URL}conversations`;

      const data = {
        members:members
      }
      await FETCH_API_CLIENT(uri_uid, "POST", token, data).then((ele) => {
        if (ele !== null) {
          setItemSearch(false);
          createMesage(ele.id);
        }
      });
    }
  };

  const GetMessages = async (appId) => {
    const uri = `${URL}apps/${appId}/messages`;

    await FETCH_API_CLIENT(uri, "GET", token).then((ele) => {
      if (typeof ele !== "undefined" && ele?.count !== 0) {
        const resData = ele?.data;

        let newMessageList = [...messageList];
        newMessageList = resData.map((item) => {
          return {
            avatar: item?.created_by.avatar_url,
            alt: item?.created_by.uid,
            type: "text",
            title: item?.created_by.uid,
            text: item.text,
            date: item.created_at,
            position: userInfo.uid === item?.created_by.uid ? "right" : "left",
          };
        });
        setSendMessge(false);
        setMessageList([...newMessageList]);
      }
      return;
    });
  };

  const handleKeypress = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      setSendMessge(true);
      if (itemSearch) {
        createdChatRoom();
      }else{
        createMesage(appId);
      }
    }
  };

  const sendMessgeButton = async () => {
    setSendMessge(true);
    if (itemSearch) {
      await createdChatRoom();
    }else{
      await createMesage(appId);
    }
    await GetMessages(appId);
  };

  const createMesage = async (id) => {
    const uri = `${URL}apps/${id}/messages`;
    const data = {
      text: inputChat,
    };
    await FETCH_API_CLIENT(uri, "POST", token, data).then((ele) => {
      console.log('ele: ', ele);
      if (ele !== null) {
        setInputChat("");
      }
      return;
    });
  };

  const onClickItemChatList = async (e) => {
    setAppId(e.appId);
    GetMessages(e.appId);
  };

  const onSearchButton = async () => {
    if (uid_Search !== "") {
      const uri = `${URL}users/${uid_Search}`;
      await FETCH_API_CLIENT(uri, "GET", token).then((ele) => {
        // console.log('when click Search Button: ', ele);
        set_dataSearch(ele);
      });
    }
  };

  const onClickItemSearch = async () => {
    members[0] = data_Search.id;
    setMembers([...members]);
    setItemSearch(true);
  };

  const onChange = (event) => {
    set_uidSearch(event.target.value);
  };

  // console.log(`height`,height);
  const boxListMesage = height - 187;

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "row",
        // height:"100vh",
        height: height,
      }}
    >
      {/* list message */}
      <Paper
        style={{
          flex: 2,
          display: "flex",
          flexDirection: "column",
          height: height,

          // backgroundColor:'#194d33'
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            // backgroundColor:"red",
          }}
        >
          <IconButton
            onClick={onSearchButton}
            sx={{ p: "10px" }}
            aria-label="menu"
          >
            <Search />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
            }}
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            value={itemSearch ? "" : uid_Search}
            onChange={onChange}
          />
        </Paper>
        <Box sx={{ marginTop: 0.5 }}>
          {data_Search !== null && !itemSearch ? (
            <MenuItem sx={{ width: "100%" }} onClick={onClickItemSearch}>
              {/* <Card sx={{display:"flex",width:"100%",flexDirection:'row',}}> */}
              <Box sx={{ width: 50 }}>
                <Avatar src={data_Search.avatar_url} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 300,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  {data_Search.uid}
                </Typography>
              </Box>
              {/* </Card> */}
              <Divider />
            </MenuItem>
          ) : (
            <ChatList
              onClick={(e) => onClickItemChatList(e)}
              className="chat-list"
              dataSource={listChat}
            />
          )}
        </Box>
      </Paper>
      {/* =============================================================================== */}

      {/* item message */}
      <Paper
        maxWidth="xl"
        style={{
          backgroundColor: "#fef3bd",
          flex: 7,
          // height:"100vh",
          height: height,
        }}
      >
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar
                style={{ marginRight: 15 }}
                src={itemSearch ? data_Search.avatar_url : userInfo.avatar_url}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {itemSearch ? data_Search.uid : userInfo.uid}
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Box style={{backgroundColor: "#3eb4bd",height: boxListMesage,}}>
          <MessageList
            className="message-list"
            lockable={true}
            toBottomHeight={-200}
            dataSource={messageList}
          />
        </Box>

        {/* input message */}
        <Box 
        style={{
          height:50,
          backgroundColor: "#333200",
          display: "flex",
          flexDirection: "row",
          position: "relative",
          bottom: 0,
        }}>
          <Input
            minHeight="5vh"
            placeholder="Type here..."
            multiline={true}
            defaultValue={inputChat}
            onChange={(e) => {
              setInputChat(e.target.value);
            }}
            onKeyPress={handleKeypress}
            rightButtons={
              <Button
                onClick={sendMessgeButton}
                color="white"
                backgroundColor="black"
                text="Send"
              />
            }
          />
        </Box>
      </Paper>
      {/* ====================================================================== */}
    </Paper>
  );
};

export default ChatScreen;
