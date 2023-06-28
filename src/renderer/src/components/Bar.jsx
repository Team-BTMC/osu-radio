import { clamp } from '../lib/tungsten/math';
import "../assets/css/bar.css";
const Bar = props => {
    return (<div class={'bar' + (props.alignment !== undefined ? ` ${props.alignment}` : "")} style={{ "--fill-per": clamp(0, 1, props.fill) * 100 + "%" }}>
      <div class="filling"></div>
    </div>);
};
export default Bar;
