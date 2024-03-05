import React from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'


 const PostItem = ({postID, thumbnail, category, title, description, authorID, createdAt}) =>{

    const shortDescription = description.lenght > 20 ? description.substr(0, 20) + '...' : description;
    const postTitle = title.lenght > 10 ? title.substr(0, 10) + '...' : title;


  return (

    <article className='post'>
        <div className="post_thumbnail">
            <img className='img' src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
        </div>
        <div className='post_content'>
            <Link to={`/posts/${postID}`}>
                <h3>{postTitle}</h3>
            </Link>
            {/* <p >{shortDescription}</p> */}
            <p className='desc' dangerouslySetInnerHTML={{__html: shortDescription } } />
            <div className='post_footer'>
                <PostAuthor authorID={authorID} createdAt={createdAt} />
                {/* <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link> */}
                <Link to={`/posts/${postID}`}>
                <h3>99 $</h3>
                </Link>
            </div>
        </div>
    </article>
  )
}

export default PostItem