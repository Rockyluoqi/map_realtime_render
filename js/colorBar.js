/**
 * Created by Luoqi on 4/29/2016.
 */
var ColorBar = React.createClass({
  shouldComponentUpdate: function(nextProps,nextState) {
    return false;
  },
  render: function() {
    console.log('Render Color Bar Component');
    return (
      <ul>
        {this.props.colors.map(function(color){
          return (
            <li key={color.id}
                onmouseover={this.props.onColorHover.bind(null, color.id)}
                className={color.value}>
            </li>
          )
        }, this)}
      </ul>
    );
  }
});
