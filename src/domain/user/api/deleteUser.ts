import { api } from "@/shared/config/api";
import { AxiosError } from "axios";

type DeleteUserError = {
    code: string;
    message: string;
}

export const deleteUser = async () => {
    try{
        const res = await api.delete("/api/members/me");
        return res.data;
    }catch(error){
        throw error as AxiosError<DeleteUserError>;
    }
};
