import * as service from "../services/example";
export default {
  namespace: "websocket",

  state: {
    data: [],
    heartbeat: undefined,
    message: {},
    loading: false,
    hearbeat_loading: false,
    current_message: undefined,
    ws_uri: undefined,
    current_ws_uri: undefined
  },

  subscriptions: {
    setup({ dispatch, history }) {}
  },

  effects: {
    *open({ payload }, { put, call }) {
      yield put({
        type: "openSuccess",
        payload: payload
      });
    },
    *hearbeat({ payload }, { put, call }) {
      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      do {
        const { heartbeat } = payload;
        const h = {
          title: `你: ${new Date().toLocaleString()}`,
          data: JSON.stringify(heartbeat)
        };
        yield call(service.send, payload.ws, JSON.parse(payload.heartbeat));
        yield put({
          type: "heartbeatSuccess",
          payload: { ...payload, heartbeat: h }
        });
        yield call(delay, 5000); // 延时300ms之后进行下一次的while循环执行
      } while (true);
    },
    *message({ payload }, { put, call }) {
      yield put({
        type: "openSuccess",
        payload: payload
      });
    }
  },

  reducers: {
    openSuccess(state, action) {
      //client_id:1
      return { ...state, ...action.payload };
    },
    messageAppend(state, action) {
      return { ...state, ...action.payload };
    },
    heartbeatSuccess(state, action) {
      // console.log(action);
      const { heartbeat } = action.payload;
      let { data } = state;
      return {
        ...state,
        ...action.payload,
        data: data.concat(heartbeat)
      };
    },
    messageSuccess(state, action) {
      // console.log(action);

      const { message } = action.payload;
      let { data } = state;
      return {
        ...state,
        ...action.payload,
        data: data.concat(message)
      };
    },
    changeUri(state, action) {
      console.log(state, action);
      return { ...state, ...action.payload };
    }
  }
};
