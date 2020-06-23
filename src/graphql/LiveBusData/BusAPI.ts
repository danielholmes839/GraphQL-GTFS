import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { Bus } from './Bus';
import { BusCache } from './BusCache';
import { OCTranspoResponse, StopCodeKV } from './types';
import { Stop } from '../types';

class BusAPI {
    base: AxiosRequestConfig;
    api: AxiosInstance;
    cache: BusCache

    constructor() {
        this.base = {
            method: 'get',
            url: 'https://api.octranspo1.com/v1.3/GetNextTripsForStopAllRoutes',
            responseType: 'json',
            params: {
                appID: process.env.appID,
                apiKey: process.env.apiKey,
                format: 'json',
                stopNo: ''
            }
        }
        this.cache = new BusCache();
        this.api = axios.create();
    }

    private createConfig(stopCode: string): AxiosRequestConfig {
        // creates the config for the request
        let config: AxiosRequestConfig = Object.assign(this.base);
        config.params.stopNo = stopCode;
        return config;
    }

    private async request(stopCode: string): Promise<OCTranspoResponse> {
        // requests the new live bus data and return the value to be cached
        console.log(`OC Transpo API ${stopCode}`);
        let config = this.createConfig(stopCode);
        let response: AxiosResponse = await this.api.get(config.url, config)
        let data: OCTranspoResponse = response.data.GetRouteSummaryForStopResult;
        return data;
    }

    private async createKV(stop: Stop): Promise<StopCodeKV> {
        // creates the value to be cached
        let data: OCTranspoResponse = await this.request(stop.code);
        let routes: StopCodeKV = {} // This object will be cached

        if (data == undefined) {
            // Could not access OC Transpo so return an empty object
            console.log('Could not access OC Transpo');
            return routes;
        }

        if (!Array.isArray(data.Routes.Route)) {
            // Routes is not a list
            data.Routes.Route = [data.Routes.Route];
        }

        for (let route of data.Routes.Route) {
            // Process each route
            if (route == null) {
                continue;
            }

            if (!routes.hasOwnProperty(route.RouteNo)) {
                // Make an array to store buses for this route
                routes[route.RouteNo] = [];
            }

            if (!Array.isArray(route.Trips.Trip)) {
                // Trips is not a list
                route.Trips.Trip = [route.Trips.Trip];
            }

            for (let trip of route.Trips.Trip) {
                // Bus is created for every trip
                if (trip != undefined) routes[route.RouteNo].push(new Bus(trip, route, stop));
            }
        }
        return routes;
    }

    public async get(stop: Stop, routeNumber: string): Promise<Bus[]> {
        // Get the data for the next 3 buses of a route heading toward that stop
        if (!this.cache.has(stop.code)) {
            this.cache.store(stop.code, this.createKV(stop));                                // update the cache
        } else {
            console.log(`OC Transpo Cache STOP:${stop.code} ROUTE:${routeNumber}`);
        }
        let buses: Bus[] = (await this.cache.get(stop.code))[routeNumber];                  // await then get the buses for the route
        if (!buses) buses = [];                                                             // empty array if there's no buses
        return buses;
    }
}

export default new BusAPI();