Feature: Redirections through references from header

Background:
        Given I am on the home page 'https://www.bellagio.com/en.html'
        
@Redirections
    Scenario Outline: Every page should contain header [h1] on its body [<Page>] with [<text>] text
        Given I am on '<Page>' page
        Then I should see '<text>' text in 'body header h1' of a body
        And  'body results' should be 'present'

        Examples:
            | Page          | text                 |
            | RESTAURANTS   | RESTAURANTS          |
            | HOTEL         | HOTEL ROOMS & SUITES |
            | ENTERTAINMENT | ENTERTAINMENT        |