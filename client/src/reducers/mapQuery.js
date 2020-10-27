import { SET_PARAMS, SET_URL } from '../actions/mapAction';
const initialState = {
    url: null,
    params: {
      minLength: null,
      maxLength: null,
      flowUrl: null,
      modes: [],
      demandType: null,
      weightPar: {},
      s1: null,
      s2: null,
      name_2: null
    }
}

export default function mapQuery(state = initialState, action) {
    switch (action.type) {
        case SET_PARAMS:
            return {
                ...state,
                params: {...state.params, ...action.value}
            }
        case SET_URL:
            return {
                ...state,
                url: action.value 
            }
        default:
            return state
    }
}
