import CardImage from "./CardImage";

interface CardContainerProps {
  data: {
    id: number;
    src: string;
    alt: string;
  }[];
}

function CardContainer({ data }: CardContainerProps) {
  return (
    <div className="w-fit grid grid-cols-5 gap-4">
      {data.map((item) => (
        <CardImage
          key={item.id}
          src={item.src}
          alt={item.alt}
          className="w-44 h-95"
        />
      ))}
    </div>
  );
}
export default CardContainer;
