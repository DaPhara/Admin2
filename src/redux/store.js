import { configureStore } from "@reduxjs/toolkit";
import sportclubReducer from "./feature/sportclubs/SportSlice";
import eventReducer from "./feature/events/EventSlice";
import contentReducer from "./feature/contents/ContentSlice";
import staticReducer from "./feature/static/StaticSlice";
import contactReducer from "./feature/contact/ContactSlice";
import userReducer from "./feature/users/UserSlice"

const store = configureStore({
  reducer: {
    sportclubs: sportclubReducer,
    event: eventReducer,
    content: contentReducer,
    static: staticReducer,
    contact: contactReducer,
    user: userReducer,
  },
});

export default store;
