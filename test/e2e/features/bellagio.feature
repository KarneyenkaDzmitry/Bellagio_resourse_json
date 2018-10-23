Feature: Bellagio resource


    Background: Background
        Given I am on 'https://www.bellagio.com/en.html' url

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

    @Reservation
    Scenario: Reservation page should contain header [h1] = [Find Your Reservation] on its body
        When I click 'guest services'
           And I click 'guest services > #1 menu items'
        # And I click 'find reservation' text in 'guest services > menu items'
        And I wait for '5' seconds
        # Then Text of 'main > h1' should match /regex/gi 

    # @Reservation
    # Scenario: User should have an apportunity to choose options in field [reservation] on Reservation page
    #     When I click 'header > top header > guest services'
    #     And I click 'find reservation' text in 'header > top header > guest services > menu items'
    #     Then Text of 'header > top header > guest services > menu items' should equal '<text>' text

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

#    Templates:
# Then 'element' should be 'present or visible'
# Then Text of 'element should 'contain or equals' 'text'
# Then Page title should be 'text'
# When I type 'text' in 'element field'
# When I wait until 'element' is 'present, visible clickable'
# And I wait for 'number' seconds
# And I remember text of 'element' as '$name'
# Then Text of 'element should match 'regex'
# Then Text of 'main > h1' should match /regex/gi 