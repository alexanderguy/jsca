var log = {
    debug: function() {
	console.log.apply(console, arguments);
    }
};

log.debug("code loading...");

var startCallback, stopCallback;

var makeLife = function (width, height, ctx) {

    var o = {
	world: {
	    width: width,
	    height: height,
	    past: [],
	    now: [],
	    age: 0,
	}
    };

    o.fillStyle = 'green';

    o.draw = function() {
	var world = o.world;

	var y, x;
	for (y = 0; y < o.world.height; y++) {
	    for (x = 0; x < o.world.width; x++) {
		var v = world.now[x + (y * o.world.width)];

		if (v) {
		    ctx.fillStyle = o.fillStyle;
		} else {
		    ctx.fillStyle = "black";
		}
		
		ctx.fillRect(x, y, 1, 1);
	    }
	}

    };

    o.tick = function () {
	o.world.past = o.world.now;
	o.world.now = [];
	var y, x;
	
	var val = function (x, y) {
	    if (x < 0 || (x > o.world.width - 1)) {
		return undefined;
	    }

	    if (y < 0 || (y > o.world.height - 1)) {
		return undefined;
	    }
	    
	    var v = o.world.past[x + (y * o.world.width)];
	    
	    return v;
	};

	var n = 0;

	var r = function(o, p) {
	    var v = val(x + o, y + p);

	    if (v) {
		n += 1;
	    }
	};

	for (y = 0; y < o.world.height; y++) {
	    for (x = 0; x < o.world.width; x++) {
		n = 0;

		r(-1, -1);
		r(0, -1);
		r(1, -1);

		r(-1, 0);
		r(1, 0);

		r(-1, 1);
		r(0, 1);
		r(1, 1);

		var v = val(x, y);

		if (v) {
		    if (n < 2) {
			v = false;
		    } else if (n == 2 || n == 3) {
			// Noop
		    } else if (n > 3) {
			v = false;
		    }
		} else {
		    if (n == 3) {
			v = true;
		    }
		}

		o.world.now[x + (y * o.world.width)] = v;
	    }
	}
	o.world.age += 1;
    };

    log.debug("making life on", ctx);

    // Zero Out The World
    {
	var i, ii;

	var past = o.world.past;

	for (i = 0; i < o.world.height; i++) {
	    for (ii = 0; ii < o.world.width; ii++) {
		past[ii + (i * o.world.width)] = false;
	    }
	}

	o.world.now = o.world.past;
    }

    o.set = function (x, y) {
	o.world.now[x + (y * o.world.width)] = true;

    };

    o.clear = function (x, y) {
	o.world.now[x + (y * o.world.width)] = false;
    };

    o.get = function (x, y) {
	return o.world.now[x + (y * o.world.width)];
    };

    return o;
};



var myLife;

