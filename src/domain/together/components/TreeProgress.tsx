import Image from "next/image";
function TreeProgress({ progress }: { progress: number }) {
  // TODO : 나무이미지 바꾸기
  return (
    <div className="relative w-7/10 m-auto aspect-square flex-center">
      {progress <= 25 ? (
        <Image
          src="/loginTree.svg"
          fill
          alt="나무이미지"
          className="object-contain"
          priority
        />
      ) : progress <= 50 ? (
        <Image
          src="/loginTree.svg"
          fill
          alt="나무이미지"
          className="object-contain"
          priority
        />
      ) : progress <= 75 ? (
        <Image
          src="/loginTree.svg"
          fill
          alt="나무이미지"
          className="object-contain"
          priority
        />
      ) : (
        <Image
          src="/loginTree.svg"
          fill
          alt="나무이미지"
          className="object-contain"
          priority
        />
      )}
    </div>
  );
}

export default TreeProgress;
