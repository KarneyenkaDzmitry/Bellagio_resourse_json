Feature: Redirections through references from header

    Background:
        Given I am on 'https://www.bellagio.com/en.html' url

    # @Redirections
    # Scenario Outline: page should contain header [<text>] on its body
    #     When I click '<option>' text in 'low header > menu items'
    #     And I wait until 'main > h1' is present
    #     Then Text of 'main > h1' should equal '<text>' text

    #     Examples:
    #         | option            | text                 |
    #         | RESTAURANTS       | RESTAURANTS          |
    #         | HOTEL             | HOTEL ROOMS & SUITES |
    #         | ENTERTAINMENT     | ENTERTAINMENT        |
    #         | NIGHTLIFE         | NIGHTLIFE            |
    #         | AMENITIES         | AMENITIES            |
    #         | CASINO            | CASINO               |
    #         | GROUPS & WEDDINGS | GROUPS & WEDDINGS    |
    #         | OFFERS            | OFFERS               |

    # @Redirections @Reservation
    # Scenario Outline: page should contain header [<text>] on its body
    #     When I click 'guest services'
    #     And I click '<option>' text in 'guest services > menu items'
    #     And I wait until 'main > h1' is present
    #     Then Text of 'main > h1' should equal '<text>' text

    #     Examples:
    #         | option           | text                  |
    #         | FIND RESERVATION | Find Your Reservation |

    Scenario: steps with memory
        When I click 'guest services'
        And I click 'guest services > menu items #$test'
        And I wait until 'form' is present
        And I remember text of 'form > inputs #last' as '$name'
        When I remember number of 'form > inputs' as '$number'
        When I remember page title as '$pageTitle'
        And I wait for '1' seconds
        When I remember attribute 'type' of 'form>button' as '$attr'
        # When I remember index of 'form > inputs' matching 'lastName' as '$index'
        # When I remember index of "form > inputs" containing "last name" text as "$index"
        
        

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
# When I remember text of 'element' as '$name'
# When I remember number of 'element' as '$name'
# When I remember page title as '$name'
# When I remember 'attribute' of 'element' as '$name'
# When I remember index of "selector" matching "textToMatch" as "indexName"
# When I remember index of "selector" containing "textToMatch" text as "indexName"
# When I highlight 'element'
# I make screenshot of the page