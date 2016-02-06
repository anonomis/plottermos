j = require("jquery2")
_ = require("lodash")
require("./ca/ca.js")

style = """
.sq {
  position: absolute;
  -webkit-transition: width 0.5s, height 0.5s, left 0.5s, right 0.5s, -webkit-transform 0.5s;
  transition: width 0.5s, height 0.5s, left 0.5s, right 0.5s, transform 0.5s;
}
.top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 5px;
}
.top .line {
  position: absolute;
  top: 3px;
  bottom: 3px;
  right: 3px;
  left: 3px;
  height: 1px;
  background-color: #44a;
}
.bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 5px;
}
.bottom .line {
  position: absolute;
  bottom: 3px;
  right: 2px;
  left: 3px;
  height: 1px;
  background-color: #44a;
}

.left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 5px;
}
.left .line {
  position: absolute;
  top: 3px;
  bottom: 3px;
  right: 3px;
  left: 3px;
  width: 1px;
  background-color: #44a;
}
.right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 5px;
}
.right .line {
  position: absolute;
  top: 3px;
  bottom: 3px;
  right: 3px;
  left: 3px;
  width: 1px;
  background-color: #44a;
}
.content {
  position: absolute;
  bottom: 5px;
  right: 5px;
  left: 5px;
  top: 5px;
  background-color: black;
  overflow-x: hidden;
  padding: 5px;
}
.content img {
  -webkit-filter: grayscale(100%);
}
.infobox {
  clear: right;
  float: right;
}

.fps {
    position: absolute;
    bottom: 0.5em;
    right: 0.2em;
    padding: 0.2em;
    line-height: 1.4em;
    background-color: #fff;
    color: #000;
    opacity: 0.5;
    min-width: 2.8em;
    white-space: nowrap;
}
"""

j("head").append(j("<style/>").html(style))

class Widget
  constructor: () ->
    @id = _.uniqueId("widget")
    @elem = j(@tmpl).attr "id", @id
    @children = []

  find: (selector) ->
    @elem.find(selector)

  child: (widget) ->
    @elem.append(widget.elem)
    @children.push widget

  kill: ->
    @clean()
    @elem.remove()
    @ded = true

  clean: ->
    ch.kill() for ch in @children
    @children = []

  cb: (fn, args...) =>
    console.log "outer", this
    =>
      console.log "inner", this
      unless @ded?
        console.log "do", fn, "arg", args
        fn.apply(this, args)
      else
        console.warn "You are talking to the dead"


class Box extends Widget
  constructor: ->
    super()
    console.log @

  middle: ->
    @find(".sq").css
      left: "33%"
      right: "33%"
      height: "100%"


  upperLeft: ->
    @find(".sq").css
      left: "0"
      right: "66%"
      height: "33%"

  tmpl: """
      <ctx>
        <div class="sq">
          <div class="top">
            <ctx>
              <div class="line"></div>
            </ctx>
          </div>
          <div class="left">
            <ctx>
              <div class="line"></div>
            </ctx>
          </div>
          <div class="right">
            <ctx>
              <div class="line"></div>
            </ctx>
          </div>
          <div class="bottom">
            <ctx>
              <div class="line"></div>
            </ctx>
          </div>
          <div class="content">
          </div>
        </div>
      </ctx>
    """
class RootWidget extends Widget
  constructor: () ->
    @id = "app"
    @elem = j("body")
    @children = []

class Orchestrator extends RootWidget
  constructor: ->
    super()
    @makeBox()

  moveUpperLeft: -> =>
    @children[@children.length - 1]?.upperLeft()
    _.delay @cb(@makeBox), 500

  makeBox: ->
    box = new Box()
    @child box

    box.middle()
    _.delay @cb(@moveUpperLeft(0)), 200

# orchestrator = new Orchestrator()

# clean = -> orchestrator.kill()
# _.delay clean, 3000


## And now for something completely different!
#window.requestAnimFrame = do ->
#  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or window.oRequestAnimationFrame or window.msRequestAnimationFrame or (callback, element) ->
#    window.setTimeout callback, 1000 / 60
#    return
do ->
  cvs = document.getElementById('canvas')
  ctx = cvs.getContext('2d')
  frameHeight = 2250
  frameWidth = 2250
  fps = 0
  fps_now = undefined
  fps_last = new Date
  fps_el = document.getElementById('fps')
  x = 0
  cvs.setAttribute 'height', frameHeight
  cvs.setAttribute 'width', frameWidth


  pal = [
    "#000000"
    "#2E454B"
    "#894947"
    "#9C7C63"
    "#8C785D"
    "#8B7F71"
  ]

  ctx.save()

  ctx.fillStyle = pal[1]
  ctx.fillRect 10, 10, 500, 500

  ctx.fillStyle = pal[0]


  render = ->

    ### FPS setup ###

    fps_now = new Date
    fps = 1000 / (fps_now - fps_last)
    fps_last = fps_now

    ### /FPS setup ###

    ### Frame Animation ###

    # example animation for fps accuracy and efficiency
    x++
    if x > frameWidth
      x = 0
    v = Math.floor(255 * x / frameWidth)

    ### /Frame Animation ###



    ### FPS printout ###

    fps_el.innerHTML = Math.round(fps) + ' fps'

    ### /FPS printout ###

    requestAnimFrame ->
      render()
      return
    return

  #render.call()
  return

# ---
# generated by js2coffee 2.1.0
