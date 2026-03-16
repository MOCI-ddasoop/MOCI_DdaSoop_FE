import { api } from "@/shared/config/api";

export type DeleteUserRequest = {
    reason: string;
}

export type DeleteUserResponse = {
    message: string;
};

export const deleteUser = async (data: DeleteUserRequest): Promise<DeleteUserResponse> => {
    const res = await api.delete("/api/members/me", { data });
    return res.data;
};
