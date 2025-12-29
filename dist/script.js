window.onload = function () {
    var videos = document.querySelectorAll('video');
    var canvas_overlay = document.getElementById('overlay');
    var intersection_observer = new IntersectionObserver(intersection_observer_callback, {
        threshold: 0.2
    });
    var mouse = {
        x: 0, y: 0,
        lmb: false, rmb: false
    };
    var is_range_bug_shown = false;
    var is_paint = false;
    function intersection_observer_callback(entries) {
        entries.forEach(function (entry) {
            if (entry.target.tagName.toLocaleLowerCase() != 'video')
                return;
            var video = entry.target;
            if (entry.isIntersecting)
                video.play();
            else
                video.pause();
        });
    }
    ;
    function start_canvas() {
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
        update_canvas_size();
        window.addEventListener('resize', update_canvas_size);
        window.addEventListener('mousemove', function (event) {
            if (paint_button.checkVisibility()
                && !is_paint
                && !is_range_bug_shown
                && (mouse.x > canvas_overlay.width || mouse.y > canvas_overlay.height)) {
                alert("I'm a bug! Hello! :3\n\nYou have left the painting canvas area");
                is_range_bug_shown = true;
            }
            ;
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
    });
    if (canvas_overlay)
        start_canvas();
    else
        console.error('Canvas overlay not defined');
    videos.forEach(function (element) {
        intersection_observer.observe(element);
    });
};
