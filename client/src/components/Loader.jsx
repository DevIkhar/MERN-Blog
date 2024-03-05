import React from 'react'
import LoadingGif from '../images/LoadingGif.jpg'

const Loader = () => {
  return (
    <div className="loader">
        <div className="loader_image">
            <img src={LoadingGif} alt="Loader Image" />
        </div>
    </div>
  )
}

export default Loader