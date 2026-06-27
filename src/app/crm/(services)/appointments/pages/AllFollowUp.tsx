"use client";

import AllFollowUpForm from "../components/AllFollowUpForms";

interface Props {
    UserId: string;
    AppointmentId: string
}
const AllFollowUp = ({ UserId, AppointmentId }: Props) => {


    return (
        <div className="dark:bg-[#2a2b2e] w-[98%]">
            <AllFollowUpForm UserId={UserId} AppointmentId={AppointmentId} />
        </div>
    );
};

export default AllFollowUp;