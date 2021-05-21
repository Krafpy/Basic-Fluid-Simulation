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