'use client'

import { LeadDetailsForm } from "../components/LeadDetailsForm"

const AcademicTabs = ({
    LeadId
}: {
    LeadId: string | null
}) => {

    return (

        <div>
            <LeadDetailsForm inquiryId={LeadId} />
        </div>


    )
}

export default AcademicTabs