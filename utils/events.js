let globalEvents = {}

function getEventObject(finalHost) {
  if (
    finalHost &&
    (finalHost.options) &&
    !(finalHost instanceof global.constructor) &&
    !(finalHost instanceof Object)
  ) {
    finalHost['events'] = finalHost['events'] ? finalHost['events'] : {}
    return finalHost['events']
  }
  return globalEvents
}

export function on(eventTypeStr, callback, returnEvent = false) {
  if (!eventTypeStr) return
  let events = getEventObject(this)
  eventTypeStr.split(/\s+/g).forEach(eventType => {
    let eventFixArray = eventType.split('.')
    let eventName = eventFixArray[0]
    let namespace = eventFixArray.join('.')
    if (!events[eventName]) {
      events[eventName] = []
    }
    events[eventName].push({
      callback,
      namespace,
      returnEvent,
    })
  })
}

export function off(eventTypeStr, callback) {
  let events = getEventObject(this)
  if (!eventTypeStr) {
    events = {}
    return true
  }
  let isFunc = typeof callback === 'function'

  eventTypeStr.split(/\s+/g).forEach((eventType) => {

    let eventFixArray = eventType.split('.')
    let eventName = eventFixArray[0]
    let namespace = eventFixArray.join('.')
    let eventsTypeArray = events[eventName] || []

    eventsTypeArray.forEach((op, index) => {
      if (op.namespace.substr(0, namespace.length) === namespace) {
        if (isFunc) {
          if (op.callback === callback) {
            events[eventName].splice(index, 1)
          }
        } else {
          events[eventName].splice(index, 1)
        }
      }
    })
  })
}

export function emit(eventTypeStr, ...args) {
  if (!eventTypeStr) {
    return true
  }
  let events = getEventObject(this)

  let event = {}
  eventTypeStr.split(/\s+/g).forEach((eventType) => {

    let eventFixArray = eventType.split('.')
    let eventName = eventFixArray[0]
    let namespace = eventFixArray.join('.')
    let eventsTypeArray = events[eventName] || []

    event.type = eventName
    event.detail = args

    eventsTypeArray.forEach((op) => {
      if (op.namespace.substr(0, namespace.length) === namespace) {
        op.callback.apply(null, op.returnEvent ? [event, ...args] : [...args])
      }
    })

  })
}

export function once(eventTypeStr, callback, returnEvent = false) {
  let context = this
  let onceCallback = function () {
    off.call(context, eventTypeStr, onceCallback)
    callback.apply(null, arguments)
  }
  on.call(context, eventTypeStr, onceCallback, returnEvent)
}

