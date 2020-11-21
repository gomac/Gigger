@ignore
Feature:	The Home screen
    *The Home screen should be a list of jobs that this Boss has advertised
    *It should have the correct headings, fields, and sample data

  Background: I am on the Home screen
    And I am user 'Boss'


  Scenario: Button appears if Applications are present
    Given I log in with the user 'Boss'
    When I am user 'Boss'
    Then I can see a row job “ABC”
    And the title “My Jobs” exists
    And the row has an Applications button
    And A badge exists with pending=1, rejected=1 and accepted=1 status of Applications
