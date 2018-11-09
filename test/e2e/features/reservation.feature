Feature: Reservation page


    Background: Background
        Given I am on 'https://www.bellagio.com/en/itineraries/find-reservation.html' url


    @Reservation
    Scenario: The first field of form should be an dropdown and has following options
        When I click 'inputs #first > dropdown'
        And I wait until 'inputs #first > dropdown > options' is visible
        Then I should see the following lines in 'inputs #first > dropdown > options'
            | What type of reservation? |
            | Room                      |
            | Entertainment             |
            | Dining                    |

    @reservation
    Scenario: Form should has the following fields names
        Then Number of 'inputs' should equal '4'
        Then I should see the following lines in 'inputs > name'
            | RESERVATION TYPE    |
            | CONFIRMATION NUMBER |
            | FIRST NAME          |
            | LAST NAME           |

    @Reservation
    Scenario: The first option should be selected by default and has the following text
        Then 'inputs #first > dropdown > options #1' should be selected
        And Text of 'inputs #first > dropdown > options #1' should equal 'What type of reservation?'