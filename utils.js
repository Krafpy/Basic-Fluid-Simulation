async function readTextFile(path) {
    const response = await fetch(path);
    const text = await response.text();
    return text;
}

function getElapsedTime(startTime){
    return (Date.now() - startTime) / 1000.;
}