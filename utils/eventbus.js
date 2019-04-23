var bus = getApp().globalData.bus;
if (!bus) {
    bus = {}
}
export default {
    $emit(eventName, ...arg) {
        var cbs = bus[eventName];
        console.log(cbs);
        for (var cb of cbs) {
            cb.apply(null, arg);
        }
    },
    $on(eventName, cb) {
        bus[eventName] = bus[eventName] || [];
        bus[eventName].push(cb);
    },
    $off(eventName, cb) {
        var cbs = bus[eventName] || [];
        if (cb) {
            for (var index = 0; index < cbs.length; ++index) {
                if (cb == o) {
                    cbs.splice(index, 1);
                    break
                }
            }
        } else {
            bus[eventName] = [];
        }
    }
}