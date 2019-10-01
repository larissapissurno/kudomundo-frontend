const dsv = location.host.includes('localhost');

const uri = dsv ? 'http://localhost:3000' : 'https://xzmw17xdji.execute-api.us-east-1.amazonaws.com/dev';
const team = dsv ? localStorage.tenant || 'bebulls' : location.host.replace('.kudomundo.ml', '');

importCustomCss();

const { 
    weekOfYear,
    weekParam,
    year,
    startWeek,
    endWeek
} = initDates();

function importCustomCss() {
    const cssId = 'plcss';
    if (!document.getElementById(cssId)) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = `private/${team}/custom.css`;
        link.media = 'all';
        head.appendChild(link);
    }
}

function initDates() {
    const urlParams = new URLSearchParams(window.location.search);
    const year = moment().format('YYYY');
    let weekOfYear = moment().week();
    const defaultDate = year + '-' + weekOfYear;
    const weekParam = urlParams.get('week') || defaultDate;
    weekOfYear = weekParam.split('-')[1];

    const week = moment().week(weekOfYear);
    const startWeek = week.startOf('week').format('DD/MM/YYYY');
    const endWeek = week.endOf('week').format('DD/MM/YYYY');

    return {
        weekOfYear,
        weekParam,
        year,
        startWeek,
        endWeek,
    };
}
