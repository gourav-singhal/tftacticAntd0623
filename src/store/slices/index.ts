import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';
import nightModeReducer from '@app/store/slices/nightModeSlice';
import themeReducer from '@app/store/slices/themeSlice';
import pwaReducer from '@app/store/slices/pwaSlice';
import synergysReducer from "@app/store/slices/synergysSlice";
import itemsSliceReducer from "@app/store/slices/itemsSlice";
import teamCompsReducer from "@app/store/slices/teamCompsSlice";
import championsReducer from "@app/store/slices/championsSlice";

export default {
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  theme: themeReducer,
  pwa: pwaReducer,
  synergys: synergysReducer,
  items: itemsSliceReducer,
  teamcomps: teamCompsReducer,
  champions: championsReducer,
};
