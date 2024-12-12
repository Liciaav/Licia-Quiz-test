// import React from 'react';
// import { mount } from 'cypress/react18'; 
// import '@testing-library/cypress/add-commands';
import Quiz from "../../client/src/components/Quiz"

describe('<Quiz /> Component', () => {
  
  beforeEach(() => {
    // Stub the API request to fetch questions
    cy.intercept('GET', '/api/questions/random', {
      fixture: 'questions.json', // Use the fixture file for questions
    }).as('getQuestions');
  });

  it('should display the "Start Quiz" button initially', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz', { timeout: 10000 }).should('be.visible');

    // Ensure 'Start Quiz' exists in the DOM as an extra verification
    cy.get('body').then(($body) => {
      expect($body.text()).to.include('Start Quiz');
    });
  });

  it('should fetch questions and display the first question on clicking "Start Quiz"', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click(); // Simulate button click
    cy.wait('@getQuestions'); // Wait for questions to be fetched
    cy.get('h2').should('exist').and('not.be.empty'); // Check the question is displayed
  });

  it('should complete the quiz and display a completion message', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click(); // Start the quiz
    cy.wait('@getQuestions');

    // Simulate answering all questions by clicking all answer buttons
    cy.get('.btn-primary').each((button) => {
      cy.wrap(button).click();
    });

    // Check for quiz completion message
    cy.contains('Quiz Completed').should('be.visible');
  });

  it('should restart the quiz and show a new question set on clicking "Restart"', () => {
    cy.mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    cy.get('.btn-primary').each((button) => {
      cy.wrap(button).click();
    });

    // Simulate quiz completion
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Restart Quiz').click(); // Simulate restarting quiz

    cy.wait('@getQuestions');
    cy.get('h2').should('not.be.empty').and('not.contain', 'Quiz Completed');
  });
});
