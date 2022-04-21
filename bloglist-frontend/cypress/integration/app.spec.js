describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Artem Tsarev',
      username: 'artem',
      password: 'tsarev'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input[type=text]').type('artem')
      cy.get('input[type=password]').type('tsarev')
      cy.get('button[type=submit]').click()

      cy.contains('Artem Tsarev logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input[type=text]').type('artem')
      cy.get('input[type=password]').type('wrong_password')
      cy.get('button[type=submit]').click()

      cy.get('.error').should('contain', 'invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Artem Tsarev logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'artem', password: 'tsarev' })
    })

    it('A blog can be created', function() {
      cy.contains('create new').click()

      cy.get('input[name=author]').type('cypress')
      cy.get('input[name=title]').type('test blog from cypress')
      cy.get('input[name=url]').type('localhost')
      cy.get('button[type=submit]').click()

      cy.get('.success').should('contain', 'test blog from cypress')
      cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('.success').should('have.css', 'border-style', 'solid')

      cy.get('.blog-header').contains('test blog from cypress')
    })

    describe('When there is one existing blog', function() {
      beforeEach(function() {
        cy.createBlog({ author: 'cypress', 'title': 'test blog from cypress', url: 'localhost' })
      })

      it('can like the blog', function() {
        cy.contains('view').click()

        cy.get('.blog-body').as('blog')
        cy.get('@blog').contains('likes 0')
        cy.get('@blog').find('button').contains('like').click()

        cy.get('@blog').contains('likes 1')
      })

      it('can remove the blog', function() {
        cy.contains('view').click()

        cy.get('.blog-body').as('blog')
        cy.get('@blog').find('button').contains('remove').click()

        cy.get('.success').should('contain', 'test blog from cypress')
        cy.get('.success').should('have.css', 'color', 'rgb(0, 128, 0)')
        cy.get('.success').should('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'view')
        cy.get('.blog-body').should('not.exist')
        cy.get('.blog-title').should('not.exist')
      })

      it('cannot remove other users blog', function() {
        const user = {
          name: 'Other user',
          username: 'other',
          password: 'user'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.login({ username: 'other', password: 'user' })
        cy.contains('view').click()

        cy.get('.blog-body').as('blog')
        cy.get('@blog').should('not.contain', 'remove')
      })
    })

    describe('When there are many existing blogs', function() {
      beforeEach(function() {
        cy.createBlog({ author: 'cypress', 'title': 'Second blog', url: 'localhost', likes: '1' })
        cy.createBlog({ author: 'cypress', 'title': 'First blog', url: 'localhost', likes: '2' })
        cy.createBlog({ author: 'cypress', 'title': 'Third blog', url: 'localhost', likes: '0' })
      })

      it('blog list is correctly ordered', function() {
        cy.get('.blog-body').then((blogs) => {
          let currentLikes = blogs[0].children[1].textContent.match(/(?<=likes )\d/)[0]
          blogs.each(function (i) {
            const targetLikes = Number(this.children[1].textContent.match(/(?<=likes )\d/)[0])
            expect( targetLikes <= currentLikes).to.be.true
            currentLikes = targetLikes
          })
        })

        cy.contains('Third blog').contains('view').click()

        cy.contains('Third blog').parent().contains('like').click()
        cy.get('.success').should('contain', 'received a new like')
        cy.get('.success', { timeout: 6000 }).should('not.exist')

        cy.contains('Third blog').parent().contains('like').click()
        cy.get('.success').should('contain', 'received a new like')

        cy.get('.blog-body').then((blogs) => {
          let currentLikes = blogs[0].children[1].textContent.match(/(?<=likes )\d/)[0]
          blogs.each(function (i) {
            const targetLikes = Number(this.children[1].textContent.match(/(?<=likes )\d/)[0])
            expect( targetLikes <= currentLikes).to.be.true
            currentLikes = targetLikes
          })
        })
      })
    })
  })
})