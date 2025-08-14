import { render, screen } from '@testing-library/react'
import {vi, test, expect, describe } from 'vitest'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog', () => {
    const blog = {
        title: 'My test blog',
        author: 'David GR',
        url: 'mytestblog.com',
        likes: 10,
        user:{
            username:'mluukkai',
            name:'Matti Luukkainen'
        }
    }

    const userLogged = { username: 'mluukkai', name: 'Matti Luukkainen' }

    test('renders title and author, but not url or likes by default', () => {
        render(<Blog blog={blog} />)

        const summary = screen.getByText(/My test blog David GR/i)
        expect(summary).toBeInTheDocument()

        const url = screen.queryByText(blog.url)
        expect(url).toBeNull

        const likes = screen.queryByText(/likes/i)
        expect(likes).toBeNull
    })

    test('renders URL and number of likes when the button controlling the shown details has been clicked', async () => {
        const mockLike = vi.fn()
        const mockDelete = vi.fn()

        render(
            <Blog 
              blog={blog}
              user={userLogged}
              onLike={mockLike}
              handleDelete={mockDelete}
            />
        )

        expect(screen.queryByText(blog.url)).toBeNull()
        expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()

        const userSim = userEvent.setup()
        const button = screen.getByText('view')
        await userSim.click(button)

        expect(screen.queryByText(blog.url)).toBeInTheDocument()
        expect(screen.queryByText(`likes ${blog.likes}`)).toBeInTheDocument()    
    })

    test('ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
        const mockLike = vi.fn()

        render(
            <Blog 
              blog={blog}
              user={userLogged}
              onLike={mockLike}
            />
        )

        const userSim = userEvent.setup() 
        const viewButton = screen.getByText('view')
        await userSim.click(viewButton)

        const likeButton = screen.getByText('like')
        await userSim.click(likeButton)
        await userSim.click(likeButton)

        expect(mockLike).toHaveBeenCalledTimes(2)
        
        
    })
})

describe('BlogForm', () => {
    test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
        const createBlog = vi.fn()
        const userSim = userEvent.setup()

        render(<BlogForm createBlog={createBlog}/>)

        const titleInput = screen.getByPlaceholderText('write blog title here')
        const authorInput = screen.getByPlaceholderText('write blog author here')
        const urlInput = screen.getByPlaceholderText('write blog url here')
        const createButton = screen.getByText('Create')

        await userSim.type(titleInput, 'New Blog title')
        await userSim.type(authorInput, 'David GalRiv')
        await userSim.type(urlInput, 'newblog.com')
        await userSim.click(createButton)

        expect(createBlog).toHaveBeenCalledTimes(1)
        expect(createBlog).toHaveBeenCalledWith({
            title: 'New Blog title',
            author: 'David GalRiv',
            url: 'newblog.com'
        })
    })
})