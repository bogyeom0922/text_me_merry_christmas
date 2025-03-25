function theDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const day = dayNames[now.getDay()];
    document.write("<br><b>오늘은 " + year + "년 " + month + "월 " + date + "일 " + day + "입니다</b>");
}

let today = new Date();
const date = new Date();

function beforem() {
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    build();
}

function nextm() {
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    build();
}

function build() {
    const nMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const tbcal = document.getElementById("calendar");
    const yearmonth = document.getElementById("yearmonth");
    yearmonth.innerHTML = today.getFullYear() + "년 "+ (today.getMonth() + 1) + "월";

    const before = document.getElementById("before");
    const next = document.getElementById("next");

    if (today.getMonth() + 1 === 12) {
        before.innerHTML = "11월";
        next.innerHTML = "1월";
    } else if (today.getMonth() + 1 === 1) {
        before.innerHTML = "12월";
        next.innerHTML = "2월";
    } else {
        before.innerHTML = today.getMonth() + "월";
        next.innerHTML = (today.getMonth() + 2) + "월";
    }

    while (tbcal.rows.length > 2) {
        tbcal.deleteRow(tbcal.rows.length - 1);
    }

    let row = tbcal.insertRow();
    let cnt = 0;

    for (let i = 0; i < nMonth.getDay(); i++) {
        row.insertCell();
        cnt++;
    }

    for (let i = 1; i <= lastDate.getDate(); i++) {
        let cell = row.insertCell();
        cell.innerHTML = i;
        cnt++;
        if (cnt % 7 === 1) cell.innerHTML = "<font color=#FF9090>" + i;
        if (cnt % 7 === 0) {
            cell.innerHTML = "<font color=#7ED5E4>" + i;
            row = tbcal.insertRow();
        }
        if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && i === date.getDate()) {
            cell.bgColor = "#FBFAE1";
        }
    }
}

function CountDownTimer(dt, id) {
    const end = new Date(dt);
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
    let timer;

    function showRemaining() {
        const now = new Date();
        const distance = end - now;
        if (distance < 0) {
            clearInterval(timer);
            document.getElementById(id).innerHTML = 'EXPIRED!';
            return;
        }

        const days = Math.floor(distance / _day);
        const hours = Math.floor((distance % _day) / _hour);
        const minutes = Math.floor((distance % _hour) / _minute);
        const seconds = Math.floor((distance % _minute) / _second);

        document.getElementById(id).innerHTML = days + '일 ' + hours + '시간 ' + minutes + '분 ' + seconds + '초';
    }

    timer = setInterval(showRemaining, 1000);
}

// 자동으로 올해 크리스마스를 기준으로 타이머 시작
const thisYear = new Date().getFullYear();
const christmas = `12/25/${thisYear} 00:00 AM`;
CountDownTimer(christmas, 'newcountdown');
