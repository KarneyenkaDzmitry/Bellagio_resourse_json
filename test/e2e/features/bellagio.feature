Feature: Bellagio resource

    # Background:
    #     Given I am on the home page 'https://www.bellagio.com/en.html'

    # @Restaurants
    # Scenario Outline: Filter should return results related with options
    #     Given I am on '<Page>' page
    #     When I use filter with options cousine = '<Cousine>', price = '<Price>', meal = '<Meal>'
    #     # When I click "Cousine Dropdown"
    #     #     And I click "Italian" text in "Cousine Dropdown > Options"
    #     Then I should see '<Result>' in 'body results headers'
    #     And 'body results array' should have '1' elmement

    #     Examples:
    #         | Page        | Cousine | Price | Meal                 | Result                 |
    #         | RESTAURANTS | Italian | Clear | Breakfast and Brunch | LAGO BY JULIAN SERRANO |

    # @Reservation
    # Scenario: Reservation page should contain header [h1] = [Find Your Reservation] on its body
    #     When I click on 'guest services' reference
    #     And I choose the option by text 'find reservation' on menu 'guest services menu'
    #     Then I should see 'Find Your Reservation' text in 'body header h1' of a body

    # @Reservation
    # Scenario: User should have an apportunity to choose options in field [reservation] on Reservation page
    #     When I click on 'guest services' reference
    #     And I choose the option by text 'find reservation' on menu 'guest services menu'
    #     And I choose 'room option' in field 'reservation'
    #     Then 'room option' should be selected and contains text 'Room'

    # @Search
    # Scenario: Search component elements should be presented
    #     Given I have chosen 'search component' component
    #     Then I should see input field with text 'Search restaurants, shows, more…'
    #     And 'disabled' button with text 'SEARCH'

    # @Search
    # Scenario Outline: If user Search for something User should see results
    #     Given I have chosen 'search component' component
    #     When I search for '<text>'
    #     Then I should see results contains '<result>' in the body
    #     Examples:
    #         | text      | result                   |
    #         | du soleil | "O" BY CIRQUE DU SOLEIL® |

    # @Search
    # Scenario Outline: If user Search for something but nothing has been found should be appeared message
    #     Given I have chosen 'search component' component
    #     When I search for '<text>'
    #     Then I should see message '<result>' in the body of the page
    #     Examples:
    #         | text    | result                                                                                                              |
    #         | dusolei | Sorry, your search for dusolei did not return any results. Please try different search terms or browse our sitemap. |

