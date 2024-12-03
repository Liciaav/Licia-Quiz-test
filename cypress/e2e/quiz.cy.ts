// cypress/e2e/quiz.cy.ts
describe('Tech Quiz App E2E Test', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should load the quiz start page', () => {
      cy.contains('Start Quiz').should('be.visible');
    });
  
    it('should start quiz and display first question', () => {
      cy.intercept('/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions');
      cy.get('h2').should('not.be.empty');
    });
  
    it('should complete the quiz and show score', () => {
      cy.intercept('/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      cy.get('.btn-primary').each((button) => {
        cy.wrap(button).click();
      });
  
      cy.contains('Quiz Completed').should('be.visible');
      cy.contains('Your score').should('exist');
    });
  });
  