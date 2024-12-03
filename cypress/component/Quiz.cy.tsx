// cypress/component/Quiz.cy.tsx
import React from 'react';
import { mount } from 'cypress/react';
import Quiz from '../../client/src/components/Quiz';
import '../../src/index.css';

describe('Quiz Component', () => {
  it('should display a start button initially', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').should('be.visible');
  });

  it('should fetch questions and start the quiz on button click', () => {
    cy.intercept('/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.get('h2').should('exist');
  });

  it('should display quiz completion message on finishing all questions', () => {
    cy.intercept('/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
    mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Simulate answering all questions
    cy.get('.btn-primary').each((button) => {
      cy.wrap(button).click();
    });
    
    cy.contains('Quiz Completed').should('be.visible');
  });
});
