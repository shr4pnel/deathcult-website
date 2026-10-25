/* DROP 01 launch timer.
   Shows a countdown until the launch time, then reveals the shop link.
   The check runs in each visitor's browser, so nothing needs deploying
   at launch time.

   Change these two lines for future drops. */
var DC_LAUNCH = Date.UTC(2026, 9, 29, 13, 0, 0); // Thu 29 Oct 2026, 1pm UK (GMT). Months count from 0, so 9 = October.
var DC_SHOP_URL = "https://deathcultgames.square.site";

/* For testing only: add ?now=2026-10-29T13:00:00Z to the page address
   to see the page as it will look at that moment. */
function dcNow() {
    var match = /[?&]now=([^&]+)/.exec(window.location.search);
    var offset = 0;
    if (match) {
        var fake = Date.parse(decodeURIComponent(match[1]));
        if (!isNaN(fake)) {
            if (!window.dcStartedAt) { window.dcStartedAt = Date.now(); }
            offset = fake - window.dcStartedAt;
        }
    }
    return Date.now() + offset;
}

function dcPad(n) {
    return (n < 10 ? "0" : "") + n;
}

function dcFormat(ms) {
    var total = Math.floor(ms / 1000);
    var days = Math.floor(total / 86400);
    var hours = Math.floor((total % 86400) / 3600);
    var mins = Math.floor((total % 3600) / 60);
    var secs = total % 60;
    var clock = dcPad(hours) + ":" + dcPad(mins) + ":" + dcPad(secs);
    if (days > 0) {
        return days + (days === 1 ? " DAY " : " DAYS ") + clock;
    }
    return clock;
}

/* countdownId: element that shows the remaining time.
   onLaunch: function to run once the launch time arrives. */
function dcStartCountdown(countdownId, onLaunch) {
    var el = document.getElementById(countdownId);
    var launched = false;

    function tick() {
        var left = DC_LAUNCH - dcNow();
        if (left <= 0) {
            if (!launched) {
                launched = true;
                clearInterval(timer);
                onLaunch();
            }
            return;
        }
        if (el) { el.textContent = dcFormat(left); }
    }

    var timer = setInterval(tick, 250);
    tick();
}
