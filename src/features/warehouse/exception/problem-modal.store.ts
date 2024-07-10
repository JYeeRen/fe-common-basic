import {makeAutoObservable} from "mobx";

export class ProblemModalStore {
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }
}