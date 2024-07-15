let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let eraser = document.getElementById('eraser');
let brush = document.getElementById('brush');
let reSetCanvas = document.getElementById("clear");
let save = document.getElementById("save");
/* let selectBg = document.querySelector('.bg-btn');
let bgGroup = document.querySelector('.color-group');
let bgcolorBtn = document.querySelectorAll('.bgcolor-item'); */
let penDetail = document.getElementById("penDetail");
let aColorBtn = document.getElementsByClassName("color-item");
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");


let range1 = document.getElementById('range1');
let range2 = document.getElementById('range2');
let showOpacity = document.querySelector('.showOpacity');
let closeBtn = document.querySelectorAll('.closeBtn');
let eraserEnabled = false;
// let activeBgColor = '#fff';
let ifPop = false;
let lWidth = 2;
let opacity = 1;
let strokeColor = 'rgba(0,0,0,1)';
let radius = 5;

let prevBrushStyle = "#b1987a";
let prevlineWidth = 2;

autoSetSize();

setCanvasBg('white');

listenToUser();

//初始化默认画笔颜色
context.strokeStyle = '#b1987a';

/* 下面是实现相关效果的函数，可以不用看 */

function autoSetSize() {
    canvasSetSize();
    function canvasSetSize() {
        // 把变化之前的画布内容copy一份，然后重新画到画布上
        let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        let pageWidth = document.documentElement.clientWidth;
        let pageHeight = document.documentElement.clientHeight;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        context.putImageData(imgData, 0, 0);
        context.strokeStyle = prevBrushStyle;
    }

    window.onresize = function () {
        canvasSetSize();
    }
}

