import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';

function myRatings({value}) {
    const noOfStar = 5;
    const [ratings, setRatings] = useState(5);
    const [hover, setHover] = useState(0);

    const handleOnClick = (currentIndex)=> {
        setRatings(currentIndex);
    }

    const handleOnMouseMove = (currentIndex)=> {
        setHover(currentIndex);
    }

    const handleMouseLeave = ()=> {
        setHover(ratings)
    }


  return (
    <div className='star-rating'>
      {
        [...Array(noOfStar)].map((_, index)=> {
            const starIndex = index + 1;

            return (
                <FaStar key={starIndex} className={starIndex <=
                     (hover|| ratings ? 'text-[#fff700]': 'text-[#000000]')} 
                     onClick={()=> handleOnClick(starIndex)}
                     onMouseMove={()=> handleOnMouseMove(starIndex)}
                     onMouseLeave={handleMouseLeave} />
            )
        })
      }
    </div>
  )
}

export default myRatings
