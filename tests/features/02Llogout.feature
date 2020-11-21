Feature: Logout

  Background:
    Given I'm on the list screen

  Scenario: Displays login screen, when clicking logout
    When I press log out on the side menu
    Then app displays login screen
