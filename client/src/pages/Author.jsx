import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loader from '../components/Loader'


const Author=()=> {
 const[authors, setAuthors]= useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() =>{
    const getAuthors = async () =>{
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    getAuthors();
  }, [])

  if(isLoading){
    return <Loader/>
  }

  return (
    <section className='authors'>
      {authors.length > 0 ? <div className='container author_container'>
        {
          authors.map(({_id: id, avtar, name, posts})=>{
              return <Link key={id} to={`/posts/users/${id}`} className='author'>
                <div className="author_avtar">
                  <img src={`${process.env.REACT_APP_BASE_URL}/uploads/${avtar}`} alt={`Image of ${name}`} />
                </div>
                <div className='author_info'>
                  <h4>{name}</h4>
                  <p>{posts}</p>
                </div>
              </Link>
          })
        }
      </div> : <h2 className='center'>No User/Author Found.</h2>}
    </section>
  )
}

export default Author