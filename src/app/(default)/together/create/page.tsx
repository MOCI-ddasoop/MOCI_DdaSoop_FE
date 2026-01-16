import TogetherCreateForm from "@/domain/together/components/TogetherCreateForm";
import { Suspense } from "react";

function TogetherCreatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TogetherCreateForm />
    </Suspense> 
  )
}
export default TogetherCreatePage