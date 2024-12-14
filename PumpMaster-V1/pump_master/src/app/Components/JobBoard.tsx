import JobCRUD from "@/app/Components/JobCRUD";

interface JobBoardProps {
	//jobId: number | null;
	onOpenForm: (jobId: number) => void;
}

const JobBoard = ({ onOpenForm }: JobBoardProps) => {
	//console.log("job board page Job ID: ", jobId);

	return (
		<JobCRUD
			entityName="Jobs"
			entityTable="Job"
			fetchLink="job"
			onOpenForm={onOpenForm}
		/>
	);
};

export default JobBoard;
