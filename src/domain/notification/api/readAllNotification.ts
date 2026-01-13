export const readAllNotification = async () => {
  const res = await fetch("http://localhost:8080/api/notifications/read-all", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`알림 읽음처리에 실패했습니다. 오류코드 : ${res.status}`);
  }
  const data = await res.json();
  return data;
};
