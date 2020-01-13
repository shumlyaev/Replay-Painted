let canv = document.querySelector('#mainCanvas');
let ctx = canv.getContext('2d');
let mousePressed = false;
let saving = false;
let radius = $('#changeWidth').val();
let coords = [];

canv.width = canv.parentNode.offsetWidth;
canv.height = 800;
ctx.lineWidth = radius * 2;
$('#lableChangeWidth').html('Line Width: ' + radius);

$('#startSavingBtn').on('click', function(e) {
    saving = true;
    $(this).attr('disabled', true);
    $('#endSavingBtn').attr('disabled', false);
});
$('#endSavingBtn').on('click', function(e) {
    saving = false;
    $(this).attr('disabled', true);
    $('#startSavingBtn').attr('disabled', false);
    save();
});
$('#replayBtn').on('click', function(e) {
    $('#startSavingBtn').attr('disabled', false);
    $('#endSavingBtn').attr('disabled', true);
    clear();
    replay();
});
$('#clearBtn').on('click', function(e) {
    clear();
});
$('#changeWidth').on('input', function(e) {
    radius = $(this).val();
    ctx.lineWidth = radius * 2;
    $('#lableChangeWidth').html('Line Width: ' + radius);
});

canv.onmousedown = function(e) {
    mousePressed = true;
}
document.onmouseup = function(e) {
    mousePressed = false;
    coords.push('NaN');
    ctx.beginPath();
}
canv.onmousemove = function(e) {
    if (mousePressed) {
        curCoords = {x: e.offsetX, y: e.offsetY};
        if (saving) {
            coords.push(curCoords);
        }
        draw(curCoords);
    }
}
function draw(data) {
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(data.x, data.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
}
function clear() {
    coords = [];
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canv.width, canv.height);
    ctx.fillStyle = 'black';
    ctx.beginPath();
}
function save() {
    localStorage.setItem('coords', JSON.stringify(coords));
}
function replay() {
    let cur;
    coords = JSON.parse(localStorage.getItem('coords'));
    let interval = setInterval(function() {
        if(!coords.length) {
            clearInterval(interval);
            ctx.beginPath();
            return;
        }
        cur = coords.shift();
        draw(cur);
    }, 20);
}
