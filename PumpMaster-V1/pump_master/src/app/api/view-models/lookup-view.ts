import type { lookupData } from "../interface/lookup-data";

class lookupView implements lookupData {
	constructor(lookupID: number, lookupName: string) {
		this._lookupID = lookupID;
		this._lookupName = lookupName;
	}

	private _lookupID: number;
	get pumpTypeID() {
		return this._lookupID;
	}

	private _lookupName: string;
	get pumpTypeName() {
		return this._lookupName;
	}
}

export default lookupView;
