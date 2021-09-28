'use strict';

const MIN_CANDLE_WIDTH      = 5;
const MAX_CANDLE_WIDTH      = 50;
const MIN_CANDLE_WIDTH_START      = 10;
const MAX_CANDLE_WIDTH_START      = 20;

const FETCH_TIMEOUT_MS = 30000;

let chartVals, candleWidth, chartX;
let chart, ctx;

let lastWidth;

function render() {
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "white";
    if(w < 700) {
        ctx.font = "bold 12pt Arial";
        ctx.fillText("MDSIM/USDC", 55, 45);
   } else {
        ctx.font = "bold 16pt Arial";
        ctx.fillText("MDSIM/USDC Chart", 35, 45);
    }

    ctx.font = "12pt Arial";

    let dh = 100;
    h -= 220;

    if(chartVals) {
        let candle = Math.floor(-chartX / candleWidth);
        if(candle < 0)
            candle = 0;
        let x = chartX + candle * candleWidth;

        let low, high;
        for(; candle < chartVals.length / 5 && x + candleWidth <= w; candle++, x += candleWidth) {
            if(low === undefined || low > chartVals[candle * 5 + 3])
                low = chartVals[candle * 5 + 3];
            if(high === undefined || high < chartVals[candle * 5 + 4])
                high = chartVals[candle * 5 + 4];
        }

        let noVals = false;
        if(low == high) {
            low = 0; high = 1;
            noVals = true;
        }

        candle = Math.floor(-chartX / candleWidth);
        if(candle < 0)
            candle = 0;
        x = chartX + candle * candleWidth;

        ctx.strokeStyle = "grey";
        ctx.fillStyle = "white";
        let n = 0;
        for(let i = low; n < 11; n++) {
            ctx.beginPath();
            const y = dh + h - h * (i - low) / (high - low);
            ctx.moveTo(0, y);
            ctx.lineTo(w - 130, y);
            ctx.stroke();

            const txt = i.toFixed(4) + ' USDC';
            if(!noVals)
                ctx.fillText(txt, w - 20 - ctx.measureText(txt).width, y + 6);
    
            i += (high - low) * 0.1;
        }

        if(!noVals)
        for(; candle < chartVals.length / 5 && x + candleWidth <= w; candle++, x += candleWidth) {
            if((candle % 3) == 0) {
                ctx.strokeStyle = "grey";
                ctx.beginPath();
                ctx.moveTo(x + candleWidth / 2, dh);
                ctx.lineTo(x + candleWidth / 2, dh + h);
                ctx.stroke();
                ctx.fillStyle = "white";
                let date = new Date(chartVals[candle * 5 + 0] * 1000);
                const txt = ('0' + date.getUTCDate()).slice(-2) + '/' + ('0' + (1 + date.getUTCMonth())).slice(-2);
                ctx.fillText(txt, x + candleWidth / 2 - ctx.measureText(txt).width / 2, dh + h + 25);
            }

            let green = chartVals[candle * 5 + 1] <= chartVals[candle * 5 + 2];
            ctx.strokeStyle = ctx.fillStyle = green ? 'lightgreen' : 'red';
            ctx.beginPath();
            ctx.moveTo(x + candleWidth / 2, dh + h - h * (chartVals[candle * 5 + 3] - low) / (high - low));
            ctx.lineTo(x + candleWidth / 2, dh + h - h * (chartVals[candle * 5 + 4] - low) / (high - low));
            ctx.stroke();
            let y1 = Math.round(dh + h - h * (chartVals[candle * 5 + (green ? 2 : 1)] - low) / (high - low));
            let y2 = Math.round(dh + h - h * (chartVals[candle * 5 + (green ? 1 : 2)] - low) / (high - low));
            if(y1 == y2)
                y2++;
            ctx.fillRect(x + 1, y1, candleWidth - 5, y2 - y1);
        }
    }
}

function resize() {
    const size = chart.getBoundingClientRect();
    const height = window.innerHeight - size.top;
    chart.style.height = height + 'px';
    ctx.canvas.width  = chart.clientWidth;
    ctx.canvas.height = height;
    if(lastWidth)
        chartX += chart.clientWidth - lastWidth;
    lastWidth = chart.clientWidth;
    window.requestAnimationFrame(render);
}

function serverFetchAsync(url, options) {
    let isStatus = true;
    function status(isStatusNow) {
        isStatus = isStatusNow;
    }

    return new Promise((resolve, reject) => {
        function loop1() {
            let done = false;

            let request = new XMLHttpRequest();
            request.open('POST', url, true);

            request.onload = () => {
                if(done)
                    return;
                done = true;

                if(request.status >= 200 && request.status < 300 && (!request.getResponseHeader('X-FileNotFound') || (options && options.fileNotFoundOK))) {
                    status(true);

                    resolve(request.getResponseHeader('X-FileNotFound') ? undefined : request.responseText);
                } else if(request.status)
                    console.error(new Error('asyncronous fetch of ' + url + ' returned status code ' + request.status));
                else {
                    status(false);
                    setTimeout(loop1, 1000);
                }
            };
            request.onerror = () => {
                if(done)
                    return;
                done = true;

                status(false);
                setTimeout(loop1, 1000);
            };
            request.ontimeout = () => {
                if(done)
                    return;
                done = true;

                status(false);
                loop1();
            };

            request.responseType = 'text';
            request.timeout = FETCH_TIMEOUT_MS;
            if(options && options.fileNotFoundOK)
                request.setRequestHeader('X-FileNotFoundOK', 'true');
            if(options && options.contentType)
                request.setRequestHeader('Content-Type', options.contentType);
            request.send(options ? options.requestData : undefined);
        }
        loop1();
    });
}

async function apiCall(module, ...params) {
    const response = await serverFetchAsync('/api/' + module, {
        contentType: 'application/json; charset=utf-8',
        requestData: JSON.stringify(params)
    });
    return JSON.parse(response);
}

window.addEventListener('load', () => {
    chart = document.getElementById('background-chart');
    chart.style.cursor = 'grab';
    ctx = chart.getContext('2d');

    window.onresize = resize;
    resize();

    function draggable(element) {
        var dragging = null;
    
        element.addEventListener("mousedown", function(e) {
            var e = window.event || e;
            dragging = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                startChartX: chartX
            };
            if (element.setCapture) element.setCapture();
            chart.style.cursor = 'grabbing';
        });

        element.addEventListener("losecapture", function() {
            dragging = null;
            chart.style.cursor = 'grab';
        });
        document.addEventListener("mouseup", function() {
            dragging = null;
            chart.style.cursor = 'grab';
        }, true);
    
        var dragTarget = element.setCapture ? element : document;
        dragTarget.addEventListener("mousemove", function(e) {
            if (!dragging) return;
    
            var e = window.event || e;
            var dx = e.clientX - dragging.mouseX;
            var dy = e.clientY - dragging.mouseY;
            chartX = dragging.startChartX + dx;
    
            window.requestAnimationFrame(render);
        }, true);
    };
    draggable(chart);

    window.requestAnimationFrame(render);
    apiCall('TokenSaleChart', 'initialData',
        Math.ceil(chart.clientWidth / MAX_CANDLE_WIDTH_START),
        Math.floor(chart.clientWidth / MIN_CANDLE_WIDTH_START)).then((data) => {
        chartVals = data.vals;
        candleWidth = Math.round(chart.clientWidth / data.numCandles);
        chartX = (chart.clientWidth - 130) - data.vals.length / 5 * candleWidth;
        lastWidth = chart.clientWidth;
        window.requestAnimationFrame(render);
    });
});
