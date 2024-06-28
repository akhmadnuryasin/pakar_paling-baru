interface Announcement {
  judul: string;
  isi: string;
  dibuat_pada: string;
}

interface RecentSalesProps {
  data: Announcement[];
}

export function RecentSales({ data }: RecentSalesProps) {
  return (
    <div className='space-y-8'>
      {data.map((item, index) => (
        <div key={index} className='flex items-center'>
          <div className='ml-4 space-y-3'>
            <p className='text-sm font-medium leading-none'>{item.judul}</p>
            <p className='text-sm text-muted-foreground'>
              {item.isi}
            </p>
            <p className='mt-2 text-sm leading-none underline text-muted-foreground'>
              {new Date(item.dibuat_pada).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
