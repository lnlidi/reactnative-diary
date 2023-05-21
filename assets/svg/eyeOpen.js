import Svg, { Path } from 'react-native-svg'

const EyeOpen = props => {
  return (
    <Svg
      width={props.size} height={props.size}
      viewBox='0 0 24 24'fill='none' xmlns='http://www.w3.org/2000/svg'
    >
      <Path
        fillRule='evenodd' clipRule='evenodd'
        d='M22 12.0002C20.2531 15.5764 15.8775 19 11.9998 19C8.12201 19 3.74646 15.5764 2 11.9998'
        stroke='#000000' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'
      />
      <Path
        fillRule='evenodd' clipRule='evenodd'
        d='M22 12.0002C20.2531 8.42398 15.8782 5 12.0005 5C8.1227 5 3.74646 8.42314 2 11.9998'
        stroke='#000000' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'
      />
      <Path
        d='M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z'
        stroke='#000000' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'
      />
    </Svg>
  )
}
export default EyeOpen