// 监听用户鼠标事件
function listenToUser() {
    // 定义一个变量初始化画笔状态
    let painting = false;
    // 记录画笔最后一次的位置
    let lastPoint = { x: undefined, y: undefined };

    if (document.body.ontouchstart !== undefined) {
        canvas.ontouchstart = function (e) {
            painting = true;
            let x1 = e.touches[0].clientX;
            let y1 = e.touches[0].clientY;
            if (eraserEnabled) {//要使用eraser
                context.save();
                context.globalCompositeOperation = "destination-out";
                context.beginPath();
                radius = (lWidth / 2) > 5 ? (lWidth / 2) : 5;
                context.arc(x1, y1, radius, 0, 2 * Math.PI);
                context.clip();
                // context.clearRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "#0000ff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.restore();
                lastPoint = { 'x': x1, 'y': y1 }
            } else {
                lastPoint = { 'x': x1, 'y': y1 }
            }
        };
        canvas.ontouchmove = function (e) {
            let x1 = lastPoint['x'];
            let y1 = lastPoint['y'];
            let x2 = e.touches[0].clientX;
            let y2 = e.touches[0].clientY;
            if (!painting) { return }
            if (eraserEnabled) {
                moveHandler(x1, y1, x2, y2);
                //记录最后坐标
                lastPoint['x'] = x2;
                lastPoint['y'] = y2;
            } else {
                let newPoint = { 'x': x2, 'y': y2 };
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        };

        canvas.ontouchend = function () {
            painting = false;
            canvasDraw();
        }
    } else {
        // 鼠标按下事件
        canvas.onmousedown = function (e) {
            painting = true;
            let x1 = e.clientX;
            let y1 = e.clientY;
            if (eraserEnabled) {//要使用eraser
                //鼠标第一次点下的时候擦除一个圆形区域，同时记录第一个坐标点
                // context.save();
                // context.globalCompositeOperation = "destination-out";
                // context.beginPath();
                // radius = (lWidth / 2) > 5 ? (lWidth / 2) : 5;
                // context.arc(x1, y1, radius, 0, 2 * Math.PI);
                // context.clip();
                // context.clearRect(0, 0, canvas.width, canvas.height);
                // // context.fillStyle = "#0000ff";
                // // context.fillRect(0, 0, canvas.width, canvas.height);
                // context.restore();

                lastPoint = { 'x': x1, 'y': y1 }
            } else {
                lastPoint = { 'x': x1, 'y': y1 }
            }
        }

        // 鼠标移动事件
        canvas.onmousemove = function (e) {
            let x1 = lastPoint['x'];
            let y1 = lastPoint['y'];
            let x2 = e.clientX;
            let y2 = e.clientY;
            if (!painting) { return }
            if (eraserEnabled) {
                // moveHandler(x1, y1, x2, y2);
                // //记录最后坐标
                // lastPoint['x'] = x2;
                // lastPoint['y'] = y2;
                let newPoint = { 'x': x2, 'y': y2 };
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            } else {
                let newPoint = { 'x': x2, 'y': y2 };
                drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
                lastPoint = newPoint;
            }
        }

        // 鼠标松开事件
        canvas.onmouseup = function () {
            painting = false;
            canvasDraw();
        }
    }
}

// 
function moveHandler(x1, y1, x2, y2) {
    //获取两个点之间的剪辑区域四个端点
    var asin = radius * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
    var acos = radius * Math.cos(Math.atan((y2 - y1) / (x2 - x1)))
    var x3 = x1 + asin;
    var y3 = y1 - acos;
    var x4 = x1 - asin;
    var y4 = y1 + acos;
    var x5 = x2 + asin;
    var y5 = y2 - acos;
    var x6 = x2 - asin;
    var y6 = y2 + acos;

    //保证线条的连贯，所以在矩形一端画圆
    context.save();
    context.beginPath();
    context.globalCompositeOperation = "destination-out";
    radius = (lWidth / 2) > 5 ? (lWidth / 2) : 5;
    context.arc(x2, y2, radius, 0, 2 * Math.PI);
    context.clip()
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0000ff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();

    //清除矩形剪辑区域里的像素
    context.save();
    context.beginPath();
    context.globalCompositeOperation = "destination-out";
    context.moveTo(x3, y3);
    context.lineTo(x5, y5);
    context.lineTo(x6, y6);
    context.lineTo(x4, y4);
    context.closePath();
    context.clip();
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#0000ff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}


// 画线函数
function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.lineWidth = lWidth;
    // context.strokeStyle = strokeColor;
    // context.globalAlpha = opacity;
    // 设置线条末端样式。
    context.lineCap = "round";
    // 设定线条与线条间接合处的样式
    context.lineJoin = "round";
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    if (eraserEnabled) {
        context.strokeStyle = "#fff";
        context.lineWidth = 8;
    }
    context.stroke();
    context.closePath();
}

// 点击橡皮檫
eraser.onclick = function () {
    if (!eraserEnabled) {
        prevBrushStyle = context.strokeStyle;
        prevlineWidth = context.lineWidth;
    }
    eraserEnabled = true;
    eraser.classList.add('active');
    brush.classList.remove('active');
}
// 点击画笔
brush.onclick = function () {
    console.log(context.strokeStyle, context.lineWidth);
    context.strokeStyle = prevBrushStyle;
    context.lineWidth = prevlineWidth;
    console.log(context.strokeStyle, context.lineWidth);

    brush.classList.add('active');
    eraser.classList.remove('active');

    if (!eraserEnabled) {
        if (!ifPop) {
            // 弹出框
            penDetail.classList.add('active');
        } else {
            penDetail.classList.remove('active');
        }
        ifPop = !ifPop;
    }
    eraserEnabled = false;
}

// 实现清屏
reSetCanvas.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBg('white');
    canvasHistory = [];
    undo.classList.remove('active');
    redo.classList.remove('active');
}

