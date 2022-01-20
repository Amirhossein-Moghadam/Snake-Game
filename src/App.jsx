import React from "react";
import "./Styles/Style.css";
import Item from "./component/item/Item";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      food: this.getRandomCell(),
      segments: [this.getRandomCell()],
      speed: {
        x: 1,
        y: 0,
      },
      direction: "right",
      forbidden_direction: "left",
      buffered: null,
    };
  }

  handleKeyPress = (event) => {
    let direction = this.state.direction;
    let forbiddenDirection = this.state.forbidden_direction;

    switch (event.keyCode) {
      case 37:
        direction = "left";
        forbiddenDirection = "right";
        break;
      case 38:
        direction = "up";
        forbiddenDirection = "down";
        break;
      case 39:
        direction = "right";
        forbiddenDirection = "left";
        break;
      case 40:
        direction = "down";
        forbiddenDirection = "up";
        break;
      default:
    }

    if (
      direction !== this.state.direction &&
      direction !== this.state.forbidden_direction
    ) {
      this.setState(function (state, prop) {
        state.buffered = {
          direction: direction,
          speed: {
            x: direction === "right" ? 1 : direction === "left" ? -1 : 0,
            y: direction === "down" ? 1 : direction === "up" ? -1 : 0,
          },
          forbidden_direction: forbiddenDirection,
        };
        return null;
      });
    }
  };

  componentDidMount() {
    setInterval(() => {
      this.update();
    }, 200);

    document.addEventListener("keydown", this.handleKeyPress);
  }

  eat() {
    let head = this.state.segments[this.state.segments.length - 1];
    if (
      head.column === this.state.food.column &&
      head.row === this.state.food.row
    ) {
      return true;
    }
    return false;
  }

  endGame() {
    let head = this.state.segments[this.state.segments.length - 1];
    for (let i = 0; i < this.state.segments.length - 1; i++) {
      let segment = this.state.segments[i];
      if (head.column === segment.column && head.row === segment.row) {
        return true;
      }
    }
    return false;
  }

  update() {
    if (this.state.buffered !== null) {
      this.setState(function (state, props) {
        if (state.direction != state.buffered.direction) {
          state.direction = state.buffered.direction;
          state.speed = state.buffered.speed;
          state.forbidden_direction = state.buffered.forbidden_direction;
        }
        return null;
      });
    }
    let s = this.state.segments;
    let head = s[s.length - 1];
    let food = this.state.food;
    if (this.eat()) {
      food = this.getRandomCell();
      s.push(head);
    }
    s.shift();
    s.push(
      this.setOnBox({
        column: head.column + this.state.speed.x,
        row: head.row + this.state.speed.y,
      })
    );
    if (this.endGame()) {
      console.log("lose");
      s = [s[s.length - 1]];
      food = this.getRandomCell();
    }

    this.setState({
      segments: s,
      food: food,
      buffered: null,
    });
  }

  setOnBox(cell) {
    if (cell.column > 19) {
      cell.column = 0;
    } else if (cell.column < 0) {
      cell.column = 19;
    }

    if (cell.row > 19) {
      cell.row = 0;
    } else if (cell.row < 0) {
      cell.row = 19;
    }
    return cell;
  }

  getRandomCell() {
    return {
      column: Math.floor(Math.random() * 20),
      row: Math.floor(Math.random() * 20),
    };
  }

  draw() {
    let items = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (j === this.state.food.column && i === this.state.food.row) {
          items.push(<Item className="food" />);
        } else {
          items.push(<Item className="item" />);
        }
      }
    }

    for (let i = 0; i < this.state.segments.length; i++) {
      let segment = this.state.segments[i];
      items[segment.row * 20 + segment.column] = <Item className="snake" />;
    }
    return items;
  }

  render() {
    return <div className="box">{this.draw()}</div>;
  }
}

export default App;
