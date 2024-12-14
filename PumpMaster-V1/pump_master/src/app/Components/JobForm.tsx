import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CommentsModal from "./CommentsModal";
import CribberModal from "./CribberModal";
import PourTypeSelector from "./PourTypeSelector";
// TODO: Validation

interface Customer {
	CustomerID: number;
	CustomerCompanyName: string;
	CustomerDefaultHourlyRate: number;
	SaturdayPourRate: number;
	WashoutRate: number;
	SecondaryOperatorRate: number;
	OnsiteQaRate: number;
	AdditionalDunnageRate: number;
	AdditionalLineRate: number;
	FlagPersonRate: number;
	RoadBan75Rate: number;
	RoadBan90Rate: number;
	FuelSurchargeRate: number;
	Discount: number;
	FlatRate: number;
}

interface Job {
	JobID: number;
	JobCompanyJobNum: string;
	JobStatus: number;
	JobStartTime: string;
	JobPumpTypeID: number;
	JobUnitID: number;
	JobDriverID: number;
	JobTypeID: number;
	JobCustomerID: number;
	JobSiteAddress: string;
	JobSiteArea: string;
	JobSitePhone: string;
	CustomerCompanyName: string;
	SupplierCompanyName: string;
	JobDiscount: number;
	PourTypeName: string;
	DriverName: string;
	UnitNumber: string;
	PumpTypeName: string;
	JobTotalPoured: number;
	JobPourTypeOther: string;
	JobStartDate: string;
	JobTotalHours: number;
	JobFlatRate: number;
	CarbonLevyRate: number;
	SaturdayPourRate: number;
	JobWashoutRate: number;
	SecondaryOperatorRate: number;
	OnsiteQaRate: number;
	AdditionalDunnageRate: number;
	AdditionalLineRate: number;
	FlagPersonRate: number;
	RoadBanRate: number;
	HourlyRate: number;
	JobPourRate: number;
	SaturdayPourCharge: boolean;
	OffsiteWashout: boolean;
	SecondaryOperatorCharge: boolean;
	OnsiteQaCharge: boolean;
	AdditionalDunnageCharge: boolean;
	AdditionalLineCharge: boolean;
	FlagPersonCharge: boolean;
	RoadBanPercent: number;
	FuelSurchargeCharge: boolean;
	FuelSurchargeRate: number;
	CustomerConfirmed: number;
	WorkOrderNumber: string;
	SupplierConfirmed: number;
	JobCustomerPO: string;
	JobCustomerJobNum: string;
	JobMapLocation: string;
	JobComments: string;
	JobColor: number;
	JobConfirmedDate: string;
}

interface PourType {
	PourTypeID: number;
	PourTypeName: string;
}

interface PumpType {
	PumpTypeID: number;
	PumpTypeName: string;
	PumpTypeHourlyRate: number;
	PumpTypePourRate: number;
}

interface Option {
	id: number;
	name: string;
}

interface Supplier {
	SupplierID: number;
	SupplierCompanyName: string;
}

interface JobFormProps {
	jobId: number;
	onClose: () => void;
	initialData?: any;
}

