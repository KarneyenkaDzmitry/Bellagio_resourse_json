# Feature: Redirections through references from header

#     Background:
#         Given I am on 'https://www.bellagio.com/en.html' url

#     @Redirections
#     Scenario Outline: page should contain header [<text>] on its body
#         When I click '<option>' text in 'low header > menu items'
#         And I wait until 'main > h1' is present
#         Then Text of 'main > h1' should equal '<text>'

#         Examples:
#             | option            | text                 |
#             | RESTAURANTS       | RESTAURANTS          |
#             | HOTEL             | HOTEL ROOMS & SUITES |
#             | ENTERTAINMENT     | ENTERTAINMENT        |
#             | NIGHTLIFE         | NIGHTLIFE            |
#             | AMENITIES         | AMENITIES            |
#             | CASINO            | CASINO               |
#             | GROUPS & WEDDINGS | GROUPS & WEDDINGS    |
#             | OFFERS            | OFFERS               |

#     @Redirections @Reservation
#     Scenario Outline: page should contain header [<text>] on its body
#         When I click 'guest services'
#         And I click '<option>' text in 'guest services > menu items'
#         And I wait until 'main > h1' is present
#         Then Text of 'main > h1' should equal '<text>'

#         Examples:
#             | option           | text                  |
#             | FIND RESERVATION | Find Your Reservation |