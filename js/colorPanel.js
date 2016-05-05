var StartButton = React.createClass({
  getInitialState: function() {
    return {isClicked: false};
  },
  handleClick: function() {
    return
  }
});


var HelloMessage = React.createClass({
  render: function() {
    return <h1>Hello World！</h1>;
  }
});

ReactDOM.render(
  <HelloMessage />,
  document.getElementById('demo')
);
