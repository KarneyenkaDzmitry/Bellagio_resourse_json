Feature: Bellagio resource


    @Restaurants
    Scenario Outline: Filter should return results related with options
        Given I am on 'https://www.bellagio.com/en/restaurants.html' url
        When I click 'filters #first > button'
        And I wait until 'filters #first > options' is visible
        And I click '<Cuisine>' text in 'filters #1 > options'
        And I scroll to 'filters #second > button'
        And I click 'filters #second > button'
        And I wait until 'filters #second > options #2' is visible
        And I click '<Price>' text in 'filters #2 > options'
        And I click 'filters #3 > button'
        And I wait until 'filters #3 > options #3' is visible
        And I click '<Meal>' text in 'filters #3 > options'
        And I wait for '3' seconds
        Then Text of 'title ref' should contain '<Result>'
        Examples:
            | Cuisine | Price | Meal                 | Result                 |
            | Italian | Clear | Breakfast and Brunch | LAGO BY JULIAN SERRANO |


