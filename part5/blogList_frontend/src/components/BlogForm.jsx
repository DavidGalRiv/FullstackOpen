import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        createBlog({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return(
        <form onSubmit = {handleSubmit}>
            <h3>Create new blog</h3>
            <div>
                title: <input value = {title} onChange = {({ target }) => setTitle(target.value)}/>
            </div>
            <div>
                author: <input value = {author} onChange = {({ target }) => setAuthor(target.value)}/>
            </div>
            <div>
                url: <input value = {url} onChange = {({ target }) => setUrl(target.value)}/>
            </div>
            <button type = "submit">Create</button>
        </form>
    )
}

export default BlogForm