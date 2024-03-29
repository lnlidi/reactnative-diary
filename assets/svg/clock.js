import Svg, { Path } from 'react-native-svg'

const Clock = props => {
  return (
    <Svg
      width={props.size} height={props.size}
      viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        d='M16 14L12 12V7M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
        stroke={props.color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
      />
    </Svg>
  )
}
export default Clock
