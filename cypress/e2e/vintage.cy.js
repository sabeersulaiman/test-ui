describe('template spec', () => {
  beforeEach(() => {
    cy.eyesOpen({
      appName: 'CNB Vintage Web',
      testName: Cypress.currentTest.title
    })
  })

  afterEach(() => {      
    cy.eyesClose()
  })

  it('should load home page logo', () => {
    cy.visit('http://localhost:3000/index.html')

    cy.get('.logo-link').should('be.visible')

    cy.eyesCheckWindow({
      tag: "Home page",
      target: 'window',
      fully: true
    })
  })

  it('should visit services page', () => {
    cy.visit('http://localhost:3000/index.html')

    cy.get('#service-link').click()
    cy.get('.services .service').should('have.length', 5)


    cy.eyesCheckWindow({
      tag: "Services page",
      target: 'window',
      fully: true
    })
  })

  it('should visit contacts page', () => {
    cy.visit('http://localhost:3000/contact.html')

    cy.get('#name').type('Name of User')
    cy.get('#email').type('email@example.com')
    cy.get('#message').type('Message from User....{enter}new line')

    cy.get('.form .btn.blue').should('be.visible')

    cy.eyesCheckWindow({
      tag: "Contact page",
      target: 'window',
      fully: true
    })
  })
})
