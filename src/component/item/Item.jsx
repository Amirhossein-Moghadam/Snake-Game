import React from "react";
import "../../Styles/Style.css";

const Item = (props) => {
  return <div className={props.className}>{props.children}</div>;
};

export default Item;
