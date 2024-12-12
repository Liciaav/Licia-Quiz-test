describe('Tech Quiz App E2E Test', () => {
  context('Game Setup', () => {
    beforeEach(() => {
      // Intercept API to mock the quiz question retrieval
      cy.intercept('GET', '/api/questions/random', {
        fixture: 'questions.json', // Mock response using a fixture
      }).as('getQuestions');

      // Visit the quiz start page
      cy.visit('/');
    });

    it('should load the quiz start page and display the "Start Quiz" button', () => {
      cy.contains('Start Quiz', { timeout: 3000 }).should('be.visible');
    });
  });

  context('Quiz Progression', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/questions/random', {
        fixture: 'questions.json',
      }).as('getQuestions');

      cy.visit('/');
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions');
    });

    it('should display the first question after starting the quiz', () => {
      cy.get('h2').should('not.be.empty'); // Assert the first question is displayed
    });

    it('should answer all questions and display the score at the end', () => {
      cy.get('.btn-primary').each((button) => {
        cy.wrap(button).click();
      });

      cy.contains('Quiz Completed').should('be.visible');
      cy.contains('Your score').should('exist');
    });
  });

  context('Quiz Restart', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/questions/random', {
        fixture: 'questions.json',
      }).as('getQuestions');

      cy.visit('/');
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions');

      // Answer all questions
      cy.get('.btn-primary').each((button) => {
        cy.wrap(button).click();
      });
    });

    it('should restart the quiz when the "Take New Quiz" button is clicked', () => {
      cy.contains('Take New Quiz').click();

      cy.wait('@getQuestions'); // Wait for new questions to load
      cy.contains('Quiz Completed').should('not.exist'); // Ensure it's a fresh start
      cy.get('h2').should('not.be.empty'); // Verify first question is displayed again
    });
  });
});
