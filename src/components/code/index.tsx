const Code = ({ script }: {script: string}) => (
  <h2 className="font-normal text-primary text-sm mb-2">
    gabriel@internet:<span className="text-stone-500">~$ {script} <span className="animate-type text-primarydim">█</span></span>
  </h2>
);

export default Code;
