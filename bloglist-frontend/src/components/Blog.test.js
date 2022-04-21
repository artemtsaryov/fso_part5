import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const likeActionMock = jest.fn()

  beforeEach(() => {
    const testBlog = {
      title: 'Testing blog',
      author: 'Test runner',
      url: 'localhost',
      likes: 1,
      user: {
        id: '11111',
        username: 'tr',
        name: 'Test runner'
      }
    }

    container = render(
      <Blog blog = {testBlog} handleLike = {likeActionMock} />
    ).container
  })

  test('displays properly at the start', () => {
    const blogHeader = container.querySelector('.blog-header')
    expect(blogHeader).not.toHaveStyle('display: none')

    const blogBody = container.querySelector('.blog-body')
    expect(blogBody).toHaveStyle('display: none')
  })

  test('displays hidden content on demand', () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const blogHeader = container.querySelector('.blog-header')
    expect(blogHeader).not.toHaveStyle('display: none')

    const blogBody = container.querySelector('.blog-body')
    expect(blogBody).not.toHaveStyle('display: none')
  })

  test('displays hidden content on demand', () => {
    const button = screen.getByText('like')
    userEvent.click(button)
    userEvent.click(button)

    expect(likeActionMock.mock.calls).toHaveLength(2)
  })

})