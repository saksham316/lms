// ---------------------------------------------Imports--------------------------------------------------------
import { configureStore } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import courseReducer from "./slices/Course/courseSlice.js";
import videoReducer from "./slices/Video/videoSlice.js";
import chapterReducer from "./slices/Chapter/chapterSlice.js";
import quizReducer from "./slices/Quiz/quizSlice.js";
import authReducer from "./slices/Authentication/authenticationSlice.js";
import themeslice from "./slices/Theme/themeslice.js";
import categoryReducer from "./slices/Category/categorySlice.js";
import studyMaterialReducer from "./slices/StudyMaterial/studyMaterialSlice.js";
import publicAccessReducer from "./slices/PublicAccess/publicAccessSlice.js";
import metaDataReducer from "./slices/MetaData/metaDataSlice.js";
// ------------------------------------------------------------------------------------------------------------

// -------------------------------------------Store Config------------------------------------------

// persistConfig -- redux-persist configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  transforms: [
    encryptTransform({
      secretKey: `${process.env.REACT_APP_REDUX_PERSIST_SECRET_KEY}`,
      onError: (error) => {
        console.log("Redux Persist Encryption Failed: ", error);
      },
    }),
  ],
};

//reducer -- combines all the reducers
const reducer = combineReducers({
  course: courseReducer,
  video: videoReducer,
  chapter: chapterReducer,
  quiz: quizReducer,
  auth: authReducer,
  theme: themeslice,
  category: categoryReducer,
  publicAccess: publicAccessReducer,
  studyMaterial: studyMaterialReducer,
  metaData: metaDataReducer
});

// rootReducer -- function that is passed as the root reducer and checks for reseting the state
const rootReducer = (state, action) => {
  if (action.type === "auth/resetReduxStoreData") {
    state = undefined;
    localStorage.clear();
    sessionStorage.clear();
  }
  return reducer(state, action);
};

//persistedReducer -- this ensures that whenever redux state changes we store it in the persisted storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

//store -- configuring the redux store to store the state
const store = configureStore({
  reducer: persistedReducer,
  devTools:process.env.REACT_APP_WORKING_ENVIRONMENT === "development"?true:false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
// ------------------------------------------------------------------------------------------------------------
