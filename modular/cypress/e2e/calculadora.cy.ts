
describe('Calculadora Test', () => {
  describe('Navegación', () => {
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
  describe('Navegación', () => {
    beforeEach(() => {
      cy.visit('/chisme/de/hacer/numeros')
      cy.title().should('eq', 'Calculadora')
    });
    [..."123456789"].forEach(item => {
      it(`Pulsa un ${item}`, () => {
        cy.get(`.btnDigito[value="${item}"]`).click()
        cy.get('.Pantalla').should('have.text', item)
      });
    });
    it(`Introduce -0.01`, () => {
      cy.get('.btnDigito[value="."]').click()
      cy.get('.btnDigito[value="0"]').click()
      cy.get('.btnDigito[value="1"]').click()
      cy.get('.btnDigito[value="±"]').click()
      cy.get('.Pantalla').should('have.text', '-0.01')
    });
    ["+6", "-2", "*8", "/2"].forEach(item => {
      it(`Operador ${item[0]}`, () => {
        const [operador, resultado] = [...item]
        cy.get('.btnDigito[value="4"]').click()
        cy.get(`.btnOperar[value="${operador}"]`).click()
        cy.get('.Pantalla').should('have.text', '4')
        cy.get('.Resumen').should('have.text', `4 ${operador}`)
        cy.get('.btnDigito[value="2"]').click()
        cy.get('.btnOperar[value="="]').click()
        cy.get('.Pantalla').should('have.text', resultado)
        cy.get('.Resumen').should('have.text', '')
      });
    });

    it(`Inicia`, () => {
      const valor = "9876543210"
      const botones = [...valor]
      botones.forEach(btn => {
        cy.get(`.btnDigito[value="${btn}"]`).click()
      })
      cy.get('.Pantalla').should('have.text', valor)
      cy.get('input[value="C"]').click()
      cy.get('.Pantalla').should('have.text', '0')
    });
    it(`Borra`, () => {
      let valor = "1234"
      const botones = [...valor]
      botones.forEach(btn => {
        cy.get(`.btnDigito[value="${btn}"]`).click()
      })
      cy.get(`.btnDigito[value="±"]`).click()
      valor = "-" + valor
      cy.get('.Pantalla').should('have.text', valor)
      for(let i=1; i < (valor.length - 1); i++){
        cy.get('input[value~="BORRAR"]').click()
        cy.get('.Pantalla').should('have.text', valor.substring(0, valor.length - i))
        }
      cy.get('input[value~="BORRAR"]').click()
      cy.get('.Pantalla').should('have.text', '0')
      cy.get('input[value~="BORRAR"]').click()
      cy.get('.Pantalla').should('have.text', '0')
    });
  })
})
