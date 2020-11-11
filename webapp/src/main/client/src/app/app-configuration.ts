import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Configuration } from './shared/config';

@Injectable({
    providedIn: 'root'
}) export class AppConfiguration {

    private config: Configuration;
    public invalidServer: boolean;

    public get context() {
        return this.config.context;
    }

    public get sorts() {
        return this.config.sorts;
    }

    public get defaultLang() {
        return this.config.defaultLang;
    }

    public get selRows() {
        return this.config.selRows;
    }

    public get defaultRows() {
        return this.config.defaultRows;
    }

    public get urlFields() {
        return this.config.urlFields;
    }

    public get sources() {
        return this.config.sources;
    }

    public get vdkAPI() {
        return this.config.vdkAPI;
    }
    

    /**
     * List the files holding section configuration in assets/configs folder
     * ['search'] will look for /assets/configs/search.json
     */
    private configs: string[] = [];

    constructor(
        private http: HttpClient) { }

    public configLoaded() {
        return this.config && true;
    }

    public load(): Promise<any> {
        console.log('loading config...');
        const promise = this.http.get('assets/config.json')
            .toPromise()
            .then(cfg => {
                this.config = cfg as Configuration;
            }).then(() => {
                return this.loadConfigs();
            });
        return promise;
    }

    async loadConfigs(): Promise<any> {

        // Load common configs
        this.configs.forEach(async config => {
            const url = 'assets/configs/' + config + '.json';
            const value = await this.mergeFile(url) as string;
            if (value) {
                this.config[config] = value;
            } else {
                console.log(url + ' not found');
            }
        });

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    mergeFile(url: string): Promise<any> {

        return new Promise((resolve, reject) => {
            this.http.get(url)
                .subscribe(
                    res => {
                        resolve(res);
                    },
                    error => {
                        resolve(false);
                        return of(url + ' not found');
                    }
                );
        });
    }

}
