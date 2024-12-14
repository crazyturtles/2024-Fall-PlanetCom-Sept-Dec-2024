import type { pumpTypesLookup } from "../interface/pump-types-lookup";

class pumpTypesLookupView implements pumpTypesLookup {
	constructor(PumpTypeID: number, PumpTypeName: string, PumpTypeStatus: 0 | 1) {
		this._PumpTypeID = PumpTypeID;
		this._PumpTypeName = PumpTypeName;
		this._PumpTypeStatus = PumpTypeStatus;
	}

	private _PumpTypeID: number;
	get PumpTypeID() {
		return this._PumpTypeID;
	}

	private _PumpTypeName: string;
	get PumpTypeName() {
		return this._PumpTypeName;
	}

	private _PumpTypeStatus: 0 | 1;
	get PumpTypeStatus() {
		return this._PumpTypeStatus;
	}
}

export default pumpTypesLookupView;
