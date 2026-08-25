import { Link } from "react-router";

const SessionNav = ({link, url}: {link: string, url: string}) => {
  return (
    <Link
    to={url}
    className="text-stone-500 text-sm hover:underline"
  >
    $ {link}
  </Link>
  );
};

export default SessionNav;
