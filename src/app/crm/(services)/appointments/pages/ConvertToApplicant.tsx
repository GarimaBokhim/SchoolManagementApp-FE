'use client'

import { useForm } from "react-hook-form";
import ConvertToApplicantForm from "../components/ConvertToApplicantForm"
import { ConvertToApplicantPayload } from "../types/IAppointment";


const ConvertToApplicant = ({ userId }: { userId: string }) => {

    const form = useForm<ConvertToApplicantPayload>({
        defaultValues: {
            userId: "",
            passportNo: "",
            countryId: "",
            universityId: "",
            courseId: ""
        },

        // resolver: yupResolver(SubjectValidator),
    });

    return (
        <div>
            <ConvertToApplicantForm form={form} userId={userId} />
        </div>
    )
}

export default ConvertToApplicant