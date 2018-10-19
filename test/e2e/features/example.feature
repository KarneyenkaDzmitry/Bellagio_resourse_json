Feature: Example

   Feature Description

Background: Background
   Given I am on 'https://www.bellagio.com/en.html' url

   Scenario: Scenario name
   When I click 'header > top header > guest services'
#    And I click 'header > top header > guest services > #1 menu items'
   And I choose option by text 'find reservation' from 'header > top header > guest services > menu items'
   And I wait for '5' seconds




#    Templates:
# Then 'element' should be 'present or visible'
# Then Text of 'element should 'contain or equals' 'text'
# Then Page title should be 'text'
# When I type 'text' in 'element field'
# When I wait until 'element' is 'present, visible clickable'
# And I wait for 'number' seconds
# And I remember text 'element' as '$name'