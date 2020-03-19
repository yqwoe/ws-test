import React from "react";
import { connect } from "dva";
import {
  Layout,
  Input,
  Row,
  Col,
  Button,
  List,
  Card,
  Divider,
  notification
} from "antd";

import styles from "./IndexPage.css";

import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import Websocket from "react-websocket";
const { Header, Content } = Layout;

const { TextArea } = Input;

function IndexPage({ dispatch, websocket }) {
  const {
    ws,
    ws_uri,
    loading,
    heartbeat,
    heartbeat_loading,
    data,
    current_message,
    current_ws_uri
  } = websocket;
  let refWebSocket;
  const onUriChange = e => {
    dispatch({
      type: "websocket/changeUri",
      payload: {
        current_ws_uri: e.target.value
      }
    });
  };
  const openNotificationWithIcon = (type, title, message) => {
    notification[type]({
      message: title,
      description: message
    });
  };

  const enterLoading = () => {
    console.log(websocket);
    if (!current_ws_uri) {
      return openNotificationWithIcon("error", "连接错误", "清输入wss uri");
    }
    dispatch({
      type: "websocket/open",
      payload: {
        ws_uri: current_ws_uri,
        loading: true
      }
    });
  };

  const handleData = data => {
    const h = {
      title: `服务端: ${new Date().toLocaleString()}`,
      data: JSON.stringify(data)
    };
    dispatch({
      type: "websocket/messageSuccess",
      payload: {
        message: h
      }
    });

    const last = document.getElementById("footer_link");
    last.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpen = () => {
    console.log("websocke is open");
    dispatch({
      type: "websocket/open",
      payload: {
        ws: refWebSocket
      }
    });
  };

  const handleClose = () => {
    console.log("websocke is close");
    const h = {
      title: `服务端: ${new Date().toLocaleString()}`,
      data: "连接已关闭"
    };
    dispatch({
      type: "websocket/open",
      payload: {
        ws: undefined,
        ws_url: undefined,
        loading: false,
        heartbeat_loading: false,
        message: h
      }
    });
  };

  const sendMessage = message => {
    if (!current_message) {
      return openNotificationWithIcon(
        "error",
        "消息错误",
        "请输入要发送的消息"
      );
    }
    const h = {
      title: `你: ${new Date().toLocaleString()}`,
      data: JSON.stringify(current_message)
    };
    refWebSocket.sendMessage(current_message);
    dispatch({
      type: "websocket/messageSuccess",
      payload: {
        message: h
      }
    });
  };

  const onHeartbeatChange = e => {
    dispatch({
      type: "websocket/changeUri",
      payload: {
        heartbeat: e.target.value
      }
    });
  };

  const enterHeartbeat = () => {
    console.log(websocket);
    if (!ws) {
      return openNotificationWithIcon("error", "连接错误", "请连接ws");
    }

    if (!heartbeat) {
      return openNotificationWithIcon("error", "错误", "请输入心跳包");
    }
    dispatch({
      type: "websocket/hearbeat",
      payload: {
        ws: refWebSocket,
        heartbeat: heartbeat,
        heartbeat_loading: true
      }
    });
  };

  const handleMessage = e => {
    dispatch({
      type: "websocket/message",
      payload: {
        current_message: e.target.value
      }
    });
  };

  const onscroll = e => {
    console.log(e);
  };
  return (
    <div>
      <Layout>
        <Header>
          <h1>Webscoket-Test</h1>
        </Header>
        <Content>
          <br />
          <br />
          <Row gutter={32}>
            <Col span={10} order={4} offset={1}>
              <Row gutter={32}>
                <Col span={20}>
                  <TextArea
                    placeholder="ws://host:port?param=param1"
                    allowClear
                    onChange={onUriChange}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={enterLoading}
                  >
                    {loading ? "连接中" : "连接"}
                  </Button>
                </Col>
              </Row>
              <Divider
                orientation="left"
                style={{ color: "#333", fontWeight: "normal" }}
              ></Divider>
              <Row gutter={32}>
                <Col span={20}>
                  <TextArea
                    placeholder="心跳包 频率: 1次/5s"
                    allowClear
                    onChange={onHeartbeatChange}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    type="primary"
                    loading={heartbeat_loading}
                    onClick={enterHeartbeat}
                  >
                    {heartbeat_loading ? "发送中" : "发送"}
                  </Button>
                </Col>
              </Row>
              <Divider
                orientation="left"
                style={{ color: "#333", fontWeight: "normal" }}
              >
                发送消息
              </Divider>
              <Row>
                <TextArea
                  placeholder="消息"
                  allowClear
                  rows={20}
                  onChange={handleMessage}
                />
                <br />
                <Button type="primary" onClick={sendMessage}>
                  发送
                </Button>
              </Row>
            </Col>
            <Col span={12} order={8} offset={1}>
              <Divider
                orientation="left"
                style={{ color: "#333", fontWeight: "normal" }}
              >
                消息列表
              </Divider>
              <List
                bordered={true}
                itemLayout="horizontal"
                dataSource={data}
                size="small"
                className={styles.ant_list_scroll}
                renderItem={(item, index) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        title={item.title}
                        description={item.data}
                      />
                    </List.Item>
                  );
                }}
              >
                <div
                  id="footer_link"
                  style={{ float: "left", clear: "both" }}
                ></div>
              </List>
            </Col>
          </Row>
          {ws_uri && (
            <Websocket
              url={ws_uri}
              onMessage={handleData}
              onOpen={handleOpen}
              onClose={handleClose}
              reconnect={true}
              debug={true}
              ref={Websocket => {
                refWebSocket = Websocket;
              }}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
}

IndexPage.propTypes = {};

export default connect(({ websocket }) => ({
  websocket
}))(IndexPage);
