export const getCustomerKey = ({ memberId }: { memberId: number }) => {
  return `ck_user_${memberId}`;
};

export const generateOrderId = () => {
  return crypto.randomUUID();
};
