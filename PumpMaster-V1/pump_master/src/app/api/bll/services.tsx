import { addJob, getJob, updateJob } from "../dal/PumpMasterBackend";

export const getJobService = async () => {
	try {
		return await getJob();
	} catch (error: any) {
		throw new Error(`Failed to fetch Job: ${error.message}`);
	}
};

export const createJobService = async (jobData: any) => {
	try {
		const { jobType } = jobData;
		if (!jobType || jobType.trim() === "") {
			throw new Error("Job type cannot be empty");
		}
		return await addJob(jobData);
	} catch (error: any) {
		throw new Error(`Failed to create Job: ${error.message}`);
	}
};

export const updateJobService = async (jobId: number, jobType: string) => {
	try {
		return await updateJob(jobId, { jobType });
	} catch (error: any) {
		throw new Error(`Failed to update Job: ${error.message}`);
	}
};
