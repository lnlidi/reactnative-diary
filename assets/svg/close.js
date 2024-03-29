import Svg, { Path } from "react-native-svg";

const Close = (props) => {
    return (
        <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M6 6L18 18M18 6L6 18" stroke='black' strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}
export default Close