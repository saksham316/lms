import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import quizSlice from "./slices/Quiz/quizSlice";
import videoReducer from "./slices/Video/videoSlice";
import feedbackReducer from "./slices/Feedback/feedbackSlice";
import studyMaterialReducer from "./slices/StudyMaterial/studyMaterialSlice";

// ---------------------------------------------------------

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: `${process.env.REACT_APP_REDUX_PERSIST_SECRET_KEY}`,
      onError: (err) => {
        //console.log("Redux Persist Encryption Failed: ", err);
      },
    }),
  ],
  // if you do not want to persist this part of the state
  // blacklist: ["omitedPart"],
};

const reducer = combineReducers({
  auth: authReducer,
  course: courseReducer,
  quiz: quizSlice,
  video: videoReducer,
  feedback: feedbackReducer,
  studyMaterial: studyMaterialReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/resetReduxStoreData") {
    state = undefined;
    localStorage.clear();
    sessionStorage.clear();
  }
  return reducer(state, action);
};

// This ensures your redux state is saved to persisted storage whenever it changes
// we pass this to the store
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.REACT_APP_WORKING_ENVIRONMENT === "development"?true:false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

// ================================================== THE END ==================================================
