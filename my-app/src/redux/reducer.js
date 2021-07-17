import {BUY_CAKE, BUY_ICE} from "./actionType";
import { combineReducers } from "redux";

const initialstate = {
    totalcake : 10,
    totalice : 20
}

function reducer (state = initialstate, action){
    switch (action.type) {
        case BUY_CAKE : return {
            ...state,
            totalcake : state.totalcake - action.payload
        }

        default : return state
    }
}

function reducerice(state = initialstate,action){
    switch (action.type){
        case BUY_ICE : return {
            ...state,
            totalice : state.totalice - 1
        }

        default : return state;
    }
}

const rootreducer = combineReducers({
    cake: reducer,
    ice: reducerice
})

export default rootreducer;