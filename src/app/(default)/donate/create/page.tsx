import DonationSuggestForm from "@/domain/donate/components/DonationSuggestForm";
import { Suspense } from "react";

export default function DonationSuggestPage(){
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <DonationSuggestForm />
    </Suspense>
  )
}