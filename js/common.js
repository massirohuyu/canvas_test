var CanvasApp = function(canvas) {
  this.canvas = canvas;

  var methods = {
    init: function(){
      
    },

    createFrame: function(config){
      var defaultFrameOptions = {
            left: 20,
            top: 20,
            stroke: '#444',
            strokeWidth: 5,
            fill: 'transparent',
            width: 300,
            height: 300
          },
          config = $.extend({}, config, defaultFrameOptions);

      var line_t = this._createLine(config.left,                config.top,                 'horizontal', config.width),
          line_r = this._createLine(config.left + config.width, config.top,                 'vertical',   config.height),
          line_b = this._createLine(config.left,                config.top + config.height, 'horizontal', config.width),
          line_l = this._createLine(config.left,                config.top,                 'vertical',   config.height);

      this.canvas.add(line_t, line_r, line_b, line_l);

      var hndl_lt = this._createHandle(config.left,                   config.top,                   'nw-resize'),
          hndl_ct = this._createHandle(config.left + config.width/2,  config.top,                   'n-resize'),
          hndl_rt = this._createHandle(config.left + config.width,    config.top,                   'ne-resize'),
          hndl_lc = this._createHandle(config.left,                   config.top + config.height/2, 'w-resize'),
          hndl_rc = this._createHandle(config.left + config.width,    config.top + config.height/2, 'w-resize'),
          hndl_lb = this._createHandle(config.left,                   config.top + config.height,   'ne-resize'),
          hndl_cb = this._createHandle(config.left + config.width/2,  config.top + config.height,   'n-resize'),
          hndl_rb = this._createHandle(config.left + config.width,    config.top + config.height,   'nw-resize');
      var hndls = [hndl_lt, hndl_ct, hndl_rt, hndl_lc, hndl_rc, hndl_lb, hndl_cb, hndl_rb];

      this.canvas.add(hndl_lt, hndl_ct, hndl_rt, hndl_lc, hndl_rc, hndl_lb, hndl_cb, hndl_rb);

      var self = this;
      var onMouseOver = function() {
            if(!this.selectable) {
              this.selectable = true;
              showHndl();
            }
          },
          onMouseOut = function() {
            if(this.selectable) {
              this.selectable = false;
              hideHndl();
            }
          },
          onMouseUp = function() {
            self.canvas.discardActiveObject();
          },
          onFrameLineMoving = function() {
            var line = this, center_x, center_y,
                width = line_t.width,
                height = line_l.height;
            if (line.id === line_t.id) {
              center_x = line.left;
              center_y = line.top + height/2;
            } else if(line.id === line_r.id) {
              center_x = line.left - width/2;
              center_y = line.top;
            } else if(line.id === line_b.id) {
              center_x = line.left;
              center_y = line.top - height/2;
            } else if(line.id === line_l.id) {
              center_x = line.left + width/2;
              center_y = line.top;
            }

            setAndRender(center_x, center_y, width, height);
          },
          onFrameHndlMoving = function() {
            var hndl = this, center_x, center_y,
                width = line_t.width,
                height = line_l.height;
            if (hndl.id === hndl_lt.id) {
              width = hndl_rt.left - hndl_lt.left;
              height = hndl_lb.top - hndl_lt.top;
              center_x = hndl.left + width/2;
              center_y = hndl.top + height/2;
            } else if(hndl.id === hndl_ct.id) {
              height = hndl_cb.top - hndl_ct.top;
              center_x = hndl.left;
              center_y = hndl.top + height/2;
            } else if(hndl.id === hndl_rt.id) {
              width = hndl_rt.left - hndl_lt.left;
              height = hndl_rb.top - hndl_rt.top;
              center_x = hndl.left - width/2;
              center_y = hndl.top + height/2;
            } else if(hndl.id === hndl_lc.id) {
              width = hndl_rc.left - hndl_lc.left;
              center_x = hndl.left + width/2;
              center_y = hndl.top;
            } else if(hndl.id === hndl_rc.id) {
              width = hndl_rc.left - hndl_lc.left;
              center_x = hndl.left - width/2;
              center_y = hndl.top;
            } else if(hndl.id === hndl_lb.id) {
              width = hndl_rb.left - hndl_lb.left;
              height = hndl_lb.top - hndl_lt.top;
              center_x = hndl.left + width/2;
              center_y = hndl.top - height/2;
            } else if(hndl.id === hndl_cb.id) {
              height = hndl_cb.top - hndl_ct.top;
              center_x = hndl.left;
              center_y = hndl.top - height/2;
            } else if(hndl.id === hndl_rb.id) {
              width = hndl_rb.left - hndl_lb.left;
              height = hndl_rb.top - hndl_rt.top;
              center_x = hndl.left - width/2;
              center_y = hndl.top - height/2;
            }

            line_t.set({width: width});
            line_r.set({height: height});
            line_b.set({width: width});
            line_l.set({height: height});

            setAndRender(center_x, center_y, width, height);
          },
          setAndRender = function(center_x, center_y, width, height) {
            line_t.set({left: center_x,           top: center_y - height/2});
            line_r.set({left: center_x + width/2, top: center_y});
            line_b.set({left: center_x,           top: center_y + height/2});
            line_l.set({left: center_x - width/2, top: center_y});
            line_t.setCoords();
            line_r.setCoords();
            line_b.setCoords();
            line_l.setCoords();

            hndl_lt.set({left: center_x - width/2, top: center_y - height/2});
            hndl_ct.set({left: center_x,           top: center_y - height/2});
            hndl_rt.set({left: center_x + width/2, top: center_y - height/2});
            hndl_lc.set({left: center_x - width/2, top: center_y});
            hndl_rc.set({left: center_x + width/2, top: center_y});
            hndl_lb.set({left: center_x - width/2, top: center_y + height/2});
            hndl_cb.set({left: center_x,           top: center_y + height/2});
            hndl_rb.set({left: center_x + width/2, top: center_y + height/2});
            hndl_lt.setCoords();
            hndl_ct.setCoords();
            hndl_rt.setCoords();
            hndl_lc.setCoords();
            hndl_rc.setCoords();
            hndl_lb.setCoords();
            hndl_cb.setCoords();
            hndl_rb.setCoords();

            self.canvas.renderAll();
          },
          showHndl = function(){
            hndls.forEach(function(hndl){
              hndl.opacity = 1;
              self.canvas.renderAll();
            });
          },
          hideHndl = function(){
            hndls.forEach(function(hndl){
              hndl.opacity = 0;
              self.canvas.renderAll();
            });
          };

      var lineEventFuncs = {
            'mouseover' : onMouseOver,
            'mouseout' : onMouseOut,
            'mouseup' : onMouseUp,
            'moving' : onFrameLineMoving
          },
          hndlEventFuncs = {
            'mouseover' : onMouseOver,
            'mouseout' : onMouseOut,
            'mouseup' : onMouseUp,
            'moving' : onFrameHndlMoving
          }
      line_t.on(lineEventFuncs);
      line_r.on(lineEventFuncs);
      line_b.on(lineEventFuncs);
      line_l.on(lineEventFuncs);
      hndl_lt.on(hndlEventFuncs);
      hndl_ct.on(hndlEventFuncs);
      hndl_rt.on(hndlEventFuncs);
      hndl_lc.on(hndlEventFuncs);
      hndl_rc.on(hndlEventFuncs);
      hndl_lb.on(hndlEventFuncs);
      hndl_cb.on(hndlEventFuncs);
      hndl_rb.on(hndlEventFuncs);
    },

    _createHandle: function(left, top, cursor) {

      var hndl = new fabric.Rect({
        id: this.getUniqueStr(),
        left: left,
        top: top,
        strokeWidth: 2,
        width: 10,
        height: 10,
        fill: '#fff',
        stroke: '#bbb',
        opacity: 0,
        hoverCursor: cursor,
        selectable: false
      });

      switch (cursor) {
        case 'n-resize':
          hndl.lockMovementX = true;
          break;
        case 'w-resize':
          hndl.lockMovementY = true;
          break;
      }

      hndl.hasControls = hndl.hasBorders = false;
      return hndl;
    },

    _createLine: function(left, top, vertical, length) {
      var right = (vertical == 'vertical') ? left : left + length,
          bottom = (vertical == 'vertical') ? top + length : top,
          coords = [left, top, right, bottom];

      var line = new fabric.Line( coords ,{
            id: this.getUniqueStr(),
            strokeWidth: 5,
            fill: '#444',
            stroke: '#444',
            strokeLineCap: 'square',
            selectable: false
          });

      line.hasControls = line.hasBorders = false;
      return line;
    },

    getUniqueStr: function(myStrong) {
      var strong = 1000;
      if (myStrong) strong = myStrong;
      return Date.now() + Math.floor(strong*Math.random());
    }
  }

  $.extend(this, methods);
  this.init();

  return this;
};

