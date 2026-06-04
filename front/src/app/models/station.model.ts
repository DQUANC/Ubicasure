export class StationModel{
    constructor(
        public _id: string,
        public lat: number,
        public lng: number,
        public name: string,
        public type: string,
        public phone: string,
        public address: string,
        public rating: number,
        public businessHours:string,
        public user: string
    ){}
}