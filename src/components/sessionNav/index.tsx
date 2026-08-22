const SessionNav = ({link, url}: {link: string, url: string}) => {
  return (
    <a
    href={url}
    className="text-stone-500 text-sm hover:underline"
  >
    $ {link}
  </a>
  );
};

export default SessionNav;