window.onload = function () {
    log.debug("document loaded");
    var canvas = document.getElementById("world");

    var ctx = canvas.getContext("2d");

    var worldWidth = 100;
    var worldHeight = 100;
    myLife = makeLife(worldWidth, worldHeight, ctx);

    ctx.scale(canvas.width / worldWidth, canvas.height / worldHeight);

    var makeGlider = function (x, y) {
	var s = myLife.set;

	s(x + 1, y);
	s(x + 2, y + 1);
	s(x, y + 2);
	s(x + 1, y + 2);
	s(x + 2, y + 2);
    };

    var makeGliderGun = function(x, y) {
	var s = myLife.set;
	
	// Left Square
	s(x + 1, y + 5);
	s(x + 2, y + 5);
	s(x + 1, y + 6);
	s(x + 2, y + 6);

	// Left Arc Middle
	s(x + 11, y + 5);
	s(x + 11, y + 6);
	s(x + 11, y + 7);

	// Left Arc Top
	s(x + 12, y + 4);
	s(x + 13, y + 3);
	s(x + 14, y + 3);

	// Left Arc Bottom
	s(x + 12, y + 8);
	s(x + 13, y + 9);
	s(x + 14, y + 9);

	// Left Arc Cannon
	s(x + 15, y + 6);

	s(x + 17, y + 6);
	s(x + 18, y + 6);

	s(x + 16, y + 4);
	s(x + 17, y + 5);
	s(x + 17, y + 7);
	s(x + 16, y + 8);

	// Right Cube
	s(x + 35, y + 3);
	s(x + 35, y + 4);

	s(x + 36, y + 3);
	s(x + 36, y + 4);

	// Right Arc Left Arc
	s(x + 21, y + 4);
	s(x + 21, y + 3);
	s(x + 21, y + 5);

	s(x + 22, y + 4);
	s(x + 22, y + 3);
	s(x + 22, y + 5);

	s(x + 23, y + 2);
	s(x + 23, y + 6);

	s(x + 25, y + 1);
	s(x + 25, y + 2);

	s(x + 25, y + 6);
	s(x + 25, y + 7);
    }

    makeGliderGun(10, 10);

    myLife.draw();

    {
	var ageElement = document.getElementById("age");
	var heartBeat;

	var updateCB = function () {
	    myLife.tick();
	    myLife.draw();

	    ageElement.innerHTML = "Age: " + myLife.world.age;
	};

	var playButton = document.getElementById("playButton");

	var cb = function (e) {
	    var buttonText;
	    if (heartBeat) {
		clearInterval(heartBeat);
		heartBeat = undefined;
		buttonText = "Start";
	    } else {
		heartBeat = setInterval(updateCB, 75);
		buttonText = "Stop";
	    }
	    playButton.innerHTML = buttonText;
	};
	playButton.innerHTML = "Start";
	playButton.addEventListener("click", cb);
    };

    var canvasToWorld = function(x, y) {
	x *= worldWidth / canvas.width;
	y *= worldHeight / canvas.height;

	// This is a total fudge.
	x = Math.round(x) - 1
	y = Math.round(y) - 1

	return {
	    x: x,
	    y: y,
	};
    };

    var canvasOnClick = function (e) {
	var offsetX = 0, offsetY = 0;
	var parent = canvas;
	if (parent.offsetParent) {
	    do {
		offsetX += parent.offsetLeft;
		offsetY += parent.offsetTop;
	    } while ((parent = parent.offsetParent));
	}

	var x, y;

	x = e.pageX - offsetX;
	y = e.pageY - offsetY;

	var trans = canvasToWorld(x, y);
	x = trans.x;
	y = trans.y;

	log.debug("transformed click on X, Y:", x, y);

	if (myLife.get(x, y)) {
	    myLife.clear(x, y);
	} else {
	    myLife.set(x, y);
	}

	myLife.draw();
    }

    // canvas.addEventListener("click", canvasOnClick);
    {
	var state = {
	    drawValue: undefined,
	    mouseDown: false,
	    offset: {
		x: 0,
		y: 0,
	    }
	};

	var onmousedown = function (e) {
	    log.debug("mouse down");
	    state.mouseDown = true;

	    state.offset.x = 0;
	    state.offset.y = 0;

	    var parent = canvas;
	    if (parent.offsetParent) {
		do {
		    state.offset.x += parent.offsetLeft;
		    state.offset.y += parent.offsetTop;
		} while ((parent = parent.offsetParent));
	    }

	    log.debug("offset is:", state.offset.x, state.offset.y);
	    var x, y;
	    x = e.x - state.offset.x;
	    y = e.y - state.offset.y;

	    var trans = canvasToWorld(x, y);
	    x = trans.x;
	    y = trans.y;

	    state.drawValue = !myLife.get(x, y);

	    myLife.draw();
	    log.debug("mouse down", state, "draw value", state.drawValue);
	};

	var onmouseup = function (e) {
	    if (state.mouseDown) {
		// canvasOnClick(e);
	    }

	    state.mouseDown = false;
	    myLife.draw();
	};

	var onmousemove = function (e) {
	    if (!state.mouseDown) {
		return;
	    }

	    var x, y;
	    x = e.x - state.offset.x;
	    y = e.y - state.offset.y;

	    var trans = canvasToWorld(x, y);
	    x = trans.x;
	    y = trans.y;

	    log.debug("transformed click on X, Y:", x, y);

	    log.debug("draw value is", state.drawValue);
	    if (state.drawValue) {
		myLife.set(x, y);
	    } else {
		myLife.clear(x, y);
	    }

	    myLife.draw();
	};

	canvas.addEventListener("mousedown", onmousedown);
	canvas.addEventListener("mousemove", onmousemove);
	canvas.addEventListener("mouseup", onmouseup);

    }
};


log.debug("loading done.");
