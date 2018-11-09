Feature: Search component

    Background: Background
        Given I am on 'https://www.bellagio.com/en.html' url

@Search
    Scenario: elements of the search component should be presented with data from requirements
        When I click 'search component'
        And I wait until 'search component form' is visible
        And I remember attribute 'placeholder' of 'search component input' as '$placeholder'
        Then Text of '$placeholder' should equal 'Search restaurants, shows, more…'
        And 'search component button' should not be enabled
        And 'search component button' should be present
        And Text of 'search component button' should equal 'SEARCH'
        And 'search component cancel' should be present
    
    @Search
    Scenario Outline: If user Search for something User should see result: <result>
        When I click 'search component'
        And I wait until 'search component input' is visible
        And I type '<text>' in 'search component input'
        And I click 'search component button'
        And I wait until 'body results headers' is present
        Then Text of 'body results headers' should contain '<result>'
        Examples:
            | text      | result                   |
            | du soleil | "O" BY CIRQUE DU SOLEIL® |

    @Search
    Scenario Outline: If user Search for something but nothing has been found should be appeared message: <result>
        When I click 'search component'
        And I wait until 'search component input' is visible
        And I type '<text>' in 'search component input'
        And I click 'search component button'
        And I wait until 'body results headers' is present
        Then Text of 'body no result message' should equal '<result>'
        Examples:
            | text    | result                                                                                                              |
            | dusolei | Sorry, your search for dusolei did not return any results. Please try different search terms or browse our sitemap. |

    