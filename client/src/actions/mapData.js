import axios from "axios";

export function promiseAction(url, actionType) {
    /* action creator: returns an action but dispatches two more actions on the side -> asynchronous side effect */
    return (dispatch) => {
        console.log('promiseAction')
        axios.get(url)
            .then(data => dispatch({ type: actionType, value: data }))
            .catch(error => dispatch({ type: actionType, value: { error: error } }));
        return { type: actionType, value: { data: null } };
    }

}
