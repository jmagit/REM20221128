
describe('Calculadora Test', () => {
  beforeEach(() => {
    cy.visit('/chisme/de/hacer/numeros')
    cy.title().should('eq', 'Calculadora')
  })
  it('Abrir Calculadora desde el menu', () => {
    cy.title().should('eq', 'Calculadora')
  })
  it('Abrir Calculadora desde el menu', () => {
    cy.visit('/')
    cy.get('.nav-link').contains('calculadora').click()
    cy.title().should('eq', 'Calculadora')
  })
})
