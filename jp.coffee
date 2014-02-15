class JP
  ws: null

  startWebSocket: (callback) ->
    this.startWSCallback = callback
    this.ws = new WebSocket("ws://127.0.0.1:31415")
    this.ws.onerror = this.onWSError.bind(this)
    this.ws.onopen = this.onWSOpen.bind(this)
    this.ws.onclose = this.onWSClose.bind(this)
    this.ws.onmessage = this.handleMessage.bind(this)

  handleMessage: (message) ->
    data = message.data
    # console.log data
    dataObject = JSON.parse(data)
    if "event" of dataObject
      console.log dataObject
      for handler in this.eventHandlers
        handler.call(this, dataObject)

  onWSOpen: () ->
    console.log "ws open"
    this.sendMessage("GAMEINIT")
    this.startWSCallback()


  onWSError: () ->
    this.ws = null
    console.log "connection error"

  onWSClose: () ->
    this.ws = null
    console.log "connection close"

  sendMessage: (msgObject) ->
    if typeof msgObject == "object"
      message = JSON.stringify(msgObject)
    else
      message = msgObject
    that = this
    if this.ws is null
      this.startWebSocket ->
        that.ws.send(message)
    else
      this.ws.send(message)

  # this.param: callback
  # callback(device-name)
  connect: (callback) ->
    this.sendMessage
      event: "connect"
      layout: 1
    this.deviceConnectCallback = callback

  eventHandlers: []
  onEvent: (eventHandler) ->
    this.eventHandlers.push(eventHandler)


this.JP = new JP()