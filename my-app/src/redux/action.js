import {BUY_CAKE} from "./actionType"
import {BUY_ICE} from "./actionType"

function buycake(number = 1){
    return {
        type : BUY_CAKE,
        payload : number
    }
}

function buyice(){
    return {
        type : BUY_ICE
    }
}

export default buycake;
export {buyice};