/* EXPLANATION: counttimer widget. 
    html: <div data-widget="marketing-timer" data-date-init="2018, 8, 27">
                        <span class="timer_days hidden"></span>
                        <span class="timer_hours"></span>
                        <!-- <span id="delimiter">:</span> -->
                        <span class="timer_minutes"></span>
                        <!-- <span id="delimiter">:</span> -->
                        <span class="timer_seconds"></span>
                    </div>
ATTENTION: do not remove spans from template, just hide them.
example: if you do not need years add 'hidden' class to span.timer_days  
    data parameters: You need pass in html template data-attribute 'widget'=marketing-timer
    & pass string with Date format('YYYY, M, D') to data-date-init.   
*/
function updater(d, h, m, s) {
    // День сброса - 27 сентября 2015 года (и далее каждые три дня)
    let dataT;
    function getData(){
        let dataTime = $('[data-widget="marketing-timer"]').data('date-init');
        if(dataTime == '' || typeof dataTime == undefined){
            dataTime = '2015, 8, 27'
        }
        result = dataTime;
        return result;
    };
    dataT = getData();
    var baseTime = new Date(dataT);
    // Период сброса — 3 дня
    var period = 3*24*60*60*1000;
    
    function update() {
      var cur = new Date();
      // сколько осталось миллисекунд
      var diff = period - (cur - baseTime) % period;
      // сколько миллисекунд до конца секунды
      var millis = diff % 1000;
      diff = Math.floor(diff/1000);
      // сколько секунд до конца минуты
      var sec = diff % 60;
      if(sec < 10) sec = "0"+sec;
      diff = Math.floor(diff/60);
      // сколько минут до конца часа
      var min = diff % 60;
      if(min < 10) min = "0"+min;
      diff = Math.floor(diff/60);
      // сколько часов до конца дня
      var hours = diff % 24;
      if(hours < 10) hours = "0"+hours;
      var days = Math.floor(diff / 24);
      $(d).text(days);
      $(h).text(hours);
      $(m).text(min);
      $(s).text(sec);
    
      // следующий раз вызываем себя, когда закончится текущая секунда
      setTimeout(update, millis);
    }
    setTimeout(update, 0);
  }

  updater(
    $('[data-widget="marketing-timer"] .timer_days'),
    $('[data-widget="marketing-timer"] .timer_hours'), 
    $('[data-widget="marketing-timer"] .timer_minutes'),
    $('[data-widget="marketing-timer"] .timer_seconds')
);