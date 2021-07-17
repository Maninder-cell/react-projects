const redux = require("redux");
const createstore = redux.createStore
const middleware = redux.applyMiddleware
const thunk = require("redux-thunk").default
const axios = require("axios")

const data = {
    loading : false,
    user : [],
    error : ""
}

const USER_REQUEST = "USER_REQUEST"
const USER_SUCCESS = "USER_SUCCESS"
const USER_FAIL = "USER_FAIL"

function request(){
    return {
        type : USER_REQUEST
    }
}

function success(user){
    return {
        type: USER_SUCCESS,
        payload : user
    }   
}

function failure(error){
    return {
        type : USER_FAIL,
        payload : error
    }
}

function reducer (state = data, action){
    switch (action.type) {
        case USER_REQUEST : return {
            ...state,
            loading : true
        }

        case USER_SUCCESS : return {
            loading : false,
            user : action.payload,
            error : ""
        }

        case USER_FAIL : return {
            loading : false,
            user : [],
            error : action.payload
        }
    }
}

const fetchuser = () => {
    return function(dispatch){
        dispatch(request())
        axios
        .get("http://dummy.restapiexample.com/api/v1/employees")
        .then(response => {
            dispatch(success(response.data.data.map((object) => object.employee_name)));
        })
        .catch(error => {
            dispatch(failure(error.message));
        })

    }
}

const store = createstore(reducer,middleware(thunk))
store.subscribe(() => console.log(store.getState()))
store.dispatch(fetchuser())