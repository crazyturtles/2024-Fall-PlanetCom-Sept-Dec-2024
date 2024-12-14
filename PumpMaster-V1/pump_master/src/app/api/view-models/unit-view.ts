import type { unitViewData } from "../interface/unit";

class unitView implements unitViewData {
	constructor(
		UnitID: number,
		UnitNumber: string,
		PumpType: string,
		Operator: string,
		UnitMake: string,
		UnitManufacturer: string,
		UnitSerialNumber: string,
		UnitLicensePlate: string,
		UnitCVIExpiry: Date,
		UnitPipeLastChanged: Date,
		DeckPipeLastChanged: Date,
		UnitStatus: 0 | 1,
	) {
		this._UnitID = UnitID;
		this._UnitNumber = UnitNumber;
		this._PumpType = PumpType;
		this._Operator = Operator;
		this._UnitMake = UnitMake;
		this._UnitManufacturer = UnitManufacturer;
		this._UnitSerialNumber = UnitSerialNumber;
		this._UnitLicensePlate = UnitLicensePlate;
		this._UnitCVIExpiry = UnitCVIExpiry;
		this._UnitPipeLastChanged = UnitPipeLastChanged;
		this._DeckPipeLastChanged = DeckPipeLastChanged;
		this._UnitStatus = UnitStatus;
	}

	private _UnitID: number;
	get UnitID() {
		return this._UnitID;
	}

	private _UnitNumber: string;
	get UnitNumber() {
		return this._UnitNumber;
	}
	set UnitNumber(value: string) {
		this._UnitNumber = value;
	}

	private _PumpType: string;
	get PumpType() {
		return this._PumpType;
	}
	set PumpType(value: string) {
		this._PumpType = value;
	}

	private _Operator: string;
	get Operator() {
		return this._Operator;
	}
	set Operator(value: string) {
		this._Operator = value;
	}

	private _UnitMake: string;
	get UnitMake() {
		return this._UnitMake;
	}
	set UnitMake(value: string) {
		this._UnitMake = value;
	}

	private _UnitManufacturer: string;
	get UnitManufacturer() {
		return this._UnitManufacturer;
	}
	set UnitManufacturer(value: string) {
		this._UnitManufacturer = value;
	}

	private _UnitSerialNumber: string;
	get UnitSerialNumber() {
		return this._UnitSerialNumber;
	}
	set UnitSerialNumber(value: string) {
		this._UnitSerialNumber = value;
	}

	private _UnitLicensePlate: string;
	get UnitLicensePlate() {
		return this._UnitLicensePlate;
	}
	set UnitLicensePlate(value: string) {
		this._UnitLicensePlate = value;
	}

	private _UnitCVIExpiry: Date;
	get UnitCVIExpiry() {
		return this._UnitCVIExpiry;
	}
	set UnitCVIExpiry(value: Date) {
		this._UnitCVIExpiry = value;
	}

	private _UnitPipeLastChanged: Date;
	get UnitPipeLastChanged() {
		return this._UnitPipeLastChanged;
	}
	set UnitPipeLastChanged(value: Date) {
		this._UnitPipeLastChanged = value;
	}

	private _DeckPipeLastChanged: Date;
	get DeckPipeLastChanged() {
		return this._DeckPipeLastChanged;
	}
	set DeckPipeLastChanged(value: Date) {
		this._DeckPipeLastChanged = value;
	}

	private _UnitStatus: 0 | 1;
	get UnitStatus() {
		return this._UnitStatus;
	}
	set UnitStatus(value: 0 | 1) {
		this._UnitStatus = value;
	}
}

export default unitView;
