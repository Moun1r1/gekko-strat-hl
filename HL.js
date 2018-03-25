var _ = require('lodash');
var log = require('../core/log.js');


var method = {};

method.init = function() {
    this.name = 'Scalper';

    this.candle_queue = [];
    this.is_buyin = false;
    this.price_buyin = 0;
}

var barscount = 0;
var lastlow = 0;
method.update = function(candle) {

    if(candle.low < lastlow){lastlow = candle.low;}
    if(this.candle_queue.length>Period){
        this.candle_queue.pop();
    }
    this.candle_queue.push(candle);
    barscount++;
    if(this.candle_queue.length>0){
        candle.delta = candle.close - this.candle_queue[0].close;
    }

}
var percent = 35;
var distance = 3;
var Period = 14;
var lastcolor = 0;

method.check = function(candle) {
    if (this.candle_queue.length >= 15)
    {
        runningMin = 99999999;
        runninMax = 0;
        for (var barsBack = Math.min(this.candle_queue.length, Period - 1); barsBack > 0; barsBack--)
        {
            var bar = this.candle_queue[barsBack];
            if(bar.close <= runningMin)
            {
                var runningMin  = bar.close;
            }
        }

        // for (var barsBack = Math.min(this.candle_queue.length, Period - 1); barsBack > 0; barsBack--)
        // {
        //     var bar = this.candle_queue[barsBack];
        //     if(bar.close >= runninMax)
        //     {
        //         var runninMax  = bar.close;
        //         log.debug(runninMax);

        //     }
        // }
        if(this.candle.close < runningMin && (this.candle.close - runningMin) / 100 < -4)
        {
            log.debug("Lower move : ",(this.candle.close - runningMin) / 100)
            this.price_buyin = candle.close;
            this.is_buyin = true;
            return this.advice("long");
        }
        else if (candle.close <candle.low + ((candle.high - candle.low) * (percent / 100)))
        {
                this.is_buyin = false;
                return this.advice("short");
        }
    
    }
}

module.exports = method;