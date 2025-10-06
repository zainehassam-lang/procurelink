
export default function Section({ title, icon }: { title: string; icon?: React.ReactNode }){
  return <div className="flex items-center gap-2 mb-3">
    {icon}
    <h3 className="text-xl font-semibold">{title}</h3>
  </div>
}
