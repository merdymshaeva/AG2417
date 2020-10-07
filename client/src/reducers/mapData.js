import { GET_DATA, PROMISE_FAILURE } from '../actions/mapAction';
const initialState = {
    url: null,
    data: null,
    error: null,
}

export default function mapData (state = initialState, action) {
    switch (action.type) {
        case GET_DATA:
            return {
                url: action.url,
                ...state,
                data: action.data
            }
        case PROMISE_FAILURE:
            return {
                ...state,
                error: action.error
            }
        default: 
            return state
    }
}