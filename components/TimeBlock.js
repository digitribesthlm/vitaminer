import PropTypes from 'prop-types'

function TimeBlock({ supplements, icon: Icon, bgColor, borderColor }) {
  // ... component code
}

TimeBlock.propTypes = {
  supplements: PropTypes.array.isRequired,
  icon: PropTypes.elementType.isRequired,
  bgColor: PropTypes.string.isRequired,
  borderColor: PropTypes.string.isRequired
}

export default TimeBlock
