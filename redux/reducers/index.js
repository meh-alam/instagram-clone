// REDUCERS: are pretty simple they just store the state and get updated whenever they get actions

import {combineReducers} from 'redux'
import {user} from './user'
import { users } from './users';

// collection of all the reducers that we have in our reducers folder
const Reducers= combineReducers({
    userState: user,
    usersState: users
})

export default Reducers;