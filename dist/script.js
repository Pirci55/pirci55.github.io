(function () {
    var canvas_overlay = document.getElementById('overlay');
    if (!canvas_overlay) {
        console.error('Canvas overlay not defined');
        return;
    }
    ;
    var canvas_context = canvas_overlay.getContext('2d');
    if (!canvas_context) {
        console.error('Canvas context is null');
        return;
    }
    ;
    var paint_button = document.getElementById('toggle-paint');
    if (!paint_button) {
        console.error('Paint button not defined');
        return;
    }
    ;
    var is_draw_guide_shown = false;
    var is_range_bug_shown = false;
    var is_paint = false;
    var is_load = false;
    var mouse = {
        x: 0, y: 0,
        lmb: false, rmb: false
    };
    function draw_rect(x, y, w, h, style) {
        canvas_context.fillStyle = style;
        canvas_context.fillRect(x, y, w, h);
    }
    ;
    function clear_rect(x, y, w, h) { canvas_context.clearRect(x, y, w, h); }
    ;
    function update_canvas_size() {
        canvas_overlay.width = document.documentElement.offsetWidth;
        canvas_overlay.height = document.documentElement.offsetHeight;
    }
    ;
    function click_event_handler(event) {
        if (event.button == 0)
            mouse.lmb = event.type == 'mousedown';
        if (event.button == 2)
            mouse.rmb = event.type == 'mousedown';
    }
    ;
    window.addEventListener('mousedown', click_event_handler);
    window.addEventListener('mouseup', click_event_handler);
    window.addEventListener('mousemove', function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        if (!is_paint
            && is_load
            && !is_range_bug_shown
            && (mouse.x > canvas_overlay.width
                || mouse.y > canvas_overlay.height)) {
            alert("I'm a bug! Hello! :3\n\nYou have left the painting canvas area");
            is_range_bug_shown = true;
        }
        ;
    });
    window.addEventListener('resize', update_canvas_size);
    window.addEventListener('load', function () {
        is_load = true;
        update_canvas_size();
    });
    canvas_overlay.addEventListener('contextmenu', function (event) { event.preventDefault(); });
    paint_button.addEventListener('click', function () {
        is_paint = !is_paint;
        if (is_paint) {
            if (!is_draw_guide_shown) {
                is_draw_guide_shown = true;
                alert('LMB - paint\nRMB - clear');
            }
            ;
            canvas_overlay.style.pointerEvents = 'unset';
            paint_button.style.opacity = '1';
        }
        else {
            canvas_overlay.style.pointerEvents = 'none';
            paint_button.style.opacity = '';
        }
        ;
    });
    (function frame(delta) {
        requestAnimationFrame(frame);
        if (!is_paint)
            return;
        if (mouse.lmb) {
            var colors = [
                'red', 'orange', 'yellow',
                'lawngreen', 'aqua', 'blue', 'blueviolet'
            ];
            draw_rect(mouse.x - 4, mouse.y - 4, 8, 8, colors[Math.floor(Math.random() * colors.length)]);
        }
        ;
        if (mouse.rmb) {
            clear_rect(mouse.x - 8, mouse.y - 8, 16, 16);
        }
        ;
    })(1);
})();
