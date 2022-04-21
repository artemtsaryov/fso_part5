import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls onSubmit', () => {
  const createBlogMock = jest.fn()

  render(<BlogForm handleCreateNew={createBlogMock} />)

  const inputTitle = screen.getByPlaceholderText('type blog title here')
  const inputAuthor = screen.getByPlaceholderText('type blog author here')
  const inputUrl = screen.getByPlaceholderText('type blog url here')
  const sendButton = screen.getByText('create')

  userEvent.type(inputTitle, 'testing title input' )
  userEvent.type(inputAuthor, 'testing author input' )
  userEvent.type(inputUrl, 'testing url input' )
  userEvent.click(sendButton)

  expect(createBlogMock.mock.calls).toHaveLength(1)
  expect(createBlogMock.mock.calls[0][0].title).toBe('testing title input')
  expect(createBlogMock.mock.calls[0][0].author).toBe('testing author input')
  expect(createBlogMock.mock.calls[0][0].url).toBe('testing url input')
})