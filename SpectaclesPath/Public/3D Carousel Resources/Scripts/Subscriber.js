global.carouselSubscriber = script;

script._currIndex;

script.api.setIndex = function(index) 
{
    script._currIndex = index;
    global.appController.setHighlighted(index);
    print("Current index set to " + index);
}
script.getIndex = function()
{
    return script._currIndex;
}


//script.createEvent("TouchStartEvent").bind(function()
//{
//    
//});
//script.createEvent("TouchEndEvent").bind(function()
//{
//    
//});