// 重新设置canvas背景颜色
function setCanvasBg(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

//上传图片
let submit = document.getElementById('submit');
save.onclick = function () {
    //填充背景被橡皮擦擦掉的透明色
    // var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // for (var i = 0; i < imageData.data.length; i += 1) {
    //     // 当该像素是透明的,则设置成白色
    //     if (imageData.data[i] == 0) {
    //         imageData.data[i] = 255;
    //     }
    // }
    // context.putImageData(imageData, 0, 0);


    let imgUrl = canvas.toDataURL('image/jpeg');//获取canvas的url
    // getBase64(imgUrl);
    let imgBlob = dataURLtoBlob(imgUrl);
    console.log(imgBlob);

    let files = new window.File([imgBlob], "img.jpg", { type: "image/jpeg" });
    console.log(files);
    let container = new DataTransfer();
    container.items.add(files);
    document.getElementById('IMG').files = container.files;

    document.getElementById('submit').click();//提交按钮

}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function getBase64(url) {
    //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
    let imgTemp = document.createElement("img");
    imgTemp.setAttribute('crossOrigin', 'anonymous');
    let dataURL = '';
    imgTemp.onload = () => { //要先确保图片完整获取到，这是个异步事件
        if (imgTemp.height > 750) {
            var ratio1 = imgTemp.height / imgTemp.width;
            imgTemp.height = 750;
            imgTemp.width = 750 / ratio1;
        }
        else if (imgTemp.width > 700) {
            var ratio1 = imgTemp.height / imgTemp.width;
            imgTemp.width = 700;
            imgTemp.height = ratio1 * 700;
        }
        canvas = document.createElement('canvas');
        canvas.width = imgTemp.width;
        canvas.height = imgTemp.height;

        canvas.getContext("2d").drawImage(imgTemp, 0, 0, canvas.width, canvas.height); //将图片绘制到canvas中
        dataURL = canvas.toDataURL('image/jpeg'); //转换图片为dataURL
        console.log(dataURL);
        document.getElementById('TEXT').value = dataURL;
        document.getElementById('submit').click();
    };
    document.body.appendChild(imgTemp);
    imgTemp.src = url;
}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

// 实现了切换背景颜色
/* for (let i = 0; i < bgcolorBtn.length; i++) {
    bgcolorBtn[i].onclick = function (e) {
        e.stopPropagation();
        for (let i = 0; i < bgcolorBtn.length; i++) {
            bgcolorBtn[i].classList.remove("active");
            this.classList.add("active");
            activeBgColor = this.style.backgroundColor;
            setCanvasBg(activeBgColor);
        }

    }
}
document.onclick = function(){
    bgGroup.classList.remove('active');
}

selectBg.onclick = function(e){
    bgGroup.classList.add('active');
    e.stopPropagation();
} */

// 实现改变画笔粗细的功能 1-20 放大的倍数 1 10 实际大小呢？ 2-20
range1.onchange = function () {
    thickness.style.transform = 'scale(' + (parseInt(range1.value)) + ')';
    lWidth = parseInt(range1.value * 2);
    prevlineWidth = lWidth;
}

// range2.onchange = function () {
//     opacity = 1 - parseInt(this.value) / 10;
//     if (opacity !== 0) {
//         showOpacity.style.opacity = opacity;
//     }
// }

// 改变画笔颜色
getColor();

function getColor() {
    for (let i = 0; i < aColorBtn.length; i++) {
        aColorBtn[i].onclick = function (e) {
            // e.stopPropagation();
            for (let i = 0; i < aColorBtn.length; i++) {
                aColorBtn[i].classList.remove("active");
                this.classList.add("active");
                activeColor = this.style.backgroundColor;
                // alert(this.style.backgroundColor); //
                context.fillStyle = activeColor;
                context.strokeStyle = activeColor;
            }
            penDetail.classList.remove('active');
            ifPop = false;
        }
    }
    prevBrushStyle = context.strokeStyle;
}

// 实现撤销和重做的功能
let canvasHistory = [];
let step = -1;

// 绘制方法
function canvasDraw() {
    step++;
    if (step < canvasHistory.length) {
        canvasHistory.length = step   // 截断数组
    }
    // 添加新的绘制到历史记录
    canvasHistory.push(canvas.toDataURL());
    if (step > 0) {
        undo.classList.add('active');
    }
}

// 撤销方法
function canvasUndo() {
    if (step > 0) {
        step--;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[step];
        canvasPic.onload = function () { context.drawImage(canvasPic, 0, 0); }
        undo.classList.add('active');
        redo.classList.add('active');
    } else {
        //直接清屏
        context.clearRect(0, 0, canvas.width, canvas.height);
        setCanvasBg('white');
        // canvasHistory = [];
        undo.classList.remove('active');
        redo.classList.remove('active');

        undo.classList.remove('active');
        // alert('Can not continue to undo!');
    }
}
// 重做方法
function canvasRedo() {
    if (step < canvasHistory.length) {
        step++;
        let canvasPic = new Image();
        canvasPic.src = canvasHistory[step - 1];
        canvasPic.onload = function () {
            context.drawImage(canvasPic, 0, 0);
        }
        // redo.classList.add('active');
    } else {
        redo.classList.remove('active');
        alert('Can not continue to redo!');
    }
}
undo.onclick = function () {
    canvasUndo();
}
redo.onclick = function () {
    canvasRedo();
}



for (let index = 0; index < closeBtn.length; index++) {
    closeBtn[index].onclick = function (e) {
        let btnParent = e.target.parentElement;
        btnParent.classList.remove('active');
    }

}

window.onbeforeunload = function () {
    return "Reload site?";
};