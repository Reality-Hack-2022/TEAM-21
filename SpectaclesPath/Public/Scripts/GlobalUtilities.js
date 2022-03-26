// -----JS CODE-----

global.utilities = script;

script.smoothFloat = function(src, targ, smoothAmount)
{
    return (smoothAmount * src) + ((1 - smoothAmount) * targ);
}