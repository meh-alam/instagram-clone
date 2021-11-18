// REDUCERS: are pretty simple they just store the state and get updated whenever they get actions

import {combineReducers} from 'redux'
import {user} from './user'

const Reducers= combineReducers({
    userState: user
})

export default Reducers;