import { combineReducers } from 'redux';
import auth from './auth';
import navigation from './navigation';
import alerts from './alerts';
import register from './register';
import valueReducer from './mapData';

export default combineReducers({
  alerts,
  auth,
  navigation,
  register,
  mapData: valueReducer('GET_DATA',null)
});
