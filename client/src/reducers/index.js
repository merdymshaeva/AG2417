import { combineReducers } from 'redux';
import auth from './auth';
import navigation from './navigation';
import alerts from './alerts';
import register from './register';
import valueReducer from './valueReducer';
import { mapStyle } from './mapStyle';
import mapData from './mapData';
import mapQuery from './mapQuery';

export default combineReducers({
  alerts,
  auth,
  navigation,
  register,
  mapData,
  mapStyle,
  mapQuery,
});
