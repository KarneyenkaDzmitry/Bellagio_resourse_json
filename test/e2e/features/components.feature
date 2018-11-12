Feature: Component

    @BaseComponent
    Scenario Outline: while at bellagio should be present in each page
        Given I am on '<url>' url
        When I scroll to 'resorts gallery #1'
        Then 'base component' should be present
        And Text of 'base component > title' should equal 'WHILE AT BELLAGIO'
        And Number of 'resorts gallery' should equal '4'

        Examples:
            | url                                              |
            | https://www.bellagio.com/en/offers.html          |
            | https://www.bellagio.com/en/meetings-groups.html |
            | https://www.bellagio.com/en/amenities.html       |
            | https://www.bellagio.com/en/nightlife.html       |
            | https://www.bellagio.com/en/restaurants.html     |
            | https://www.bellagio.com/en/entertainment.html   |
            | https://www.bellagio.com/en/hotel.html           |

