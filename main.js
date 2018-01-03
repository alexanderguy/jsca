var log = {
    debug: function() {
	console.log.apply(console, arguments);
    }
};

log.debug("code loading...");

var makeLife = function (width, height, ctx) {
    var canvas = ctx.canvas;

    ctx.scale(canvas.width / width, canvas.height / height);

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

	log.debug("age", o.world.age);
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
	o.world.now[x + (y * o.world.width)] = clear;
    };

    return o;
};



var myLife;

window.onload = function () {
    log.debug("document loaded");
    var canvas = document.getElementById("world");

    var ctx = canvas.getContext("2d");
    myLife = makeLife(100, 100, ctx);

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

    var heatbeat = setInterval(function () {
	myLife.tick();
	myLife.draw();
    }, 75);
};


log.debug("loading done.");
