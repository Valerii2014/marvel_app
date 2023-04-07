
import img from "./error.gif"

const ErrorMessage = () => {
    return (
        <img src={img} alt="error" style={{display: 'block', width: 200, height: 250, 
                               objectFit: 'cover', margin: '0 auto'}}/>
    )
}

export default ErrorMessage;