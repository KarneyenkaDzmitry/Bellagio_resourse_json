Feature: Example

    Feature Description

    Background: Background
        Given I am on 'https://www.bellagio.com/en.html' url

    # Scenario: Scenario name
    #     When I click 'header > top header > guest services'
    #     #    And I click 'header > top header > guest services > #1 menu items'FIND RESERVATION',
    #     And I choose option by text 'find reservation' from 'header > top header > guest services > menu items'
    #     And I wait for '5' seconds

    @Redirections
    Scenario Outline: page should contain header [<text>] on its body
        When I choose option by text '<option>' from 'header > low header > menu items'
        And I wait until 'main > h1' is 'present'
        Then Text of 'main > h1' should 'equal' the '<text>'

        Examples:
            | option        | text                 |
            | RESTAURANTS   | RESTAURANTS          |
            | HOTEL         | HOTEL ROOMS & SUITES |
            | ENTERTAINMENT | ENTERTAINMENT        |




#    Templates:
# Then 'element' should be 'present or visible'
# Then Text of 'element should 'contain or equals' 'text'
# Then Page title should be 'text'
# When I type 'text' in 'element field'
# When I wait until 'element' is 'present, visible clickable'
# And I wait for 'number' seconds
# And I remember text 'element' as '$name'