import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loader = () => (
    <FontAwesomeIcon
        icon={faSpinner}
        spin
        size="10x"
        style={{ color: '#37a3e6' }}
    />
)

export default Loader