const JobForm = ({ jobId, onClose, initialData }: JobFormProps) => {
	const [selectedPumpTypeId, setSelectedPumpTypeId] = useState<number | null>(
		null,
	);
	const [job, setJob] = useState<Job | null>(initialData || null);
	const [m3Required, setM3Required] = useState(0);
	const [pourRate, setPourRate] = useState(0);
	const [pourTotal, setPourTotal] = useState(0);
	const [timeOnSite, setTimeOnSite] = useState(0);
	const [hourlyRate, setHourlyRate] = useState(0);
	const [hourlyTotal, setHourlyTotal] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [isSaturdayPourEnabled, setIsSaturdayPourEnabled] = useState(false);
	const [saturdayPourRate, setSaturdayPourRate] = useState(0);
	const [saturdayPourTotal, setSaturdayPourTotal] = useState(0);
	const [isOffsiteWashoutEnabled, setIsOffsiteWashoutEnabled] = useState(false);
	const [washoutRate, setWashoutRate] = useState(0);
	const [washoutTotal, setWashoutTotal] = useState(0);
	const [roadBanSelection, setRoadBanSelection] = useState<string>("0");
	const [roadBanRate, setRoadBanRate] = useState(0);
	const [roadBanPercent, setRoadBanPercent] = useState(0);
	const [roadBanTotal, setRoadBanTotal] = useState(0);
	const [isSecondaryOperatorEnabled, setIsSecondaryOperatorEnabled] =
		useState(false);
	const [secondaryOperatorRate, setSecondaryOperatorRate] = useState(0);
	const [secondaryOperatorTotal, setSecondaryOperatorTotal] = useState(0);
	const [isOnsiteQAEnabled, setIsOnsiteQAEnabled] = useState(false);
	const [onsiteQARate, setOnsiteQARate] = useState(0);
	const [onsiteQATotal, setOnsiteQATotal] = useState(0);
	const [isAdditionalDunnageEnabled, setIsAdditionalDunnageEnabled] =
		useState(false);
	const [additionalDunnageRate, setAdditionalDunnageRate] = useState(0);
	const [additionalDunnageTotal, setAdditionalDunnageTotal] = useState(0);
	const [isAdditionalLineEnabled, setIsAdditionalLineEnabled] = useState(false);
	const [additionalLineRate, setAdditionalLineRate] = useState(0);
	const [additionalLineTotal, setAdditionalLineTotal] = useState(0);
	const [isFlagPersonEnabled, setIsFlagPersonEnabled] = useState(false);
	const [flagPersonRate, setFlagPersonRate] = useState(0);
	const [flagPersonTotal, setFlagPersonTotal] = useState(0);
	const [isCarbonLevyEnabled, setIsCarbonLevyEnabled] = useState(false);
	const [carbonLevyRate, setCarbonLevyRate] = useState(0);
	const [carbonLevyTotal, setCarbonLevyTotal] = useState(0);
	const [discountRate, setDiscountRate] = useState(0);
	const [flatRate, setFlatRate] = useState(0);
	const [total, setTotal] = useState(0);
	const [GSTRate, setGST] = useState(0);
	const [jobTypes, setJobTypes] = useState<Option[]>([]);
	const [pumpTypes, setPumpTypes] = useState<PumpType[]>([]);
	const [selectedJobType, setSelectedJobType] = useState<string>("");
	const [selectedPumpType, setSelectedPumpType] = useState<string>("");
	const [jobPourTypeOther, setJobPourTypeOther] = useState<string>("");
	const [ticketNo, setTicketNo] = useState("");
	const [isCustomerConfirmed, setIsCustomerConfirmed] = useState(false);
	const [customerList, setCustomer] = useState<Customer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState(0);
	const [workOrder, setWorkOrder] = useState("");
	const [jobDate, setJobDate] = useState("");
	const [arrivalOnSite, setArrivalOnSite] = useState<string>("");
	const [concreteOnSite, setConcreteOnSite] = useState("");
	const [isSupplierConfirmed, setIsSupplierConfirmed] = useState(false);
	const [supplierList, setSupplier] = useState<Supplier[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState("");
	const [customerPO, setCustomerPO] = useState("");
	const [customerJobNo, setCustomerJobNo] = useState("");
	const [siteAddress, setSiteAddress] = useState("");
	const [siteContact, setSiteContact] = useState("");
	const [mapLocation, setMapLocation] = useState("");
	const [jobComments, setJobComments] = useState("");
	const [jobConfirmed, setJobConfirmed] = useState(false);
	const [jobStatus, setJobStatus] = useState(0);
	const [jobConfirmedDate, setJobConfirmedDate] = useState<string | null>(null);
	const [selectedPourTypes, setSelectedPourTypes] = useState<PourType[]>([]);
	const [isCribberModalOpen, setIsCribberModalOpen] = useState(false);
	const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
	const [selectedCustomerID, setSelectedCustomerID] = useState<number | null>(
		null,
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [unitNumber, setUnitNumber] = useState("");
	const [totalJobCount, setTotalJobCount] = useState(0);
	const [addCribber, setAddCribber] = useState(true);
	const [customerSearch, setCustomerSearch] = useState<string>("");
	const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
	const [supplierSearch, setSupplierSearch] = useState<string>("");
	const [filteredSuppliers, setFilteredSupplier] = useState<Supplier[]>([]);
	const [isInitialSelection, setIsInitialSelection] = useState(true);
	const router = useRouter();
	const [selectedColor, setSelectedColor] = useState("");
	const [isConcreteOnSiteManual, setIsConcreteOnSiteManual] = useState(false);

	useEffect(() => {
		const fetchJobData = async () => {
			try {
				console.log("InitalDAta: ", initialData);
				if (jobId) {
					const response = await fetch(`http://localhost:3001/job/${jobId}`);
					const data = await response.json();
					setJob(Array.isArray(data) ? data[0] : data);
					console.log("Job id: ", jobId);
					if (data) {
						setSelectedJobType(data.JobTypeID.toString());
						setSelectedPumpType(data.JobPumpTypeID.toString());
						setJobPourTypeOther(data.JobPourTypeOther.toString());
						setPourRate(data.JobPourRate ?? 0);
						setHourlyRate(data.JobHourlyRate ?? 0);
						setTimeOnSite(data.JobTotalHours ?? 0);
						setM3Required(data.JobTotalPoured ?? 0);
						setIsSaturdayPourEnabled(data.SaturdayPourCharge);
						setIsOffsiteWashoutEnabled(data.OffsiteWashout);
						setIsSecondaryOperatorEnabled(data.SecondaryOperatorCharge);
						setIsOnsiteQAEnabled(data.OnsiteQaCharge);
						setIsAdditionalDunnageEnabled(data.AdditionalDunnageCharge);
						setIsAdditionalLineEnabled(data.AdditionalLineCharge);
						setIsFlagPersonEnabled(data.FlagPersonCharge);
						setIsCarbonLevyEnabled(data.FuelSurchargeCharge ?? 0);
						setRoadBanSelection(data.RoadBanPercent);
						setFlatRate(data.JobFlatRate);
						setDiscountRate(Number((data.JobDiscount ?? 0).toFixed(2)));
						setCarbonLevyRate(Number((data.FuelSurchargeRate ?? 0).toFixed(2)));
						setSaturdayPourRate(data.SaturdayPourRate ?? 0);
						setWashoutRate(data.JobWashoutRate);
						setSecondaryOperatorRate(data.SecondaryOperatorRate ?? 0);
						setOnsiteQARate(data.OnsiteQaRate ?? 0);
						setAdditionalDunnageRate(data.AdditionalDunnageRate ?? 0);
						setAdditionalLineRate(data.AdditionalLineRate ?? 0);
						setFlagPersonRate(data.FlagPersonRate ?? 0);
						setRoadBanRate(data.RoadBanRate ?? 0);
						setRoadBanPercent(data.RoadBanPercent);
						setTicketNo(data.JobCompanyJobNum);
						setIsCustomerConfirmed(data.CustomerConfirmed);
						setSelectedCustomer(data.JobCustomerID);
						setWorkOrder(data.WorkOrderNumber);
						setJobDate(
							data.JobStartDate
								? new Date(data.JobStartDate).toISOString().split("T")[0]
								: "",
						);
						setArrivalOnSite(data.JobStartTime);
						setConcreteOnSite(data.JobPourTime);
						setIsSupplierConfirmed(data.SupplierConfirmed);
						setSelectedSupplier(data.JobSupplierID);
						setCustomerPO(data.JobCustomerPO);
						setCustomerJobNo(data.JobCustomerJobNum);
						setSiteAddress(data.JobSiteAddress);
						setSiteContact(data.JobSitePhone);
						setMapLocation(data.JobMapLocation);
						setJobComments(data.JobComments);
						setJobConfirmed(data.JobStatus >= 10);
						setJobConfirmedDate(
							data.JobStatus >= 10 ? data.JobConfirmedDate : null,
						);
						setJobStatus(data.JobStatus);
						setSelectedColor(data.JobColor || "");
					}
				}
				console.log("Job data fetched successfully! job Id: ", jobId);
			} catch (error) {
				console.error("Error fetching job data:", error);
			}
		};

		if (jobId) {
			fetchJobData();
		}
	}, [jobId, initialData]);

	useEffect(() => {
		if (initialData) {
			setSelectedJobType(initialData.JobTypeID.toString());
			setSelectedPumpType(initialData.JobPumpTypeID.toString());
			setJobPourTypeOther(initialData.JobPourTypeOther.toString());
			setPourRate(initialData.JobPourRate ?? 0);
			setHourlyRate(initialData.JobHourlyRate ?? 0);
			setTimeOnSite(initialData.JobTotalHours ?? 0);
			setM3Required(initialData.JobTotalPoured ?? 0);
			setIsSaturdayPourEnabled(initialData.SaturdayPourCharge);
			setIsOffsiteWashoutEnabled(initialData.OffsiteWashout);
			setIsSecondaryOperatorEnabled(initialData.SecondaryOperatorCharge);
			setIsOnsiteQAEnabled(initialData.OnsiteQaCharge);
			setIsAdditionalDunnageEnabled(initialData.AdditionalDunnageCharge);
			setIsAdditionalLineEnabled(initialData.AdditionalLineCharge);
			setIsFlagPersonEnabled(initialData.FlagPersonCharge);
			setIsCarbonLevyEnabled(initialData.FuelSurchargeCharge ?? 0);
			setRoadBanSelection(initialData.RoadBanPercent);
			setFlatRate(initialData.JobFlatRate);
			setDiscountRate(Number((initialData.JobDiscount ?? 0).toFixed(2)));
			setCarbonLevyRate(
				Number((initialData.FuelSurchargeRate ?? 0).toFixed(2)),
			);
			setSaturdayPourRate(initialData.SaturdayPourRate ?? 0);
			setWashoutRate(initialData.JobWashoutRate);
			setSecondaryOperatorRate(initialData.SecondaryOperatorRate ?? 0);
			setOnsiteQARate(initialData.OnsiteQaRate ?? 0);
			setAdditionalDunnageRate(initialData.AdditionalDunnageRate ?? 0);
			setAdditionalLineRate(initialData.AdditionalLineRate ?? 0);
			setFlagPersonRate(initialData.FlagPersonRate ?? 0);
			setRoadBanRate(initialData.RoadBanRate ?? 0);
			setRoadBanPercent(initialData.RoadBanPercent);
			setTicketNo(initialData.JobCompanyJobNum);
			setIsCustomerConfirmed(initialData.CustomerConfirmed);
			setSelectedCustomer(initialData.JobCustomerID);
			setWorkOrder(initialData.WorkOrderNumber);
			setJobDate(
				initialData.JobStartDate
					? new Date(initialData.JobStartDate).toISOString().split("T")[0]
					: "",
			);
			setArrivalOnSite(initialData.JobStartTime);
			setConcreteOnSite(initialData.JobPourTime);
			setIsSupplierConfirmed(initialData.SupplierConfirmed);
			setSelectedSupplier(initialData.JobSupplierID);
			setCustomerPO(initialData.JobCustomerPO);
			setCustomerJobNo(initialData.JobCustomerJobNum);
			setSiteAddress(initialData.JobSiteAddress);
			setSiteContact(initialData.JobSitePhone);
			setMapLocation(initialData.JobMapLocation);
			setJobComments(initialData.JobComments);
			setJobConfirmed(initialData.JobConfirmedDate);
			setUnitNumber(initialData.UnitNumber ? initialData.UnitNumber : null);
			setSelectedPourTypes(initialData.PourTypes);

			setSelectedColor(initialData.JobColor);
		}
	}, [initialData]);

	useEffect(() => {
		const fetchDropdownData = async () => {
			try {
				const [jobTypeRes, pumpTypeRes, customerRes, supplierRes] =
					await Promise.all([
						fetch("http://localhost:3001/job/dropdown/jobtypes"),
						fetch("http://localhost:3001/pumpType"),
						fetch("http://localhost:3001/job/dropdown/customer"),
						fetch("http://localhost:3001/job/dropdown/supplier"),
					]);

				setJobTypes(await jobTypeRes.json());
				setPumpTypes(await pumpTypeRes.json());
				setCustomer(await customerRes.json());
				setSupplier(await supplierRes.json());
			} catch (error) {
				console.error("Error fetching dropdown data:", error);
			}
		};

		fetchDropdownData();
	}, []);

	useEffect(() => {
		setPourTotal(m3Required * pourRate * timeOnSite);
	}, [m3Required, pourRate, timeOnSite]);

	useEffect(() => {
		setHourlyTotal(timeOnSite * hourlyRate);
	}, [timeOnSite, hourlyRate]);

	useEffect(() => {
		if (isSaturdayPourEnabled) {
			setSaturdayPourTotal(timeOnSite * saturdayPourRate);
		} else {
			setSaturdayPourTotal(0);
		}
	}, [isSaturdayPourEnabled, timeOnSite, saturdayPourRate]);

	useEffect(() => {
		setWashoutTotal(isOffsiteWashoutEnabled ? washoutRate : 0);
	}, [isOffsiteWashoutEnabled, washoutRate]);

	useEffect(() => {
		if (isSecondaryOperatorEnabled) {
			setSecondaryOperatorTotal(timeOnSite * secondaryOperatorRate);
		} else {
			setSecondaryOperatorTotal(0);
		}
	}, [isSecondaryOperatorEnabled, timeOnSite, secondaryOperatorRate]);

	useEffect(() => {
		if (isOnsiteQAEnabled) {
			setOnsiteQATotal(timeOnSite * onsiteQARate);
		} else {
			setOnsiteQATotal(0);
		}
	}, [isOnsiteQAEnabled, timeOnSite, onsiteQARate]);

	useEffect(() => {
		if (isAdditionalDunnageEnabled) {
			setAdditionalDunnageTotal(timeOnSite * additionalDunnageRate);
		} else {
			setAdditionalDunnageTotal(0);
		}
	}, [isAdditionalDunnageEnabled, timeOnSite, additionalDunnageRate]);

	useEffect(() => {
		if (isAdditionalLineEnabled) {
			setAdditionalLineTotal(timeOnSite * additionalLineRate);
		} else {
			setAdditionalLineTotal(0);
		}
	}, [isAdditionalLineEnabled, timeOnSite, additionalLineRate]);

	useEffect(() => {
		if (isFlagPersonEnabled) {
			setFlagPersonTotal(timeOnSite * flagPersonRate);
		} else {
			setFlagPersonTotal(0);
		}
	}, [isFlagPersonEnabled, timeOnSite, flagPersonRate]);

	useEffect(() => {
		setRoadBanTotal(timeOnSite * roadBanRate);
	}, [timeOnSite, roadBanRate]);

	useEffect(() => {
		const calculateTotal = () => subtotal * discountRate;
		setTotal(calculateTotal());
	}, [subtotal, discountRate]);

	useEffect(() => {
		let calculatedSubtotal =
			flatRate > 0
				? flatRate
				: pourTotal +
				hourlyTotal +
				saturdayPourTotal +
				washoutTotal +
				secondaryOperatorTotal +
				onsiteQATotal +
				additionalDunnageTotal +
				additionalLineTotal +
				flagPersonTotal +
				roadBanTotal;

		const calculatedCarbonLevyTotal = isCarbonLevyEnabled
			? calculatedSubtotal * carbonLevyRate
			: 0;
		calculatedSubtotal = calculatedSubtotal + calculatedCarbonLevyTotal;

		setCarbonLevyTotal(calculatedCarbonLevyTotal);
		setSubtotal(calculatedSubtotal);
	}, [
		pourTotal,
		hourlyTotal,
		saturdayPourTotal,
		washoutTotal,
		secondaryOperatorTotal,
		onsiteQATotal,
		additionalDunnageTotal,
		additionalLineTotal,
		flagPersonTotal,
		roadBanTotal,
		isCarbonLevyEnabled,
		carbonLevyRate,
		discountRate,
		flatRate,
		roadBanSelection,
	]);

	useEffect(() => {
		const updateJobDetails = async () => {
			if (!jobDate || (jobId !== 0 && ticketNo)) return;
			try {
				const [year, month, day] = jobDate.split("-");
				const formattedDate = `${month}${day}${year}`;

				const response = await fetch(
					`http://localhost:3001/job/job-count/${jobDate}`,
				);
				const data = await response.json();

				if (data.success) {
					const jobCount = data.jobCount || 0;
					const ticketNo = `${formattedDate}-${String(jobCount + 1).padStart(2, "0")}`;
					setTicketNo(ticketNo);
				}
			} catch (error) {
				console.error("Error updating job details:", error);
			}
		};

		updateJobDetails();
	}, [jobDate, jobId, ticketNo]);

	useEffect(() => {
		if (arrivalOnSite && !isConcreteOnSiteManual) {
			const [hours, minutes] = arrivalOnSite.split(":").map(Number);
			const totalMinutes = hours * 60 + minutes + 30;
			const newHours = Math.floor(totalMinutes / 60) % 24;
			const newMinutes = totalMinutes % 60;
			const formattedTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
			setConcreteOnSite(formattedTime);
		}
	}, [arrivalOnSite]);

	const handleConcreteOnSiteChange = (value) => {
		setIsConcreteOnSiteManual(true);
		setConcreteOnSite(value);
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		// ADD UNIQUE ticketNo CHECK
		if (!ticketNo.trim()) {
			newErrors.ticketNo = "Ticket No. is required.";
		} else if (ticketNo.trim().length > 50) {
			newErrors.ticketNo = "Ticket No. must be 50 characters or less.";
		}

		if (workOrder.trim().length > 50) {
			newErrors.workOrder = "Work Order must be 50 characters or less.";
		}

		if (customerPO.trim().length > 50) {
			newErrors.customerPO = "Customer PO must be 50 characters or less.";
		}

		if (customerJobNo.trim().length > 50) {
			newErrors.customerJobNo =
				"Customer Job No. must be 50 characters or less.";
		}

		if (siteAddress.trim().length > 255) {
			newErrors.siteAddress = "Site Address must be 255 characters or less.";
		}

		if (siteContact.trim().length > 50) {
			newErrors.siteContact = "Site Contact must be 50 characters or less.";
		}

		if (siteContact === "") {
			newErrors.siteContact = "Site Contact cannot be blank.";
		}

		if (mapLocation.trim().length > 255) {
			newErrors.mapLocation = "Map Location must be 255 characters or less.";
		}

		if (m3Required < 0) {
			newErrors.m3Required =
				"M3 Required must be greater than or equal to zero.";
		}

		if (pourRate < 0) {
			newErrors.pourRate = "Pour Rate must be greater than or equal to zero.";
		}

		if (timeOnSite < 0) {
			newErrors.timeOnSite =
				"Time on Site must be greater than or equal to zero.";
		}

		if (hourlyRate < 0) {
			newErrors.hourlyRate =
				"Hourly Rate must be greater than or equal to zero.";
		}

		if (saturdayPourRate < 0) {
			newErrors.saturdayPourRate =
				"Saturday Pour Rate must be greater than or equal to zero.";
		}

		if (washoutRate < 0) {
			newErrors.washoutRate =
				"Washout Rate must be greater than or equal to zero.";
		}

		if (roadBanRate < 0) {
			newErrors.roadBanRate =
				"Road Ban Rate must be greater than or equal to zero.";
		}

		if (secondaryOperatorRate < 0) {
			newErrors.secondaryOperatorRate =
				"Secondary Operator Rate must be greater than or equal to zero.";
		}

		if (onsiteQARate < 0) {
			newErrors.onsiteQARate =
				"Onsite QA Rate must be greater than or equal to zero.";
		}

		if (additionalDunnageRate < 0) {
			newErrors.additionalDunnageRate =
				"Additional Dunnage Rate must be greater than or equal to zero.";
		}

		if (additionalLineRate < 0) {
			newErrors.additionalLineRate =
				"Additional Line Rate must be greater than or equal to zero.";
		}

		if (flagPersonRate < 0) {
			newErrors.flagPersonRate =
				"Flag Person Rate must be greater than or equal to zero.";
		}

		if (flatRate < 0) {
			newErrors.flatRate = "Flat Rate must be greater than or equal to zero.";
		}

		if (carbonLevyRate < 0 || carbonLevyRate > 1) {
			newErrors.carbonLevyRate = "Carbon Levy Rate must be between 0 and 1.";
		}

		if (discountRate < 0 || discountRate > 100) {
			newErrors.discountRate = "Discount Rate must be between 0 and 100.";
		}

		if (arrivalOnSite === "") {
			newErrors.arrivalOnSite = "Arrival On Site is required.";
		}

		if (jobDate === "") {
			newErrors.jobDate = "Job Date is required.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const getLocalTimeISOString = () => {
		const now = new Date();
		const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
		return localTime.toISOString();
	};

	const refreshPourRate = () => {
		const selectedPumpType = pumpTypes.find(
			(p) => p.PumpTypeID === selectedPumpTypeId,
		);
		if (selectedPumpType) {
			setPourRate(selectedPumpType.PumpTypePourRate);
		}
	};

	const refreshHourlyRate = () => {
		const selectedPumpType = pumpTypes.find(
			(p) => p.PumpTypeID === selectedPumpTypeId,
		);
		if (selectedPumpType) {
			setHourlyRate(selectedPumpType.PumpTypeHourlyRate);
		}
	};

	const refreshCustomerRate = (
		rateSetter: (value: number) => void,
		rateField: keyof Customer,
	) => {
		const selectedCustomerDetails = customerList.find(
			(c) => c.CustomerID === selectedCustomer,
		);
		if (
			selectedCustomerDetails &&
			selectedCustomerDetails[rateField] !== undefined
		) {
			if (rateField === "RoadBan90Rate" || rateField === "RoadBan75Rate") {
				if (roadBanSelection === "90") {
					rateSetter(selectedCustomerDetails.RoadBan90Rate);
				} else if (roadBanSelection === "75") {
					rateSetter(selectedCustomerDetails.RoadBan75Rate);
				} else {
					rateSetter(0);
				}
			} else {
				rateSetter(selectedCustomerDetails[rateField] as number);
			}
		}
	};

	const refreshAllCustomerDefaults = () => {
		const selectedCustomerDetails = customerList.find(
			(c) => c.CustomerID === selectedCustomer,
		);
		if (selectedCustomerDetails) {
			setSaturdayPourRate(selectedCustomerDetails.SaturdayPourRate);
			setWashoutRate(selectedCustomerDetails.WashoutRate);
			setSecondaryOperatorRate(selectedCustomerDetails.SecondaryOperatorRate);
			setOnsiteQARate(selectedCustomerDetails.OnsiteQaRate);
			setAdditionalDunnageRate(selectedCustomerDetails.AdditionalDunnageRate);
			setAdditionalLineRate(selectedCustomerDetails.AdditionalLineRate);
			setFlagPersonRate(selectedCustomerDetails.FlagPersonRate);
			setCarbonLevyRate(
				Number(selectedCustomerDetails.FuelSurchargeRate.toFixed(2)),
			);
			setDiscountRate(Number(selectedCustomerDetails.Discount.toFixed(2)));

			if (roadBanSelection === "90") {
				setRoadBanRate(selectedCustomerDetails.RoadBan90Rate);
			} else if (roadBanSelection === "75") {
				setRoadBanRate(selectedCustomerDetails.RoadBan75Rate);
			} else {
				setRoadBanRate(0);
			}
		}
	};

	const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = Number(e.target.value);
		setSelectedCustomer(selectedId);

		const selectedCustomerDetails = customerList.find(
			(c) => c.CustomerID === selectedId,
		);

		if (selectedCustomerDetails) {
			if (
				selectedCustomerDetails.CustomerDefaultHourlyRate !== null &&
				selectedCustomerDetails.CustomerDefaultHourlyRate !== 0
			) {
				const userConfirmed = window.confirm(
					`Would you like to change the Hourly Rate to ${selectedCustomerDetails.CustomerDefaultHourlyRate.toFixed(2)}?`,
				);

				if (userConfirmed) {
					setHourlyRate(selectedCustomerDetails.CustomerDefaultHourlyRate);
				}
			}

			setSaturdayPourRate(selectedCustomerDetails.SaturdayPourRate);
			setWashoutRate(selectedCustomerDetails.WashoutRate);
			setSecondaryOperatorRate(selectedCustomerDetails.SecondaryOperatorRate);
			setOnsiteQARate(selectedCustomerDetails.OnsiteQaRate);
			setAdditionalDunnageRate(selectedCustomerDetails.AdditionalDunnageRate);
			setAdditionalLineRate(selectedCustomerDetails.AdditionalLineRate);
			setFlagPersonRate(selectedCustomerDetails.FlagPersonRate);
			setCarbonLevyRate(
				Number(selectedCustomerDetails.FuelSurchargeRate.toFixed(2)),
			);
			setDiscountRate(Number(selectedCustomerDetails.Discount.toFixed(2)));

			if (roadBanSelection === "90") {
				setRoadBanRate(selectedCustomerDetails.RoadBan90Rate);
			} else if (roadBanSelection === "75") {
				setRoadBanRate(selectedCustomerDetails.RoadBan75Rate);
			} else {
				setRoadBanRate(0);
			}
		}
	};

	const handleCribberSelect = (selectedCribber: string) => {
		setSiteContact(selectedCribber);
	};

	const handleOpenCommentsModal = (customerID: number) => {
		setSelectedCustomerID(customerID);
		setIsCommentsModalOpen(true);
	};

	const handleSupplierSearch = async (searchTerm) => {
		try {
			const querySearchTerm = searchTerm.trim() === "" ? "" : searchTerm.trim();

			const url = querySearchTerm
				? `http://localhost:3001/job/dropdown/supplierSearch?search=${encodeURIComponent(querySearchTerm)}`
				: "http://localhost:3001/job/dropdown/supplier";

			console.log("Fetching suppliers from URL:", url);

			const response = await fetch(url);

			if (!response.ok) {
				console.error(`HTTP error! status: ${response.status}`);
				return;
			}

			const data = await response.json();
			console.log("API Response:", data);

			if (Array.isArray(data) && data.length > 0) {
				setFilteredSupplier(data);

				if (querySearchTerm.trim()) {
					setSelectedSupplier(data[0].SupplierID);
				}
			} else {
				if (jobId) {
					//this somehow is working as intended do not touch
					//this is to prevent the supplier from being cleared when the search term is empty
				} else {
					setFilteredSupplier([]);

					setSelectedSupplier("");
				}
			}
		} catch (error) {
			console.error("Error fetching supplier data:", error);
		}
	};

	useEffect(() => {
		handleSupplierSearch(supplierSearch);
	}, [supplierSearch]);

	const handlePumpTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = Number(e.target.value);
		setSelectedPumpType(selectedId.toString());

		const selectedPumpType = pumpTypes.find((p) => p.PumpTypeID === selectedId);

		if (selectedPumpType) {
			if (isInitialSelection) {
				setIsInitialSelection(false);
				if (
					selectedPumpType.PumpTypeHourlyRate !== null &&
					selectedPumpType.PumpTypeHourlyRate !== 0
				) {
					setHourlyRate(selectedPumpType.PumpTypeHourlyRate);
				}
			} else if (
				selectedPumpType.PumpTypeHourlyRate !== null &&
				selectedPumpType.PumpTypeHourlyRate !== 0
			) {
				const userConfirmed = window.confirm(
					`Would you like to change the Hourly Rate to ${selectedPumpType.PumpTypeHourlyRate.toFixed(2)}?`,
				);

				if (userConfirmed) {
					setHourlyRate(selectedPumpType.PumpTypeHourlyRate);
				}
			}
			setPourRate(selectedPumpType.PumpTypePourRate);
		}
	};

	const handleRoadBanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedValue = e.target.value;
		const selectedCustomerDetails = customerList.find(
			(c) => c.CustomerID === selectedCustomer,
		);

		setRoadBanSelection(selectedValue);

		if (selectedValue === "0" || selectedValue === "None") {
			setRoadBanRate(0);
			setRoadBanPercent(0);
		} else if (selectedValue === "90") {
			setRoadBanRate(selectedCustomerDetails?.RoadBan90Rate ?? 0);
			setRoadBanPercent(90);
		} else if (selectedValue === "75") {
			setRoadBanRate(selectedCustomerDetails?.RoadBan75Rate ?? 0);
			setRoadBanPercent(75);
		}

		if (selectedCustomerDetails) {
			if (selectedValue === "90") {
				setRoadBanRate(selectedCustomerDetails.RoadBan90Rate);
			} else if (selectedValue === "75") {
				setRoadBanRate(selectedCustomerDetails.RoadBan75Rate);
			} else {
				setRoadBanRate(0);
			}
		}
	};

	const handleJobConfirmedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setJobConfirmed(isChecked);

		if (isChecked || jobConfirmed) {
			const timestamp = new Date().toISOString();
			setJobConfirmedDate(timestamp);
		} else {
			setJobConfirmedDate(null);
			setJobConfirmed(false);
		}
	};

	useEffect(() => {
		const calculateTotal = () => {
			const discount = discountRate !== 0 ? subtotal * discountRate : 0;
			return (subtotal - discount) * 1.05;
		};
		setTotal(calculateTotal());
	}, [subtotal, discountRate]);

	useEffect(() => {
		const calculateGST = () => {
			const discount = discountRate !== 0 ? subtotal * discountRate : 0;
			return (subtotal - discount) * 0.05;
		};
		setGST(calculateGST());
	}, [subtotal, discountRate]);

	const handleSelectedPourTypesChange = (newSelectedPourTypes: PourType[]) => {
		setSelectedPourTypes(newSelectedPourTypes);
	};

	const handleOpenMap = (address) => {
		if (!address) {
			alert("Please enter a valid site address.");
			return;
		}
		const encodedAddress = encodeURIComponent(address);
		const googleMapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;
		window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
	};

	const handleDetailsToggle = (
		event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
	) => {
		const currentDetails = event.currentTarget as HTMLDetailsElement;
		document.querySelectorAll("details[open]").forEach((el) => {
			if (el !== currentDetails) {
				(el as HTMLDetailsElement).removeAttribute("open");
			}
		});
	};

	const handleAddCribber = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		if (isChecked) {
			setAddCribber(true);
		} else {
			setAddCribber(false);
		}
	};

	// const handleCustomerSearch = async (searchTerm) => {
	// 	try {
	// 		if (!searchTerm || searchTerm.trim() === "") {
	// 			console.log("Invalid search term. Skipping request.");
	// 			setFilteredCustomers([]);
	// 			setSelectedCustomer(0);
	// 			return;
	// 		}

	// 		console.log("Searching for customers with search term:", searchTerm);

	// 		const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
	// 		console.log("Encoded search term:", encodedSearchTerm);

	// 		const url = `http://localhost:3001/customer/customerSearch?search=${encodedSearchTerm}`;
	// 		console.log("Fetching URL:", url);
	// 		const response = await fetch(url);

	// 		if (!response.ok) {
	// 			console.error(`HTTP error! status: ${response.status}`);
	// 		}

	// 		const data = await response.json();
	// 		setFilteredCustomers(data);

	// 		if (data.length > 0) {
	// 			setSelectedCustomer(data[0].CustomerID);
	// 			setSaturdayPourRate(data[0].SaturdayPourRate);
	// 			setWashoutRate(data[0].WashoutRate);
	// 			setSecondaryOperatorRate(data[0].SecondaryOperatorRate);
	// 			setOnsiteQARate(data[0].OnsiteQaRate);
	// 			setAdditionalDunnageRate(data[0].AdditionalDunnageRate);
	// 			setAdditionalLineRate(data[0].AdditionalLineRate);
	// 			setFlagPersonRate(data[0].FlagPersonRate);
	// 			setCarbonLevyRate(Number(data[0].FuelSurchargeRate.toFixed(2)));
	// 			setDiscountRate(Number(data[0].Discount.toFixed(2)));

	// 			if (roadBanSelection === "90") {
	// 				setRoadBanRate(data[0].RoadBan90Rate);
	// 			} else if (roadBanSelection === "75") {
	// 				setRoadBanRate(data[0].RoadBan75Rate);
	// 			} else {
	// 				setRoadBanRate(0);
	// 			}
	// 		} else {
	// 			setSelectedCustomer(0);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error fetching customer data:", error);
	// 	}
	// };

	const handleCustomerSearch = async (searchTerm: string) => {
		try {
			const trimmedSearchTerm = searchTerm.trim();
			const url = trimmedSearchTerm
				? `http://localhost:3001/job/dropdown/customerSearch?search=${encodeURIComponent(trimmedSearchTerm)}`
				: "http://localhost:3001/job/dropdown/customer";

			console.log("Fetching customers from URL:", url);
			const response = await fetch(url);

			if (!response.ok) {
				console.error(`HTTP error! status: ${response.status}`);
				return;
			}

			const data = await response.json();
			console.log("API Response:", data);

			if (Array.isArray(data)) {
				setFilteredCustomers(data);

				if (trimmedSearchTerm && data.length > 0) {
					const firstCustomer = data[0];
					setSelectedCustomer(firstCustomer.CustomerID);
					setSaturdayPourRate(firstCustomer.SaturdayPourRate || 0);
					setWashoutRate(firstCustomer.WashoutRate || 0);
					setSecondaryOperatorRate(firstCustomer.SecondaryOperatorRate || 0);
					setOnsiteQARate(firstCustomer.OnsiteQaRate || 0);
					setAdditionalDunnageRate(firstCustomer.AdditionalDunnageRate || 0);
					setAdditionalLineRate(firstCustomer.AdditionalLineRate || 0);
					setFlagPersonRate(firstCustomer.FlagPersonRate || 0);
					setCarbonLevyRate(Number(firstCustomer.FuelSurchargeRate.toFixed(2)));
					setDiscountRate(Number(firstCustomer.Discount.toFixed(2)));
					setRoadBanRate(
						roadBanSelection === "90"
							? firstCustomer.RoadBan90Rate
							: roadBanSelection === "75"
								? firstCustomer.RoadBan75Rate
								: 0,
					);
				}
			} else {
				setFilteredCustomers([]);
			}
		} catch (error) {
			console.error("Error fetching customer data:", error);
		}
	};

	useEffect(() => {
		handleCustomerSearch(customerSearch);
	}, [customerSearch]);

	const handleSave = async () => {
		if (!validateForm()) {
			console.log("Validation failed. Please correct the errors.");
			return;
		}

		const [ahours, aminutes] = arrivalOnSite.split(":").map(Number);
		const [phours, pminutes] = concreteOnSite.split(":").map(Number);
		const sanitizedSelectedPourType =
			selectedPourTypes?.map((pt) => pt.PourTypeID) || [];
		const updatedJobStatus = jobConfirmed ? Math.max(jobStatus, 10) : 0;
		const updatedJobConfirmedDate = jobConfirmed
			? getLocalTimeISOString()
			: null;
		//const updatedColour = jobConfirmed ? 65535 : -1;

		const JobAdd_Edit = {
			JobID: job?.JobID || 0,
			JobTypeID: selectedJobType ? Number.parseInt(selectedJobType) : 0,
			JobPumpTypeID: selectedPumpType ? Number.parseInt(selectedPumpType) : 0,
			JobPourTypeOther: jobPourTypeOther,
			JobTotalPoured: m3Required,
			JobStatus: updatedJobStatus,
			JobCompanyJobNum: ticketNo,
			JobUnitID: Array.isArray(job?.JobUnitID)
				? job.JobUnitID[0]
				: job?.JobUnitID,
			JobDriverID: Array.isArray(job?.JobDriverID)
				? job.JobDriverID[0]
				: job?.JobDriverID,
			JobFlatRate: flatRate,
			JobDiscount: discountRate,
			CarbonLevyRate: carbonLevyRate,
			SaturdayPourRate: saturdayPourRate,
			WashoutRate: washoutRate,
			SecondaryOperatorRate: secondaryOperatorRate,
			OnsiteQaRate: onsiteQARate,
			AdditionalDunnageRate: additionalDunnageRate,
			AdditionalLineRate: additionalLineRate,
			FlagPersonRate: flagPersonRate,
			RoadBanRate: roadBanRate,
			HourlyRate: hourlyRate,
			JobPourRate: pourRate,
			JobTotalHours: timeOnSite,
			IsSaturdayPourEnabled: isSaturdayPourEnabled,
			IsOffsiteWashoutEnabled: isOffsiteWashoutEnabled,
			IsSecondaryOperatorEnabled: isSecondaryOperatorEnabled,
			IsOnsiteQAEnabled: isOnsiteQAEnabled,
			IsAdditionalDunnageEnabled: isAdditionalDunnageEnabled,
			IsAdditionalLineEnabled: isAdditionalLineEnabled,
			IsFlagPersonEnabled: isFlagPersonEnabled,
			IsCarbonLevyEnabled: isCarbonLevyEnabled,
			RoadBanSelection: roadBanSelection,
			JobStartDate: jobDate ? `${jobDate} 00:00:00` : null,
			CustomerConfirmed: isCustomerConfirmed ? 1 : 0,
			JobCustomerID: selectedCustomer ? selectedCustomer : null,
			WorkOrderNumber: workOrder,
			JobStartTime: `${ahours}:${aminutes}:00`,
			JobPourTime: `${phours}:${pminutes}:00`,
			SupplierConfirmed: isSupplierConfirmed ? 1 : 0,
			JobSupplierID: selectedSupplier ? selectedSupplier : null,
			JobCustomerPO: customerPO,
			JobCustomerJobNum: customerJobNo,
			JobSiteAddress: siteAddress,
			JobSitePhone: siteContact,
			JobMapLocation: mapLocation,
			JobComments: jobComments,
			RoadBanPercent:
				roadBanSelection === "None" ? 0 : Number(roadBanSelection),
			JobConfirmedDate: updatedJobConfirmedDate,
			JobColor: selectedColor,
		};

		try {
			let response: Response;
			let createdJobId: number | undefined;

			if (jobId === 0) {
				console.log("Creating new job...");
				const response = await fetch("http://localhost:3001/job/add-job", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(JobAdd_Edit),
				});

				if (response.ok) {
					const responseData = await response.json();
					if (responseData.success) {
						console.log(
							"Job created successfully with JobID:",
							responseData.JobID,
						);
						createdJobId = responseData.JobID;

						if (addCribber && !initialData) {
							console.log("Cribber is set to true, adding cribber...");
							const cribberResponse = await fetch(
								"http://localhost:3001/job/add-cribber",
								{
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ CribberText: siteContact }),
								},
							);

							if (cribberResponse.ok) {
								console.log("Cribber added successfully.");
							} else {
								console.error("Failed to add cribber.");
							}
						}
					} else {
						console.error("Failed to add new job to the database.");
					}
				}
			} else {
				console.log("Updating existing job...");
				response = await fetch(`http://localhost:3001/job/${jobId}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(JobAdd_Edit),
				});
			}

			console.log("Job saved successfully!");

			const finalJobId = createdJobId || jobId;

			if (sanitizedSelectedPourType.length > 0) {
				const pourResponse = await fetch(
					`http://localhost:3001/job/update-JobPourType/${finalJobId}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							PourTypeIDs: sanitizedSelectedPourType,
						}),
					},
				);

				if (pourResponse.ok) {
					console.log("Pour types updated successfully!");
				} else {
					console.error("Failed to update pour types.");
				}
			} else {
				console.log("No pour types selected; skipping pour type update.");
			}

			onClose();
			window.location.reload();
		} catch (error) {
			console.error("Error saving the job:", error);
		}
	};

	const handleDelete = async () => {
		if (jobId === 0) {
			console.error("Job ID is not set.");
			return;
		}

		const userConfirmed = window.confirm(
			"Are you sure you want to delete this job?",
		);
		if (!userConfirmed) {
			return;
		}
		//random 4 digit code for confirmation
		const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
		const userInput = window.prompt(
			`Please enter the following code to confirm deletion: ${randomCode}`,
		);

		if (userInput !== randomCode) {
			alert("Incorrect code. Job deletion cancelled.");
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:3001/job/delete/${jobId}`,
				{
					method: "PUT",
				},
			);

			if (response.ok) {
				alert("Job deleted successfully!");
				onClose();
				window.location.reload();
			} else {
				console.error("Failed to delete the job.");
				alert("Failed to delete the job. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting the job:", error);
			alert("An error occurred while deleting the job. Please try again.");
		}
	};

	const handleColorChange = (event) => {
		setSelectedColor(event.target.value);
	};

	const colorOptions = [
		{ value: "#87CEFA", color: "LightSkyBlue" },
		{ value: "#E6E6FA", color: "Lavender" },
		{ value: "#B0E0E6", color: "PowderBlue" },
		{ value: "#F0FFF0", color: "Honeydew" },
		{ value: "#FFFACD", color: "LemonChiffon" },
		{ value: "#FFE4E1", color: "MistyRose" },
		{ value: "#87CEEB", color: "SkyBlue" },
		{ value: "#2E8B57", color: "SeaGreen" },
		{ value: "#FFE5B4", color: "Peach" },
		{ value: "#FFC0CB", color: "Pink" },
		{ value: "#FFD700", color: "Gold" },
		{ value: "#7FFFD4", color: "Aquamarine" },
		{ value: "#F5DEB3", color: "Wheat" }
	];


	const formatCurrency = (value) => (value ? `$${value}` : "");
	const removeCurrencyFormat = (value) => value.replace(/[^\d.]/g, "");

	const formatPercentage = (value) => (value ? `${value}%` : "");
	const removePercentageFormat = (value) => value.replace(/[^\d.]/g, "");

	return (
		<div className=" pt-0 text-black">
			<form className="flex flex-col md:flex-row md:space-x-6 md:space-y-0">
				{/* Column 1 */}
				<div className="w-full space-y-4 md:w-1/3">
					{/* Ticket & Work Order Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="ticketNo" className="mb-1 block text-sm">
								Ticket No:
							</label>
							<input
								type="text"
								id="ticketNo"
								className="w-full rounded border p-2"
								value={ticketNo}
								onChange={(e) => setTicketNo(e.target.value)}
							/>
							{errors.ticketNo && (
								<p className="mt-1 text-red-500 text-sm">{errors.ticketNo}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="workOrder" className="mb-1 block text-sm">
								Work Order No:
							</label>
							<input
								type="text"
								id="workOrder"
								className="w-full rounded border p-2"
								value={workOrder}
								onChange={(e) => setWorkOrder(e.target.value)}
							/>
							{errors.workOrder && (
								<p className="mt-1 text-red-500 text-sm">{errors.workOrder}</p>
							)}
						</div>
					</div>

					{/* Customer Row */}
					<div>
						<label htmlFor="customer" className="mb-1 block text-sm">
							Customer:
						</label>
						<div className="flex flex-row space-x-5">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="customerCheckbox"
									className="form-checkbox h-5 w-5 accent-blue-500"
									checked={isCustomerConfirmed}
									onChange={(e) => setIsCustomerConfirmed(e.target.checked)}
								/>
								<label
									htmlFor="customerCheckbox"
									className="text-gray-700 text-sm"
								>
									Confirmed
								</label>
							</div>
							<div className="flex flex-1 flex-row">
								{!jobId && (
									<div className="pr-2">
										<input
											type="text"
											id="customerSearch"
											className="w-30 rounded border p-2"
											placeholder="Search for a customer"
											value={customerSearch}
											onChange={(e) => setCustomerSearch(e.target.value)}
										/>
									</div>
								)}
								<select
									id="customer"
									className="w-full rounded border p-2"
									value={selectedCustomer}
									onChange={handleCustomerChange}
								>
									<option value="">Select Customer</option>
									{filteredCustomers.map((customer) => (
										<option
											key={customer.CustomerID}
											value={customer.CustomerID}
										>
											{customer.CustomerCompanyName}
										</option>
									))}
								</select>
							</div>
							<button
								type="button"
								className="rounded-full bg-blue-500 px-6 text-white hover:bg-blue-600"
								aria-label="Add Note or Comment"
								onClick={() => handleOpenCommentsModal(selectedCustomer)}
							>
								<i className="fa fa-comment" />
							</button>
						</div>
					</div>

					{/* Job Date Row */}
					<div>
						<label htmlFor="jobDate" className="mb-1 block text-sm">
							Job Date:
						</label>
						<div className="flex flex-row space-x-5">
							<input
								type="date"
								id="JobStartDate"
								className="w-full rounded border p-2"
								value={jobDate}
								onChange={(e) => setJobDate(e.target.value)}
								required
							/>
							<button
								type="button"
								className="rounded-full bg-blue-500 px-3 font-bold text-sm text-white hover:bg-blue-600"
								onClick={() => {
									const today = new Date();
									const localDate = new Date(
										today.getTime() - today.getTimezoneOffset() * 60000,
									)
										.toISOString()
										.split("T")[0];
									setJobDate(localDate);
								}}
							>
								Today
							</button>
						</div>
					</div>
					{errors.jobDate && (
						<p className="mt-1 text-red-500 text-sm">{errors.jobDate}</p>
					)}

					{/* Arrival Onsite & Concrete Onsite Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="arrivalOnSite" className="mb-1 block text-sm">
								Arrival on Site:
							</label>
							<input
								type="time"
								id="arrivalOnSite"
								className="w-full rounded border p-2"
								value={arrivalOnSite}
								onChange={(e) => {
									setArrivalOnSite(e.target.value);
									setIsConcreteOnSiteManual(false);
								}}
							/>
							{errors.arrivalOnSite && (
								<p className="mt-1 text-red-500 text-sm">
									{errors.arrivalOnSite}
								</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="concreteOnSite" className="mb-1 block text-sm">
								Concrete Onsite:
							</label>
							<input
								type="time"
								id="concreteOnSite"
								className="w-full rounded border p-2"
								value={concreteOnSite}
								onChange={(e) => handleConcreteOnSiteChange(e.target.value)}
							/>
						</div>
					</div>

					{/* Supplier Row */}
					<div>
						<label htmlFor="supplier" className="mb-1 block text-sm">
							Supplier:
						</label>
						<div className="flex flex-row space-x-5">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="supplierCheckbox"
									className="form-checkbox h-5 w-5 accent-blue-500"
									checked={isSupplierConfirmed}
									onChange={(e) => setIsSupplierConfirmed(e.target.checked)}
								/>
								<label
									htmlFor="supplierCheckbox"
									className="text-gray-700 text-sm"
								>
									Confirmed
								</label>
							</div>
							<div className="flex flex-1 flex-row">
								{!jobId && (
									<div className="pr-2">
										<input
											type="text"
											id="supplierSearch"
											className="rounded border p-2"
											placeholder="Search for a supplier"
											value={supplierSearch}
											onChange={(e) => setSupplierSearch(e.target.value)}
										/>
									</div>
								)}
								<select
									id="supplier"
									className="w-full rounded border p-2"
									value={selectedSupplier}
									onChange={(e) => setSelectedSupplier(e.target.value)}
								>
									<option value="">Select Supplier</option>
									{Array.isArray(filteredSuppliers) &&
										filteredSuppliers.length > 0 ? (
										filteredSuppliers.map((supplier) => (
											<option
												key={supplier.SupplierID}
												value={supplier.SupplierID}
											>
												{supplier.SupplierCompanyName}
											</option>
										))
									) : (
										<option value="">No Suppliers Found</option>
									)}
								</select>
							</div>
						</div>
					</div>

					{/* CustomerPO & Customer Job Num Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="customerPO" className="mb-1 block text-sm">
								Customer PO:
							</label>
							<input
								type="text"
								id="customerPO"
								className="w-full rounded border p-2"
								value={customerPO}
								onChange={(e) => setCustomerPO(e.target.value)}
							/>
							{errors.customerPO && (
								<p className="mt-1 text-red-500 text-sm">{errors.customerPO}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="customerJobNo" className="mb-1 block text-sm">
								Customer Job No:
							</label>
							<input
								type="text"
								id="customerJobNo"
								className="w-full rounded border p-2"
								value={customerJobNo}
								onChange={(e) => setCustomerJobNo(e.target.value)}
							/>
							{errors.customerJobNo && (
								<p className="mt-1 text-red-500 text-sm">
									{errors.customerJobNo}
								</p>
							)}
						</div>
					</div>

					{/* Site Address Row */}
					<div>
						<label htmlFor="siteAddress" className="mb-1 block text-sm">
							Site Address:
						</label>
						<div className="flex flex-row space-x-5">
							<input
								type="text"
								id="siteAddress"
								className="w-full rounded border p-2"
								value={siteAddress}
								onChange={(e) => setSiteAddress(e.target.value)}
							/>
							<button
								type="button"
								className="rounded-full bg-blue-500 px-6 text-white hover:bg-blue-600"
								aria-label="Open in Google Maps"
								onClick={() => handleOpenMap(siteAddress)}
							>
								<i className="fa fa-map-marker" />
							</button>
							{errors.siteAddress && (
								<p className="mt-1 text-red-500 text-sm">
									{errors.siteAddress}
								</p>
							)}
						</div>
					</div>

					{/* Site Contact Row */}
					<div className="flex flex-col">
						<label htmlFor="siteContact" className="mb-1 block text-sm">
							Site Contact/Phone:
						</label>
						<div className="flex flex-row space-x-5">
							{/* <label htmlFor="addCribber" className={`${jobId !== 0 ? "text-gray-400" : ""}`}>add Contact</label>
							<input
								type="checkbox"
								id="addCribber"
								className={`form-checkbox h-5 w-5 ${jobId !== 0 ? "text-gray-400" : ""}`}
								checked={addCribber}
								onChange={handleAddCribber}
													
					
							/> */}
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="addCribber"
									className={`form-checkbox h-5 w-5 ${jobId !== 0 ? "text-gray-400" : "form-checkbox h-5 w-5 accent-blue-500"}`}
									checked={addCribber}
									onChange={handleAddCribber}
								/>
								<label
									htmlFor="addCribber"
									className={`${jobId !== 0 ? "text-gray-400" : "text-gray-700 text-sm"}`}
								>
									Add Contact
								</label>
							</div>
							<div className="flex-1">
								<input
									type="text"
									id="siteContact"
									className="w-full flex-1 rounded border p-2"
									value={siteContact}
									onChange={(e) => setSiteContact(e.target.value)}
								/>
							</div>
							<button
								type="button"
								className="rounded-full bg-blue-500 px-6 text-white hover:bg-blue-600"
								aria-label="Lookup Cribber"
								onClick={() => setIsCribberModalOpen(true)}
							>
								<i className="fa fa-phone" />
							</button>
						</div>
						{errors.siteContact && (
							<p className="mt-1 text-red-500 text-sm">{errors.siteContact}</p>
						)}
					</div>

					{/* Map Location Not Used */}
					{/* <div className="flex flex-col md:flex-row md:space-x-4">
						<div className="flex-1">
							<label htmlFor="mapLocation" className="mb-1 block text-sm">
								Map Location:
							</label>
							<input
								type="text"
								id="mapLocation"
								className="w-full rounded border p-2"
								value={mapLocation}
								onChange={(e) => setMapLocation(e.target.value)}
							/>
						</div>
					</div> */}

					{/* Comments Row */}
					<div>
						<div className="flex flex-row space-x-6">
							<div className="flex-1">
								<label htmlFor="jobComments" className="mb-1 block text-sm">
									Comments:
								</label>
								<div className="flex flex-row space-x-5">
									<textarea
										id="jobComments"
										className="w-full rounded border p-2"
										value={jobComments}
										onChange={(e) => setJobComments(e.target.value)}
									/>
								</div>
							</div>
							<div>
								<label htmlFor="colorDropdown" className="mb-1 block text-sm">
									Job Color:
								</label>
								<select
									id="colorDropdown"
									name="color"
									value={selectedColor}
									onChange={handleColorChange}
									className="mb-4 h-16 w-full rounded border p-2"
									style={{
										backgroundColor:
											selectedColor &&
											colorOptions.find(
												(option) => option.value === selectedColor,
											)?.color,
									}}
								>
									<option value="">Current</option>
									{colorOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
											style={{ backgroundColor: option.color }}
										/>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Confirm Job */}
					<div className="flex items-center space-x-2">
						<label htmlFor="jobConfirmed" className="text-sm">
							Confirm Job?
						</label>
						<input
							type="checkbox"
							id="jobConfirmed"
							className="form-checkbox h-5 w-5 accent-blue-500"
							checked={jobConfirmed}
							onChange={handleJobConfirmedChange}
						/>
						<span className="text-gray-500 text-sm">
							(Ready to be Scheduled)
						</span>
					</div>
				</div>

				{/* Column 2 */}
				<div className="w-full md:w-1/3">
					{/* JobType & PumpType Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="jobType" className="mb-1 block text-sm">
								Job Type
							</label>
							<select
								id="jobType"
								className="mb-4 w-full rounded border p-2"
								value={selectedJobType}
								onChange={(e) => setSelectedJobType(e.target.value)}
							>
								<option value="">Select Job Type</option>
								{jobTypes.map((type) => (
									<option key={type.id} value={type.id}>
										{type.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex-1">
							<label htmlFor="pumplist" className="mb-1 block text-sm">
								Pump Type
							</label>
							<select
								id="pumplist"
								className="mb-4 w-full rounded border p-2"
								value={selectedPumpType ?? ""}
								onChange={handlePumpTypeChange}
							>
								<option value="">Select Pump Type</option>
								{pumpTypes.map((pump) => (
									<option key={pump.PumpTypeID} value={pump.PumpTypeID}>
										{pump.PumpTypeName}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* PourType Selector Row */}
					<div className="mb-1">
						<PourTypeSelector
							jobId={jobId}
							onSelectedChange={handleSelectedPourTypesChange}
						/>
					</div>

					{/* Other PourType Row*/}
					<div>
						<label htmlFor="jobPourTypeOther" className="mb-1 block text-sm">
							Other Pour Type
						</label>
						<input
							id="jobPourTypeOther"
							type="text"
							className="mb-4 w-full rounded border p-2"
							value={jobPourTypeOther}
							onChange={(e) => setJobPourTypeOther(e.target.value)}
							placeholder="Enter custom pour type"
						/>
					</div>

					{/* Totals Summary */}
					<div className="rounded-lg bg-white px-6 py-4 shadow-md">
						<h3 className="mb-4 font-semibold text-gray-700 text-lg">
							Summary
						</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<label htmlFor="subtotal" className="text-gray-500 text-sm">
									Subtotal:
								</label>
								<div id="subtotal" className="font-medium text-gray-800">
									${subtotal.toFixed(2)}
								</div>
							</div>
							<div className="flex items-center justify-between">
								<label htmlFor="discount" className="text-gray-500 text-sm">
									Discount:
								</label>
								<div id="discount" className="font-medium text-gray-800">
									{(discountRate * 100).toFixed(2)}%
								</div>
							</div>
							<div className="flex items-center justify-between">
								<label htmlFor="gst" className="text-gray-500 text-sm">
									GST:
								</label>
								<div id="gst" className="font-medium text-gray-800">
									${GSTRate.toFixed(2)}
								</div>
							</div>
							<div className="mt-4 flex items-center justify-between border-t pt-4">
								<label
									htmlFor="total"
									className="font-semibold text-gray-700 text-sm"
								>
									Total:
								</label>
								<div id="total" className="font-bold text-gray-900">
									${total.toFixed(2)}
								</div>
							</div>
						</div>
					</div>

					{/* Buttons Row */}
					<div className="mt-8 flex justify-between">
						<div>
							<button
								type="button"
								className="rounded-full bg-blue-500 px-4 py-2 font-bold text-lg text-white hover:bg-blue-600"
								onClick={handleSave}
							>
								<i className="fa-solid fa-floppy-disk px-1" /> Save
							</button>
						</div>
						<div className="flex space-x-2">
							<button
								type="button"
								className="rounded-full bg-gray-500 px-4 py-2 font-bold text-lg text-white hover:bg-gray-600"
								onClick={() => router.push(`/reports/job-details/${jobId}`)}
							>
								<i className="fa-solid fa-print px-1" />
							</button>
							<button
								type="button"
								className="rounded-full bg-red-500 px-4 py-2 font-bold text-lg text-white hover:bg-red-600"
								onClick={handleDelete}
							>
								<i className="fa-solid fa-trash-can px-1" />
							</button>
						</div>
					</div>
				</div>

				{/* Column 3 */}
				<div className="w-full space-y-4 md:w-1/3">
					{/* Pour Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="m3req" className="mb-1 block text-sm">
								m3 Required:
							</label>
							<input
								id="m3req"
								type="number"
								className="w-full rounded border p-2"
								value={m3Required === 0 ? "" : m3Required}
								onChange={(e) => setM3Required(Number(e.target.value))}
							/>
							{errors.m3Required && (
								<p className="mt-1 text-red-500 text-sm">{errors.m3Required}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="pourrate" className="mb-1 block text-sm">
								Pour Rate (/m3):
							</label>
							<div className="flex items-center space-x-2">
								<div className="relative w-full">
									<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
										$
									</span>
									<input
										id="pourrate"
										type="number"
										className="w-full rounded border p-2 pl-5"
										value={pourRate === 0 ? "" : pourRate}
										onChange={(e) => setPourRate(Number(e.target.value))}
									/>
								</div>
								<button
									type="button"
									className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
									onClick={refreshPourRate}
									aria-label="Reset Pour Rate to default"
								>
									&#8635;
								</button>
							</div>
							{errors.pourRate && (
								<p className="mt-1 text-red-500 text-sm">{errors.pourRate}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="pourtotal" className="mb-1 block text-sm">
								Pour Total:
							</label>
							<div
								id="pourtotal"
								className="rounded border bg-gray-100 p-2 text-center"
							>
								{pourTotal > 0 ? `$${pourTotal.toFixed(2)}` : "$0.00"}
							</div>
						</div>
					</div>

					{/* Rate Row */}
					<div className="flex flex-row space-x-5">
						<div className="flex-1">
							<label htmlFor="timeonsite" className="mb-1 block text-sm">
								Time on Site (hrs):
							</label>
							<input
								id="timeonsite"
								type="number"
								className="w-full min-w-[3.5rem] rounded border p-2"
								value={timeOnSite === 0 ? "" : timeOnSite}
								onChange={(e) => setTimeOnSite(Number(e.target.value))}
							/>
							{errors.timeOnSite && (
								<p className="mt-1 text-red-500 text-sm">{errors.timeOnSite}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="hourlyrate" className="mb-1 block text-sm">
								Hourly Rate:
							</label>
							<div className="flex items-center space-x-2">
								<div className="relative w-full">
									<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
										$
									</span>
									<input
										id="hourlyrate"
										type="number"
										className="w-full min-w-[3.5rem] rounded border p-2 pl-5"
										value={hourlyRate === 0 ? "" : hourlyRate}
										onChange={(e) => setHourlyRate(Number(e.target.value))}
									/>
								</div>
								<button
									type="button"
									className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
									onClick={refreshHourlyRate}
									aria-label="Reset Hourly Rate to default"
								>
									&#8635;
								</button>
							</div>
							{errors.hourlyRate && (
								<p className="mt-1 text-red-500 text-sm">{errors.hourlyRate}</p>
							)}
						</div>
						<div className="flex-1">
							<label htmlFor="hourlytotal" className="mb-1 block text-sm">
								Hourly Total:
							</label>
							<div
								id="hourlytotal"
								className="rounded border bg-gray-100 p-2 text-center"
							>
								{hourlyTotal > 0 ? `$${hourlyTotal.toFixed(2)}` : "$0.00"}
							</div>
						</div>
					</div>

					{/* Saturday Pour Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Saturday Pour</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="saturdaypour"
										className="pr-2 text-gray-700 text-sm"
									>
										Saturday Pour:
									</label>
									<input
										id="saturdaypour"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isSaturdayPourEnabled}
										onChange={(e) => setIsSaturdayPourEnabled(e.target.checked)}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="satpourrate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Sat. Pour Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="satpourrate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={saturdayPourRate === 0 ? "" : saturdayPourRate}
												onChange={(e) =>
													setSaturdayPourRate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setSaturdayPourRate,
													"SaturdayPourRate",
												)
											}
											aria-label="Reset Saturday Pour Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.saturdayPourRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.saturdayPourRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="satpourtotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Sat. Pour Total:
									</label>
									<div
										id="satpourtotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isSaturdayPourEnabled && saturdayPourTotal > 0
											? `$${saturdayPourTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Offsite Washout Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Offsite Washout</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="washout"
										className="pr-2 text-gray-700 text-sm"
									>
										Offsite Washout:
									</label>
									<input
										id="washout"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isOffsiteWashoutEnabled}
										onChange={(e) =>
											setIsOffsiteWashoutEnabled(e.target.checked)
										}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="washoutrate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Washout Rate:
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="washoutrate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={washoutRate === 0 ? "" : washoutRate}
												onChange={(e) => setWashoutRate(Number(e.target.value))}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(setWashoutRate, "WashoutRate")
											}
											aria-label="Reset Washout Rate"
										>
											&#8635;
										</button>
									</div>
									{errors.washoutRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.washoutRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="washouttotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Washout Total:
									</label>
									<div
										id="washouttotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isOffsiteWashoutEnabled && washoutTotal > 0
											? `$${washoutTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Road Ban Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Road Ban</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="flex-1">
									<label htmlFor="roadban" className="mb-1 block text-xs">
										Road Ban %:
									</label>
									<select
										id="roadban"
										className="w-full rounded border p-1"
										value={roadBanSelection}
										onChange={handleRoadBanChange}
									>
										<option value="0">None</option>
										<option value="90">90</option>
										<option value="75">75</option>
									</select>
								</div>
								<div className="flex-1">
									<label
										htmlFor="roadbanrate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Road Ban Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="roadbanrate"
												type="number"
												className="w-full rounded border p-1 pl-5"
												value={roadBanRate === 0 ? "" : roadBanRate}
												onChange={(e) => setRoadBanRate(Number(e.target.value))}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setRoadBanRate,
													roadBanSelection === "90"
														? "RoadBan90Rate"
														: "RoadBan75Rate",
												)
											}
											aria-label="Reset Road Ban Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.roadBanRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.roadBanRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="roadbantotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Road Ban Total:
									</label>
									<div
										id="roadbantotal"
										className="rounded border bg-white p-1 text-center"
									>
										{roadBanTotal > 0 ? `$${roadBanTotal.toFixed(2)}` : "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Secondary Operator Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Secondary Operator</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="secondaryoperator"
										className="pr-2 text-gray-700 text-sm"
									>
										Second Operator:
									</label>
									<input
										id="secondaryoperator"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isSecondaryOperatorEnabled}
										onChange={(e) =>
											setIsSecondaryOperatorEnabled(e.target.checked)
										}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="secondaryoprate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Secondary Op. Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="secondaryoprate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={
													secondaryOperatorRate === 0
														? ""
														: secondaryOperatorRate
												}
												onChange={(e) =>
													setSecondaryOperatorRate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setSecondaryOperatorRate,
													"SecondaryOperatorRate",
												)
											}
											aria-label="Reset Secondary Operator Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.secondaryOperatorRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.secondaryOperatorRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="secondaryoptotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Secondary Op. Total:
									</label>
									<div
										id="secondaryoptotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isSecondaryOperatorEnabled && secondaryOperatorTotal > 0
											? `$${secondaryOperatorTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Onsite QA Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Onsite QA</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="onsiteqa"
										className="pr-2 text-gray-700 text-sm"
									>
										Onsite QA:
									</label>
									<input
										id="onsiteqa"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isOnsiteQAEnabled}
										onChange={(e) => setIsOnsiteQAEnabled(e.target.checked)}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="onsiteqarate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Onsite QA Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="onsiteqarate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={onsiteQARate === 0 ? "" : onsiteQARate}
												onChange={(e) =>
													setOnsiteQARate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(setOnsiteQARate, "OnsiteQaRate")
											}
											aria-label="Reset Onsite QA Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.onsiteQARate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.onsiteQARate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="onsiteqatotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Onsite QA Total:
									</label>
									<div
										id="onsiteqatotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isOnsiteQAEnabled && onsiteQATotal > 0
											? `$${onsiteQATotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/*  Additional Dunnage Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Additional Dunnage</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="adddunnage"
										className="pr-2 text-gray-700 text-sm"
									>
										Add. Dunnage:
									</label>
									<input
										id="adddunnage"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isAdditionalDunnageEnabled}
										onChange={(e) =>
											setIsAdditionalDunnageEnabled(e.target.checked)
										}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="adddunnagerate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Add. Dunnage Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="adddunnagerate"
												type="number"
												className="currency-input w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={
													additionalDunnageRate === 0
														? ""
														: additionalDunnageRate
												}
												onChange={(e) =>
													setAdditionalDunnageRate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setAdditionalDunnageRate,
													"AdditionalDunnageRate",
												)
											}
											aria-label="Reset Additional Dunnage Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.additionalDunnageRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.additionalDunnageRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="adddunnagetotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Add. Dunnage Total:
									</label>
									<div
										id="adddunnagetotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isAdditionalDunnageEnabled && additionalDunnageTotal > 0
											? `$${additionalDunnageTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/*  Additional Line Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Additional Line</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="addline"
										className="pr-2 text-gray-700 text-sm"
									>
										Additional Line:
									</label>
									<input
										id="addline"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isAdditionalLineEnabled}
										onChange={(e) =>
											setIsAdditionalLineEnabled(e.target.checked)
										}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="addlinerate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Additional Line Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="addlinerate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={
													additionalLineRate === 0 ? "" : additionalLineRate
												}
												onChange={(e) =>
													setAdditionalLineRate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setAdditionalLineRate,
													"AdditionalLineRate",
												)
											}
											aria-label="Reset Additional Line Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.additionalLineRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.additionalLineRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="addlinetotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Additional Line Total:
									</label>
									<div
										id="addlinetotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isAdditionalLineEnabled && additionalLineTotal > 0
											? `$${additionalLineTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Flag Person Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Flag Person</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="flagperson"
										className="pr-2 text-gray-700 text-sm"
									>
										Flag Person:
									</label>
									<input
										id="flagperson"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isFlagPersonEnabled}
										onChange={(e) => setIsFlagPersonEnabled(e.target.checked)}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="flagpersonrate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Flag Person Rate (/hr):
									</label>
									<div className="flex items-center space-x-2">
										<div className="relative w-full">
											<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
												$
											</span>
											<input
												id="flagpersonrate"
												type="number"
												className="w-full min-w-[3.5rem] rounded border p-1 pl-5"
												value={flagPersonRate === 0 ? "" : flagPersonRate}
												onChange={(e) =>
													setFlagPersonRate(Number(e.target.value))
												}
											/>
										</div>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(setFlagPersonRate, "FlagPersonRate")
											}
											aria-label="Reset Flag Person Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.flagPersonRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.flagPersonRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="flagpersontotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Flag Person Total:
									</label>
									<div
										id="flagpersontotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isFlagPersonEnabled && flagPersonTotal > 0
											? `$${flagPersonTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Carbon Levy Row */}
					<details
						className="overflow-hidden rounded-md border shadow-sm"
						onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								(e.currentTarget as HTMLDetailsElement).open = !(
									e.currentTarget as HTMLDetailsElement
								).open;
								handleDetailsToggle(e);
							}
						}}
						onClick={handleDetailsToggle}
					>
						<summary className="mb-0 flex cursor-pointer items-center justify-between rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-sm text-white transition-all duration-200 ease-in-out hover:from-blue-600 hover:to-blue-700">
							<span>Fuel, Enviro, & Carbon Levy</span>
							<i className="fas fa-chevron-down text-white" />
						</summary>
						<div>
							<div className="flex flex-row space-x-5 bg-gray-50 p-4">
								<div className="mt-3 flex flex-1 items-center justify-center">
									<label
										htmlFor="carbonlevy"
										className="pr-2 text-gray-700 text-sm"
									>
										Levy:
									</label>
									<input
										id="carbonlevy"
										type="checkbox"
										className="form-checkbox h-6 w-6"
										checked={isCarbonLevyEnabled}
										onChange={(e) => setIsCarbonLevyEnabled(e.target.checked)}
									/>
								</div>
								<div className="flex-1">
									<label
										htmlFor="carbonlevyrate"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Levy Rate:
									</label>
									<div className="flex items-center space-x-2">
										<input
											id="carbonlevyrate"
											type="number"
											className="w-full min-w-[3.5rem] rounded border p-1"
											value={carbonLevyRate === 0 ? "" : carbonLevyRate}
											onChange={(e) =>
												setCarbonLevyRate(Number(e.target.value))
											}
											min="0"
											max="1"
											step="0.01"
										/>
										<button
											type="button"
											className="rounded bg-green-500 p-1 text-white hover:bg-green-600"
											onClick={() =>
												refreshCustomerRate(
													setCarbonLevyRate,
													"FuelSurchargeRate",
												)
											}
											aria-label="Reset Carbon Levy Rate to default"
										>
											&#8635;
										</button>
									</div>
									{errors.carbonLevyRate && (
										<p className="mt-1 text-red-500 text-xs">
											{errors.carbonLevyRate}
										</p>
									)}
								</div>
								<div className="flex-1">
									<label
										htmlFor="carbonlevytotal"
										className="mb-1 block whitespace-nowrap text-xs"
									>
										Levy Total:
									</label>
									<div
										id="carbonlevytotal"
										className="rounded border bg-white p-1 text-center"
									>
										{isCarbonLevyEnabled && carbonLevyTotal > 0
											? `$${carbonLevyTotal.toFixed(2)}`
											: "$0.00"}
									</div>
								</div>
							</div>
						</div>
					</details>

					{/* Misc Row */}
					<div className="flex flex-row space-x-6">
						<div className="flex-1">
							<label
								htmlFor="flatrate"
								className="mb-1 block whitespace-nowrap text-sm"
							>
								Flat Rate:
							</label>
							<div className="flex items-center space-x-2">
								<div className="relative w-full">
									<span className="-translate-y-1/2 absolute top-1/2 left-2 transform text-gray-500">
										$
									</span>
									<input
										id="flatrate"
										type="number"
										className="w-full min-w-[3.5rem] rounded border p-2 pl-5"
										value={flatRate === 0 ? "" : flatRate}
										onChange={(e) => setFlatRate(Number(e.target.value))}
									/>
								</div>
								<button
									type="button"
									className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
									onClick={() => refreshCustomerRate(setFlatRate, "FlatRate")}
									aria-label="Reset Flat Rate to default"
								>
									&#8635;
								</button>
							</div>
							{errors.flatRate && (
								<p className="mt-1 text-red-500 text-sm">{errors.flatRate}</p>
							)}
						</div>
						<div className="flex-1">
							<label
								htmlFor="discountrate"
								className="mb-1 block whitespace-nowrap text-sm"
							>
								Discount:
							</label>
							<div className="flex items-center space-x-2">
								<div className="relative w-full">
									<input
										id="discountrate"
										type="number"
										className="w-full min-w-[3.5rem] rounded border p-2 pr-6 text-right"
										style={{
											direction: "rtl",
											textAlign: "right",
										}}
										value={discountRate === 0 ? "" : discountRate * 100}
										onChange={(e) =>
											setDiscountRate(Number(e.target.value) / 100)
										}
									/>
									<span className="-translate-y-1/2 absolute top-1/2 right-2 transform text-gray-500">
										%
									</span>
								</div>
								<button
									type="button"
									className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
									onClick={() =>
										refreshCustomerRate(setDiscountRate, "Discount")
									}
									aria-label="Reset Discount Rate to default"
								>
									&#8635;
								</button>
							</div>
							{errors.discountRate && (
								<p className="mt-1 text-red-500 text-sm">
									{errors.discountRate}
								</p>
							)}
						</div>
						<div className="flex items-end">
							<button
								type="button"
								className="rounded-full bg-green-500 px-4 py-3 font-bold text-white text-xs hover:bg-green-600"
								onClick={refreshAllCustomerDefaults}
								aria-label="Set Customer Default Rates"
							>
								<i className="fa-solid fa-arrows-rotate pr-1" />
								Reset Defaults
							</button>
						</div>
					</div>
				</div>
			</form>
			{/* Cribber Modal */}
			<CribberModal
				isOpen={isCribberModalOpen}
				onClose={() => setIsCribberModalOpen(false)}
				onSelect={handleCribberSelect}
			/>
			<CommentsModal
				isOpen={isCommentsModalOpen}
				onClose={() => setIsCommentsModalOpen(false)}
				customerID={selectedCustomerID}
			/>
		</div>
	);
};

export default JobForm;
