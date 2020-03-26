const { StopTime } = require('../../models/index');
const { populateMany, docId, stopLoader, routeLoader, stopTimeLoader, serviceLoader, serviceExceptionLoader } = require('./loaders');

const intToDay = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
}

const valid = (stopTime, date) => {
    const day = intToDay[date.getDay()];
    return stopTime[day];
};

const resolvers = {
    StopRoute: {
        id: docId,
        stop: async ({ stop }, args, context) => {
            return await stopLoader.load(stop);
        },
        route: async ({ route }, args, context) => {
            return await routeLoader.load(route);
        },
        stopTimes: async ({ stopTimes }, args, context) => {
            return await populateMany(stopTimes, StopTime);
        },
        nextStopTime: async ({ stopTimes }, args, context) => {
            const now = new Date();
            const nowInt = (now.getHours() * 60) + now.getMinutes();
            const times = await populateMany(stopTimes, StopTime);

            let next = null
            let nextTimeDelta = null;

            for (let stopTime of times) {
                timeDelta = stopTime.time.int - nowInt;

                if (timeDelta > 0 && (timeDelta < nextTimeDelta || nextTimeDelta === null)) {
                    next = stopTime;
                    nextTimeDelta = timeDelta;
                }
            }

            return next;
        }
    }
}

module.exports = resolvers;