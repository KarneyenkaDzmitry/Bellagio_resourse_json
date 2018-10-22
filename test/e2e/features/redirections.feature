Feature: Redirections through references from header

# Background:
#         Given I am on 'https://www.bellagio.com/en.html' url
        
# @Redirections
#     Scenario Outline: page should contain header [<text>] on its body
#         When I click '<option>' text in 'header > low header > menu items'
#         And I wait until 'main > h1' is present
#         Then Text of 'main > h1' should equal '<text>' text

#         Examples:
#             | option        | text                 |
#             | RESTAURANTS   | RESTAURANTS          |
#             | HOTEL         | HOTEL ROOMS & SUITES |
#             | ENTERTAINMENT | ENTERTAINMENT        |