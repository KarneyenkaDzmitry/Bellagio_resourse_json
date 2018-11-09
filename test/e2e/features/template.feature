    #  Scenario: steps with memory
#         When I click 'guest services'
#         And I click 'guest services > menu items #$test'
#         And I wait until 'form' is present
#         And I remember text of 'form > inputs #last' as '$name'
#         When I remember number of 'form > inputs' as '$number'
#         When I remember page title as '$pageTitle'
#          When I remember index of 'form > inputs' containing 'last name' as '$index'
#         And I wait for '1' seconds
#         When I remember attribute 'type' of 'form > button' as '$attr'
        # When I remember index of 'form > inputs' matching 'lastName' as '$index'

        
#    Scenario: steps with memory
        # When I click 'guest services'
        # And I click 'guest services > menu items #first'
        # And I wait until 'form' is present
        # And I remember text of 'form > elements #last' as '$name'
        # When I remember number of 'elements' as '$number'
        # When I remember page title as '$pageTitle'
        # And I wait for '5' seconds
        # When I remember attribute 'class' of 'form' as '$class'     
        

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
# When I remember index of 'selector' matching 'textToMatch' as 'indexName'
# When I remember index of 'selector' containing 'textToMatch' as 'indexName'
# When I highlight 'element'
# I make screenshot of the page
# Then Text of 'main > h1' should match /regex/gi 

# let scrollElementToMiddle = function (element) {
#     return Promise.all([
#         element.getLocation(),
#         browser.executeScript('return window.document.body.offsetHeight'),
#         browser.executeScript('return window.outerHeight')])
#         .then(([location, scrollLength, outerHeight]) => {
#             var elementYpos = location.y;
#             logger.info("scrollLength:", scrollLength);
#             logger.info("elementYpos:", elementYpos);
#             logger.info("outerHeight:", outerHeight);
#             if (scrollLength - elementYpos < outerHeight  0.5) {
#                 return elementYpos;
#             } else {
#                 return elementYpos - outerHeight  0.5;
#             }
#         })
#         .then(function (scrollTo) {
#             logger.info("scrollTo:", scrollTo);
#             return browser.executeScript('window.scrollTo(0, arguments[0])', scrollTo);
#         });
# };