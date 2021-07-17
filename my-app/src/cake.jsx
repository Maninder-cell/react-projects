import React, { useState } from "react";
import buycake, { buyice } from "./redux/action";
import { useSelector, useDispatch } from "react-redux";

function Cake() {
  const cakes = useSelector((state) => state.cake.totalcake);
  const check = useSelector((state, ownProp) => {
    const x = ownProp.cake ? state.cake.totalcake : state.ice.totalice;
    return {
      item: x,
    };
  });
  const ice = useSelector((state) => state.ice.totalice);

  const [num, setnum] = useState(1);

  const dispatch = useDispatch();

  return (
    <div>
      <h3>{check}</h3>
      <h1>No of cakes {cakes.item}</h1>
      <input type="number" onChange={(e) => setnum(e.target.value)} />
      <button onClick={() => dispatch(buycake(num))}>Buy {num} Cake</button>
      <h1>No of ice {ice}</h1>
      <button onClick={() => dispatch(buyice())}>Buy ice</button>
    </div>
  );
}

/*const mapStateToProps = (state) => {
  return {
    totalcake: state.totalcake,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    buycake: () => dispatch(buycake()),
  };
};*/

export default Cake; /*connect(mapStateToProps, mapDispatchToProps)(cake);*/
