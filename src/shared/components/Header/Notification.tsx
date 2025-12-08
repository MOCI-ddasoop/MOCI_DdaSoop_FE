import Link from "next/link";
import { NotificationProps } from "./UserMenu";

function Notification({
  notification: { read, href, type, comment },
  onClick,
}: {
  notification: NotificationProps;
  onClick: () => void;
}) {
  return (
    <li
      className={`${
        read
          ? "bg-gray-100 hover:shadow-2xs text-gray-500"
          : "bg-pastelblue hover:shadow"
      } w-50 px-2 py-1 rounded-lg`}
    >
      <Link href={href} onClick={onClick}>
        <span className="text-sm">{type}</span>
        <p className="truncate">{comment}</p>
      </Link>
    </li>
  );
}

export default Notification;
