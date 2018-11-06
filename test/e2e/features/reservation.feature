Feature: Bellagio resource


    Background: Background
        Given I am on 'https://www.bellagio.com/en/itineraries/find-reservation.html' url


    @Reservation
    Scenario Outline: User should have an apportunity to choose options in field [reservation] on Reservation page
        When I click 'inputs #first > dropdown'
        And I wait until 'inputs #first > dropdown > options' is visible
        And I click 'inputs #first > dropdown > options #<index>'
        Then 'inputs #first > dropdown > options #<index>' should be visible
        And Text of 'inputs #first > dropdown > options #<index>' should equal '<text>'

        Examples:
            | index | text                      |
            | 1     | What type of reservation? |
            | 2     | Room                      |
            | 3     | Entertainment             |
            | 4     | Dining                    |
    @reservation
    Scenario Outline: Form fields names
        Then Text of 'inputs #<index> > name' should equal '<name>'

        Examples:
            | index | name                |
            | 1     | RESERVATION TYPE    |
            | 2     | CONFIRMATION NUMBER |
            | 3     | FIRST NAME          |
            | 4     | LAST NAME           |

            Scenario: 
            When I remember attribute 'selected' of 'inputs #first > dropdown' as '$attr'
            Then Text of '$attr' should equal ''
            And Number of 'inputs' should equal '4'
# And I remember attribute 'selected' of 'dropdown > options #1' as '$selectAttr'

# And I remember text of 'dropdown > options' as '$optionsText'
# Then Text of 'dropdown > options' should contain '<text>'
# And I click 'find reservation' text in 'header > top header > guest services > menu items'
# Then Text of 'header > top header > guest services > menu items' should equal '<text>'

