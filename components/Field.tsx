
export default function Field({ label, children }: { label: string; children: React.ReactNode }){
  return <div className="grid grid-cols-3 items-center gap-3 w-full">
    <div className="label">{label}</div>
    <div className="col-span-2">{children}</div>
  </div>
}
