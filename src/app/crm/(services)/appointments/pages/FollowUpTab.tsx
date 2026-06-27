'use client'

import AllFollowUp from "./AllFollowUp"


const FollowUpTab = ({
    UserId,
    AppointmentId
}: {
    UserId: string
    AppointmentId: string
}) => {



    return (
        <div>
            <AllFollowUp UserId={UserId} AppointmentId={AppointmentId} />
        </div>
    )
}

export default FollowUpTab