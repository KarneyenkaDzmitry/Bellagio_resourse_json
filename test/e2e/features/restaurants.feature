Feature: Bellagio resource


    # Background: Background
    #     Given I am on 'https://www.bellagio.com/en/restaurants.html' url


    @Restaurants
    Scenario Outline: Filter should return results related with options
        Given I am on '<url>' url
        When I click 'filters #first > button'
        And I wait until 'filters #first > options' is visible
        And I click '<Cuisine>' text in 'filters #1 > options'
        And I scroll up until 'filters #second > button' is present
        And I click 'filters #second > button'
        And I wait until 'filters #second > options #2' is visible
        And I click '<Price>' text in 'filters #2 > options'
        And I click 'filters #3 > button'
        And I wait until 'filters #3 > options #3' is visible
        And I click '<Meal>' text in 'filters #3 > options'
        Then Text of 'title ref' should contain '<Result>' text
        Examples:
            | url                                          | Cuisine | Price | Meal                 | Result                 |
            | https://www.bellagio.com/en/restaurants.html | Italian | Clear | Breakfast and Brunch | LAGO BY JULIAN SERRANO |