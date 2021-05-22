async function readTextFile(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

function getElapsedTime(startTime){
    return (Date.now() - startTime) / 1000.;
}

function isStringNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function getRelativeMousePosition(event, target) {
    target = target || event.target;
    const rect = target.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: rect.bottom - event.clientY,
    };
}

function pauseEvent(e) {
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: r,
        g: g,
        b: b
    };
}