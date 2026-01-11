export const getInitTogetherList = async () => {
  const res = await fetch(`http://localhost:8080/api/v1/together/list`);
  if (!res.ok) {
    throw new Error(
      `함께하기 리스트 조회에 실패했습니다. 오류코드 : ${res.status}`
    );
  }

  const { data } = await res.json();
  console.log(data);
  return data;
};
