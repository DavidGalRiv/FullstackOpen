const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createNote, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()

    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()

    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Welcome, Matti Luukkainen')).toBeVisible()  })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.getByTestId('error')
      await expect(errorDiv).toContainText('Wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Welcome, Matti Luukkainen')).not.toBeVisible() 
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, {
          title: 'Test Blog',
          author: 'David GR',
          url: 'mytestblog.com'
        })

        await expect(page.getByText('Blog "Test Blog" by David GR added')).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        const blog = page.locator('.blog', { hasText: 'Test Blog David GR' })

        await blog.getByRole('button', { name: 'view' }).click()

        const likeButton = blog.getByRole('button', { name: 'like' })
        const likesText = blog.getByText(/likes/i)

        const initialLikes = parseInt((await likesText.textContent()).match(/\d+/)[0])

        await likeButton.click()

        await expect(likesText).toContainText(`likes ${initialLikes + 1}`)
      })

      test('the user who added a blog can delete it', async ({ page }) => {
        const blog = page.locator('.blog', { hasText: 'Test Blog' })

        await blog.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept()
        })

        await blog.getByRole('button', { name: 'remove' }).click()

        await expect(page.locator('.blog', { hasText: 'Test Blog' })).toHaveCount(0)
      })

      test('only the user who added the blog sees its delete button', async ({page}) =>{
        await createBlog(page, {
          title: 'Deletion Blog',
          author: 'David GR',
          url: 'mydeletionblog.com'
        })

        await page.getByRole('button', { name: 'Logout' }).click()

        await loginWith(page, 'hellas', 'hellas123')

        const blog = page.locator('.blog', { hasText: 'Deletion Blog' })
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(blog.getByRole('button', {name: 'remove'})).not.toBeVisible()
      })

      test('blogs are displayed in descending order by likes', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')

        const blogElements = page.locator('.blog')
        const count = await blogElements.count()

        for (let i = 0; i < count; i++) {
          await blogElements.nth(i).getByRole('button', { name: 'view' }).click()
        }

        const likesArray = []
        for (let i = 0; i < count; i++) {
          const likesText = await blogElements.nth(i).locator('text=likes').textContent()
          const likes = parseInt(likesText.match(/\d+/)[0])
          likesArray.push(likes)
        }

        for (let i = 0; i < likesArray.length - 1; i++) {
          expect(likesArray[i]).toBeGreaterThanOrEqual(likesArray[i + 1])
        }
      })
    })
  })
})