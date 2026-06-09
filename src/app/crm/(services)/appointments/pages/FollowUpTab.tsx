'use client'

import AllFollowUp from "@/app/crm/(applications)/followup/pages/All"

const FollowUpTab = ({
    appointmentId
}: {
    appointmentId: string | null
}) => {

    return (
        <div>
            <AllFollowUp />
        </div>
    )
}

export default FollowUpTab