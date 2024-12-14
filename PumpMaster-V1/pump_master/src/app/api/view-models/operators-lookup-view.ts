import type { operatorsLookup } from "../interface/operators-lookup";

class operatorsLookupView implements operatorsLookup {
	constructor(DriverID: number, DriverName: string, DriverStatus: 0 | 1) {
		this._DriverID = DriverID;
		this._DriverName = DriverName;
		this._DriverStatus = DriverStatus;
	}

	private _DriverID: number;
	get DriverID() {
		return this._DriverID;
	}

	private _DriverName: string;
	get DriverName() {
		return this._DriverName;
	}

	private _DriverStatus: 0 | 1;
	get DriverStatus() {
		return this._DriverStatus;
	}
}

export default operatorsLookupView;
