import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA } from "../constants"

// everything that is connected to our user (user state variable)
const initialState = {
    currentUser: null,
    // it will contain all the user's posts
    posts: [],
    following: [],
}

// here actions will be calling upon the databse, fetching data and sending it to our reducer which will then update the state
export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }

        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state;
    }
}