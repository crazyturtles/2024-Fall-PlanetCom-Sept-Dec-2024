export interface unitViewData {
	UnitID: number;
	UnitNumber: string;
	PumpType: string;
	Operator: string;
	UnitMake: string;
	UnitManufacturer: string;
	UnitSerialNumber: string;
	UnitLicensePlate: string;
	UnitCVIExpiry: Date;
	UnitPipeLastChanged: Date;
	DeckPipeLastChanged: Date;
	UnitStatus: 0 | 1;
}
