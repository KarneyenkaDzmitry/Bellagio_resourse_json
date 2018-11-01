Feature: Bellagio resource


    Background: Background
        Given I am on 'https://www.bellagio.com/en/restaurants.html' url


    @Restaurants
    Scenario Outline: Filter should return results related with options
        # When I click "Cousine Dropdown"
        When I click 'filters #first > button'
        And I wait for '10' seconds
        # Then I should see '<Result>' in 'body results headers'
        # And 'body results array' should have '1' elmement

        Examples:
            | Page        | Cousine | Price | Meal                 | Result                 |
            | RESTAURANTS | Italian | Clear | Breakfast and Brunch | LAGO BY JULIAN SERRANO |